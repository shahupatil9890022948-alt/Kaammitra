# Strategy and backtest configuration for NIFTY/BANKNIFTY 3-minute data.

# ----------------------------
# Input / output configuration
# ----------------------------
DATA_FILE = "historical_data.csv"
TRADES_EXPORT_FILE = "trades.csv"
RESULTS_EXPORT_FILE = "results.csv"
EQUITY_EXPORT_FILE = "equity_curve.csv"
PRICE_CHART_FILE_TEMPLATE = "price_chart_{symbol}.png"
EQUITY_CHART_FILE = "equity_curve.png"

# ----------------------------
# CSV column configuration
# ----------------------------
DATETIME_COLUMN = "datetime"
SYMBOL_COLUMN = "symbol"
OPEN_COLUMN = "open"
HIGH_COLUMN = "high"
LOW_COLUMN = "low"
CLOSE_COLUMN = "close"
VOLUME_COLUMN = "volume"
DEFAULT_SYMBOL = "NIFTY"
SUPPORTED_SYMBOLS = ("NIFTY", "BANKNIFTY")

# Supported datetime parse formats tried in order.
DATETIME_FORMATS = (
    None,  # Let pandas infer first.
    "%Y-%m-%d %H:%M:%S",
    "%d-%m-%Y %H:%M:%S",
    "%Y/%m/%d %H:%M:%S",
)

# ----------------------------
# Strategy indicator settings
# ----------------------------
TIMEFRAME_MINUTES = 3
EMA_FAST_PERIOD = 15
EMA_SLOW_PERIOD = 30
EMA_SLOPE_LOOKBACK = 2

# "Strong slope" threshold in percentage change over EMA_SLOPE_LOOKBACK candles.
EMA_FAST_SLOPE_MIN_PCT = 0.03
EMA_SLOW_SLOPE_MIN_PCT = 0.02

VOLUME_LOOKBACK = 6
BODY_LOOKBACK = 6
VOLUME_MULTIPLIER = 2.0
BODY_MULTIPLIER = 1.5
RISK_REWARD_RATIO = 2.0

# ----------------------------
# Session / execution settings
# ----------------------------
ENTRY_START_TIME = "09:20"
ENTRY_END_TIME = "11:30"
FORCED_EXIT_TIME = "15:15"

# If candle opens above breakout level, enter at candle open.
ALLOW_GAP_ENTRY_AT_OPEN = True

# When stop and target are both hit in one candle, use conservative exit.
AMBIGUOUS_HIT_PRIORITY = "stop"  # options: "stop", "target"

# ----------------------------
# Runtime behavior
# ----------------------------
ENABLE_PLOTS = True
SHOW_PLOTS = False
VERBOSE_LOGGING = True
ROUND_DECIMALS = 2
