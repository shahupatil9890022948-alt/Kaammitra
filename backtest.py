from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable, Optional

import matplotlib
import numpy as np
import pandas as pd

import config
from indicators import add_indicators
from strategy import add_strategy_columns

# Agg backend keeps plotting compatible with headless Linux and Pydroid.
matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402  (import after backend selection)


def log_info(message: str) -> None:
    """Simple timestamped logger for clean console output."""
    if config.VERBOSE_LOGGING:
        stamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{stamp}] {message}")


def _parse_time(time_text: str) -> datetime.time:
    return datetime.strptime(time_text, "%H:%M").time()


def _round(value: float) -> float:
    return round(float(value), config.ROUND_DECIMALS)


def _parse_datetime_column(series: pd.Series) -> pd.Series:
    """Try configured datetime formats and return best parsed result."""
    best = pd.to_datetime(series, errors="coerce")
    best_count = best.notna().sum()

    for fmt in config.DATETIME_FORMATS:
        parsed = pd.to_datetime(series, format=fmt, errors="coerce")
        valid_count = parsed.notna().sum()
        if valid_count > best_count:
            best = parsed
            best_count = valid_count
    return best


def load_ohlcv_csv(file_path: str | Path) -> pd.DataFrame:
    """Load and sanitize OHLCV CSV for backtest use."""
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"CSV file not found: {path}")

    raw = pd.read_csv(path)
    if raw.empty:
        raise ValueError(f"CSV file is empty: {path}")

    # Map incoming column names to lowercase canonical names.
    rename_map = {column: str(column).strip().lower() for column in raw.columns}
    data = raw.rename(columns=rename_map)

    required_columns = [
        config.DATETIME_COLUMN,
        config.OPEN_COLUMN,
        config.HIGH_COLUMN,
        config.LOW_COLUMN,
        config.CLOSE_COLUMN,
        config.VOLUME_COLUMN,
    ]
    missing = [column for column in required_columns if column not in data.columns]
    if missing:
        raise ValueError(f"Missing required columns: {missing}")

    # Symbol is optional; default to NIFTY if absent.
    if config.SYMBOL_COLUMN not in data.columns:
        data[config.SYMBOL_COLUMN] = config.DEFAULT_SYMBOL

    original_rows = len(data)
    data[config.SYMBOL_COLUMN] = (
        data[config.SYMBOL_COLUMN].astype(str).str.strip().str.upper()
    )

    data[config.DATETIME_COLUMN] = _parse_datetime_column(data[config.DATETIME_COLUMN])
    numeric_columns = [
        config.OPEN_COLUMN,
        config.HIGH_COLUMN,
        config.LOW_COLUMN,
        config.CLOSE_COLUMN,
        config.VOLUME_COLUMN,
    ]
    for column in numeric_columns:
        data[column] = pd.to_numeric(data[column], errors="coerce")

    # Remove invalid rows safely to avoid indicator/backtest errors.
    data = data.dropna(
        subset=[config.SYMBOL_COLUMN, config.DATETIME_COLUMN, *numeric_columns]
    ).copy()

    # Keep only requested symbols to prevent accidental symbol pollution.
    data = data[data[config.SYMBOL_COLUMN].isin(config.SUPPORTED_SYMBOLS)].copy()

    # Remove duplicate timestamp rows for same symbol, keeping latest row.
    data = data.sort_values(config.DATETIME_COLUMN)
    data = data.drop_duplicates(
        subset=[config.SYMBOL_COLUMN, config.DATETIME_COLUMN], keep="last"
    )
    data = data.reset_index(drop=True)

    dropped_rows = original_rows - len(data)
    if dropped_rows > 0:
        log_info(f"Dropped {dropped_rows} invalid/unsupported rows from input data.")

    if data.empty:
        raise ValueError("No valid rows available after cleaning input CSV.")

    _log_missing_interval_warnings(data)
    return data


def _log_missing_interval_warnings(data: pd.DataFrame) -> None:
    """Warn when candle gaps are larger than expected timeframe."""
    threshold = config.TIMEFRAME_MINUTES * 1.5
    gap_count = 0
    for (_, _), group in data.groupby([config.SYMBOL_COLUMN, data[config.DATETIME_COLUMN].dt.date]):
        diffs = group[config.DATETIME_COLUMN].diff().dt.total_seconds().div(60.0)
        gap_count += int((diffs > threshold).sum())
    if gap_count > 0:
        log_info(
            f"Warning: detected {gap_count} larger-than-expected candle gaps; continuing safely."
        )


@dataclass
class BacktestOutput:
    trades: pd.DataFrame
    summary: pd.DataFrame
    equity_curve: pd.DataFrame
    chart_files: list[str]


class BacktestEngine:
    def __init__(self) -> None:
        self.entry_start = _parse_time(config.ENTRY_START_TIME)
        self.entry_end = _parse_time(config.ENTRY_END_TIME)
        self.forced_exit = _parse_time(config.FORCED_EXIT_TIME)

    def _is_entry_window(self, candle_time: datetime.time) -> bool:
        return self.entry_start <= candle_time <= self.entry_end

    def run(self, data: pd.DataFrame, symbols: Optional[Iterable[str]] = None) -> BacktestOutput:
        """Run full strategy backtest and return trades, metrics, and charts."""
        selected_symbols = sorted(set(data[config.SYMBOL_COLUMN].unique()))
        if symbols:
            selected_symbols = [s.upper() for s in symbols if s.upper() in selected_symbols]

        if not selected_symbols:
            raise ValueError("No matching symbols found in data after filtering.")

        log_info(f"Running backtest for symbols: {', '.join(selected_symbols)}")

        enriched = add_indicators(data)
        enriched = add_strategy_columns(enriched)
        enriched = enriched.sort_values([config.SYMBOL_COLUMN, config.DATETIME_COLUMN]).reset_index(drop=True)

        all_trades: list[dict] = []
        chart_files: list[str] = []

        for symbol in selected_symbols:
            symbol_data = enriched[enriched[config.SYMBOL_COLUMN] == symbol].copy()
            symbol_trades = self._run_symbol(symbol, symbol_data)
            all_trades.extend(symbol_trades)

            if config.ENABLE_PLOTS:
                chart_path = config.PRICE_CHART_FILE_TEMPLATE.format(symbol=symbol)
                self.plot_price_chart(symbol_data, pd.DataFrame(symbol_trades), chart_path)
                chart_files.append(chart_path)

        trades_df = pd.DataFrame(all_trades)
        if not trades_df.empty:
            trades_df = trades_df.sort_values("entry_time").reset_index(drop=True)

        equity_curve = self.build_equity_curve(trades_df)
        summary_df = self.build_summary(trades_df, selected_symbols)

        if config.ENABLE_PLOTS:
            self.plot_equity_curve(equity_curve, config.EQUITY_CHART_FILE)
            chart_files.append(config.EQUITY_CHART_FILE)
            if config.SHOW_PLOTS:
                plt.show()

        self.export_results(trades_df, summary_df, equity_curve)
        return BacktestOutput(
            trades=trades_df,
            summary=summary_df,
            equity_curve=equity_curve,
            chart_files=chart_files,
        )

    def _run_symbol(self, symbol: str, symbol_data: pd.DataFrame) -> list[dict]:
        """Execute order simulation for one symbol with one active trade at a time."""
        trades: list[dict] = []
        active_trade: Optional[dict] = None
        pending_signal: Optional[dict] = None

        for _, row in symbol_data.iterrows():
            candle_dt = row[config.DATETIME_COLUMN]
            candle_day = candle_dt.date()
            candle_time = candle_dt.time()

            # Expire pending signal if day changed or entry window is over.
            if pending_signal is not None:
                if candle_day != pending_signal["signal_day"] or candle_time > self.entry_end:
                    pending_signal = None

            # Manage an active trade first so exits are handled before new entries.
            if active_trade is not None and candle_dt > active_trade["entry_time"]:
                hit_stop = row[config.LOW_COLUMN] <= active_trade["stop_loss"]
                hit_target = row[config.HIGH_COLUMN] >= active_trade["target_price"]
                force_exit = candle_time >= self.forced_exit

                exit_price = None
                exit_reason = None

                if hit_stop and hit_target:
                    if config.AMBIGUOUS_HIT_PRIORITY.lower() == "target":
                        exit_price = active_trade["target_price"]
                        exit_reason = "target_and_stop_hit_target_priority"
                    else:
                        exit_price = active_trade["stop_loss"]
                        exit_reason = "stop_and_target_hit_stop_priority"
                elif hit_stop:
                    exit_price = active_trade["stop_loss"]
                    exit_reason = "stop_loss"
                elif hit_target:
                    exit_price = active_trade["target_price"]
                    exit_reason = "target"
                elif force_exit:
                    exit_price = row[config.CLOSE_COLUMN]
                    exit_reason = "time_exit_15_15"

                if exit_price is not None:
                    trades.append(
                        self._build_trade_record(active_trade, candle_dt, float(exit_price), exit_reason)
                    )
                    active_trade = None
                    pending_signal = None
                    continue

            # Trigger pending breakout entry on a later candle.
            if active_trade is None and pending_signal is not None:
                if candle_dt > pending_signal["signal_time"] and candle_day == pending_signal["signal_day"]:
                    if row[config.HIGH_COLUMN] >= pending_signal["signal_high"]:
                        entry_price = float(pending_signal["signal_high"])
                        if config.ALLOW_GAP_ENTRY_AT_OPEN and row[config.OPEN_COLUMN] > entry_price:
                            entry_price = float(row[config.OPEN_COLUMN])

                        risk = entry_price - pending_signal["stop_loss"]
                        if risk > 0:
                            active_trade = {
                                "symbol": symbol,
                                "signal_time": pending_signal["signal_time"],
                                "entry_time": candle_dt,
                                "entry_price": entry_price,
                                "stop_loss": pending_signal["stop_loss"],
                                "target_price": entry_price + (risk * config.RISK_REWARD_RATIO),
                                "risk_per_unit": risk,
                            }
                        pending_signal = None
                        continue

            # Scan for new signal only when no active/pending setup exists.
            if active_trade is None and pending_signal is None and self._is_entry_window(candle_time):
                if bool(row.get("signal_condition", False)):
                    pending_signal = {
                        "signal_time": candle_dt,
                        "signal_day": candle_day,
                        "signal_high": float(row[config.HIGH_COLUMN]),
                        "stop_loss": float(row[config.LOW_COLUMN]),
                    }

        # Final safety exit when data ends with active position.
        if active_trade is not None and not symbol_data.empty:
            last_row = symbol_data.iloc[-1]
            trades.append(
                self._build_trade_record(
                    active_trade,
                    last_row[config.DATETIME_COLUMN],
                    float(last_row[config.CLOSE_COLUMN]),
                    "end_of_data_exit",
                )
            )

        log_info(f"{symbol}: completed with {len(trades)} trades.")
        return trades

    @staticmethod
    def _build_trade_record(active_trade: dict, exit_time: pd.Timestamp, exit_price: float, exit_reason: str) -> dict:
        pnl = exit_price - active_trade["entry_price"]
        risk = active_trade["risk_per_unit"]
        r_multiple = pnl / risk if risk else np.nan
        return {
            "symbol": active_trade["symbol"],
            "signal_time": active_trade["signal_time"],
            "entry_time": active_trade["entry_time"],
            "exit_time": exit_time,
            "entry_price": active_trade["entry_price"],
            "stop_loss": active_trade["stop_loss"],
            "target_price": active_trade["target_price"],
            "exit_price": exit_price,
            "pnl": pnl,
            "r_multiple": r_multiple,
            "exit_reason": exit_reason,
            "is_win": pnl > 0,
        }

    @staticmethod
    def build_equity_curve(trades_df: pd.DataFrame) -> pd.DataFrame:
        if trades_df.empty:
            return pd.DataFrame(columns=["exit_time", "equity"])
        curve = trades_df.sort_values("exit_time")[["exit_time", "pnl"]].copy()
        curve["equity"] = curve["pnl"].cumsum()
        return curve[["exit_time", "equity"]]

    def build_summary(self, trades_df: pd.DataFrame, symbols: list[str]) -> pd.DataFrame:
        rows = []
        for symbol in symbols:
            symbol_trades = trades_df[trades_df["symbol"] == symbol].copy() if not trades_df.empty else pd.DataFrame()
            rows.append(self._symbol_metrics(symbol, symbol_trades))
        rows.append(self._symbol_metrics("TOTAL", trades_df))
        return pd.DataFrame(rows)

    @staticmethod
    def _symbol_metrics(symbol: str, trades_df: pd.DataFrame) -> dict:
        if trades_df.empty:
            return {
                "symbol": symbol,
                "net_profit": 0.0,
                "win_rate_pct": 0.0,
                "profit_factor": 0.0,
                "max_drawdown": 0.0,
                "avg_r_multiple": 0.0,
                "expectancy": 0.0,
                "total_trades": 0,
            }

        pnl = trades_df["pnl"].astype(float)
        gross_profit = pnl[pnl > 0].sum()
        gross_loss = pnl[pnl < 0].sum()
        win_rate = float((trades_df["is_win"].sum() / len(trades_df)) * 100.0)

        if gross_loss < 0:
            profit_factor = float(gross_profit / abs(gross_loss))
        else:
            profit_factor = float("inf") if gross_profit > 0 else 0.0

        equity = pnl.cumsum()
        drawdown = equity - equity.cummax()
        max_drawdown = abs(float(drawdown.min())) if not drawdown.empty else 0.0

        return {
            "symbol": symbol,
            "net_profit": _round(pnl.sum()),
            "win_rate_pct": _round(win_rate),
            "profit_factor": _round(profit_factor) if np.isfinite(profit_factor) else float("inf"),
            "max_drawdown": _round(max_drawdown),
            "avg_r_multiple": _round(trades_df["r_multiple"].mean()),
            "expectancy": _round(pnl.mean()),
            "total_trades": int(len(trades_df)),
        }

    @staticmethod
    def export_results(trades_df: pd.DataFrame, summary_df: pd.DataFrame, equity_curve: pd.DataFrame) -> None:
        trades_df.to_csv(config.TRADES_EXPORT_FILE, index=False)
        summary_df.to_csv(config.RESULTS_EXPORT_FILE, index=False)
        equity_curve.to_csv(config.EQUITY_EXPORT_FILE, index=False)
        log_info(
            f"Exported {config.TRADES_EXPORT_FILE}, {config.RESULTS_EXPORT_FILE}, and {config.EQUITY_EXPORT_FILE}"
        )

    @staticmethod
    def plot_equity_curve(equity_curve: pd.DataFrame, output_file: str) -> None:
        if equity_curve.empty:
            log_info("No trades found. Skipping equity curve plot.")
            return
        plt.figure(figsize=(10, 5))
        plt.plot(equity_curve["exit_time"], equity_curve["equity"], linewidth=1.8, color="navy")
        plt.title("Equity Curve")
        plt.xlabel("Exit Time")
        plt.ylabel("Equity (Points)")
        plt.grid(alpha=0.25)
        plt.tight_layout()
        plt.savefig(output_file, dpi=140)
        plt.close()
        log_info(f"Saved equity chart: {output_file}")

    @staticmethod
    def plot_price_chart(symbol_data: pd.DataFrame, symbol_trades: pd.DataFrame, output_file: str) -> None:
        if symbol_data.empty:
            return

        plt.figure(figsize=(12, 5))
        plt.plot(
            symbol_data[config.DATETIME_COLUMN],
            symbol_data[config.CLOSE_COLUMN],
            linewidth=1.2,
            label="Close",
            color="black",
        )
        plt.plot(symbol_data[config.DATETIME_COLUMN], symbol_data["ema_fast"], linewidth=1.0, label="EMA 15")
        plt.plot(symbol_data[config.DATETIME_COLUMN], symbol_data["ema_slow"], linewidth=1.0, label="EMA 30")
        plt.plot(symbol_data[config.DATETIME_COLUMN], symbol_data["vwap"], linewidth=1.0, label="VWAP")

        if not symbol_trades.empty:
            plt.scatter(
                symbol_trades["entry_time"],
                symbol_trades["entry_price"],
                marker="^",
                s=60,
                color="green",
                label="Entries",
                zorder=3,
            )
            plt.scatter(
                symbol_trades["exit_time"],
                symbol_trades["exit_price"],
                marker="x",
                s=60,
                color="red",
                label="Exits",
                zorder=3,
            )

        symbol_name = str(symbol_data[config.SYMBOL_COLUMN].iloc[0])
        plt.title(f"{symbol_name} Price with Entry/Exit Points")
        plt.xlabel("Time")
        plt.ylabel("Price")
        plt.legend(loc="best")
        plt.grid(alpha=0.2)
        plt.tight_layout()
        plt.savefig(output_file, dpi=140)
        plt.close()
        log_info(f"Saved price chart: {output_file}")
