import numpy as np
import pandas as pd

import config


def _slope_pct(series: pd.Series, lookback: int) -> pd.Series:
    """Percent slope over N candles, safe for divide-by-zero/missing values."""
    previous = series.shift(lookback)
    slope = ((series - previous) / previous.replace({0: np.nan})) * 100.0
    return slope.replace([np.inf, -np.inf], np.nan)


def add_strategy_columns(df: pd.DataFrame) -> pd.DataFrame:
    """
    Precompute all strategy features and boolean signal conditions.
    Entry breakout/SL/target handling is done in backtest execution.
    """
    result = df.copy()

    # Candle body size used for momentum body expansion condition.
    result["body_size"] = (result[config.CLOSE_COLUMN] - result[config.OPEN_COLUMN]).abs()

    grouped = result.groupby(config.SYMBOL_COLUMN, group_keys=False)

    # Use previous 6 candles average (exclude current candle with shift(1)).
    result["avg_volume_prev"] = grouped[config.VOLUME_COLUMN].transform(
        lambda s: s.shift(1).rolling(config.VOLUME_LOOKBACK, min_periods=config.VOLUME_LOOKBACK).mean()
    )
    result["avg_body_prev"] = grouped["body_size"].transform(
        lambda s: s.shift(1).rolling(config.BODY_LOOKBACK, min_periods=config.BODY_LOOKBACK).mean()
    )

    result["ema_fast_slope_pct"] = grouped["ema_fast"].transform(
        lambda s: _slope_pct(s, config.EMA_SLOPE_LOOKBACK)
    )
    result["ema_slow_slope_pct"] = grouped["ema_slow"].transform(
        lambda s: _slope_pct(s, config.EMA_SLOPE_LOOKBACK)
    )

    # Build all signal filters as explicit columns for easier debugging and logging.
    result["cond_ema_trend"] = result["ema_fast"] > result["ema_slow"]
    result["cond_slope_fast"] = (
        result["ema_fast_slope_pct"] >= config.EMA_FAST_SLOPE_MIN_PCT
    )
    result["cond_slope_slow"] = (
        result["ema_slow_slope_pct"] >= config.EMA_SLOW_SLOPE_MIN_PCT
    )
    result["cond_volume"] = result[config.VOLUME_COLUMN] >= (
        config.VOLUME_MULTIPLIER * result["avg_volume_prev"]
    )
    result["cond_body"] = result["body_size"] >= (
        config.BODY_MULTIPLIER * result["avg_body_prev"]
    )
    result["cond_vwap"] = result[config.CLOSE_COLUMN] > result["vwap"]

    result["signal_condition"] = (
        result["cond_ema_trend"]
        & result["cond_slope_fast"]
        & result["cond_slope_slow"]
        & result["cond_volume"]
        & result["cond_body"]
        & result["cond_vwap"]
    )

    return result
