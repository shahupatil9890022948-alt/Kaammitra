# NIFTY/BANKNIFTY 3-Minute Strategy Backtester

Lightweight Python backtesting project designed to run unchanged on:
- Android (Pydroid 3)
- Windows

## Project Structure

- `main.py` - CLI runner
- `config.py` - all thresholds and runtime settings
- `indicators.py` - EMA and VWAP calculations
- `strategy.py` - signal condition logic
- `backtest.py` - execution engine, metrics, exports, charts

## Install

Install only the required libraries:

- `pandas`
- `numpy`
- `matplotlib`

## CSV Format

Required columns (case-insensitive):

- `datetime`
- `open`
- `high`
- `low`
- `close`
- `volume`

Optional:

- `symbol` (`NIFTY` / `BANKNIFTY`; defaults to `NIFTY` if missing)

## Run

Backtest all symbols in file:

`python main.py --csv historical_data.csv`

Backtest only one symbol:

`python main.py --csv historical_data.csv --symbol NIFTY`

## Output Files

- `trades.csv` - trade-by-trade details
- `results.csv` - summary metrics
- `equity_curve.csv` - equity points over exits
- `price_chart_NIFTY.png`, `price_chart_BANKNIFTY.png` - entry/exit chart
- `equity_curve.png` - equity curve chart
