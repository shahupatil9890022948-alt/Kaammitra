import pandas as pd

import config


def calculate_ema(series: pd.Series, period: int) -> pd.Series:
    """Return exponential moving average with missing-safe behavior."""
    if series.empty:
        return series
    return series.ewm(span=period, adjust=False, min_periods=period).mean()


def calculate_intraday_vwap(df: pd.DataFrame) -> pd.Series:
    """
    Return intraday VWAP reset each day for each symbol.
    Uses Typical Price = (high + low + close) / 3.
    """
    if df.empty:
        return pd.Series(index=df.index, dtype="float64")

    typical_price = (
        df[config.HIGH_COLUMN] + df[config.LOW_COLUMN] + df[config.CLOSE_COLUMN]
    ) / 3.0
    tpv = typical_price * df[config.VOLUME_COLUMN]

    day_key = df[config.DATETIME_COLUMN].dt.date
    group_keys = [df[config.SYMBOL_COLUMN], day_key]
    cumulative_tpv = tpv.groupby(group_keys).cumsum()
    cumulative_volume = df[config.VOLUME_COLUMN].groupby(group_keys).cumsum()

    # Avoid division by zero by converting 0 to NA, then filling with NaN.
    vwap = cumulative_tpv / cumulative_volume.replace({0: pd.NA})
    return vwap.astype("float64")


def add_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """Append EMA fast/slow and VWAP columns to input data."""
    enriched = df.copy()

    # EMA is computed symbol-wise to prevent cross-symbol contamination.
    grouped_close = enriched.groupby(config.SYMBOL_COLUMN)[config.CLOSE_COLUMN]
    enriched["ema_fast"] = grouped_close.transform(
        lambda s: calculate_ema(s, config.EMA_FAST_PERIOD)
    )
    enriched["ema_slow"] = grouped_close.transform(
        lambda s: calculate_ema(s, config.EMA_SLOW_PERIOD)
    )

    # VWAP resets every symbol/day.
    enriched["vwap"] = calculate_intraday_vwap(enriched)
    return enriched
