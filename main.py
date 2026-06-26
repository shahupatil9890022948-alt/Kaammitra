import argparse
from pathlib import Path

import pandas as pd

import config
from backtest import BacktestEngine, load_ohlcv_csv, log_info


def parse_arguments() -> argparse.Namespace:
    """Parse CLI arguments for Android/Windows friendly command usage."""
    parser = argparse.ArgumentParser(
        description="NIFTY/BANKNIFTY 3-minute EMA/VWAP breakout strategy backtester"
    )
    parser.add_argument(
        "--csv",
        default=config.DATA_FILE,
        help=f"Path to OHLCV CSV file (default: {config.DATA_FILE})",
    )
    parser.add_argument(
        "--symbol",
        default="ALL",
        help="Symbol to test: NIFTY, BANKNIFTY, or ALL (default).",
    )
    return parser.parse_args()


def print_summary(summary_df: pd.DataFrame) -> None:
    """Print a clean metrics table to terminal output."""
    if summary_df.empty:
        print("\nNo summary available.\n")
        return

    print("\n===== Backtest Summary =====")
    for _, row in summary_df.iterrows():
        print(
            f"{row['symbol']:<10} | Trades: {int(row['total_trades']):<4d} "
            f"| Net: {row['net_profit']:<10} | Win%: {row['win_rate_pct']:<8} "
            f"| PF: {row['profit_factor']:<8} | MaxDD: {row['max_drawdown']:<8} "
            f"| AvgR: {row['avg_r_multiple']:<8} | Expectancy: {row['expectancy']}"
        )
    print("============================\n")


def main() -> None:
    # Entry point: load data, run backtest, export files, and print concise outputs.
    args = parse_arguments()
    csv_path = Path(args.csv)
    requested_symbol = args.symbol.strip().upper()

    log_info(f"Loading data from: {csv_path}")
    data = load_ohlcv_csv(csv_path)

    symbols = None
    if requested_symbol != "ALL":
        symbols = [requested_symbol]
        log_info(f"Filtering to requested symbol: {requested_symbol}")

    engine = BacktestEngine()
    output = engine.run(data, symbols=symbols)

    print_summary(output.summary)
    print(f"Trades exported: {config.TRADES_EXPORT_FILE}")
    print(f"Summary exported: {config.RESULTS_EXPORT_FILE}")
    print(f"Equity exported: {config.EQUITY_EXPORT_FILE}")
    if output.chart_files:
        print("Charts:")
        for chart in output.chart_files:
            print(f" - {chart}")


if __name__ == "__main__":
    main()
