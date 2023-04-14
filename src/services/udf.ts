import Binance from "./binance";
import { ITrade, Trade } from "../models/Trade";
import dayjs from "dayjs";
import { IToken, TOKENS_BY_SYMBOL } from "../constants";
import BN from "../utils/BN";
import request from "request";

class UDFError extends Error {}

class SymbolNotFound extends UDFError {}

class InvalidResolution extends UDFError {}

type TSymbol = {
  symbol: string;
  ticker: string;
  name: string;
  full_name: string;
  description: string;
  currency_code: string;
};

const supportedResolutions = [
  "1",
  "3",
  "5",
  "15",
  "30",
  "60",
  "120",
  "240",
  "360",
  "480",
  "720",
  "1D",
  "3D",
  "1W",
  "1M",
];

const symbols = ["ETH", "BTC", "USDC", "UNI", "LINK", "COMP"].reduce((acc, symbol0, _, arr) => {
  const batch = arr.map((symbol1) => ({
    symbol: `${symbol0}${symbol1}`,
    ticker: `${symbol0}${symbol1}`,
    name: `${symbol0}${symbol1}`,
    full_name: `${symbol0}${symbol1}`,
    description: `${symbol0} / ${symbol1}`,
    currency_code: symbol1,
    exchange: "SPARK",
    listed_exchange: "SPARK",
    type: "crypto",
    session: "24x7",
    timezone: "UTC",
    minmovement: 1,
    minmov: 1,
    minmovement2: 0,
    minmov2: 0,
    // pricescale: pricescale(symbol),
    supported_resolutions: supportedResolutions,
    has_intraday: true,
    has_daily: true,
    has_weekly_and_monthly: true,
    data_status: "streaming",
  }));
  return [...acc, ...batch];
}, [] as Array<TSymbol>);
const allSymbols = symbols.map(({ symbol }) => symbol);
export default class UDF {
  binance: Binance;

  constructor() {
    this.binance = new Binance();
  }

  config() {
    return {
      exchanges: [
        {
          value: "SPARK",
          name: "Spark",
          desc: "Spark",
        },
      ],
      symbols_types: [
        {
          value: "crypto",
          name: "Cryptocurrency",
        },
      ],
      supported_resolutions: supportedResolutions,
      supports_search: true,
      supports_group_request: false,
      supports_marks: false,
      supports_timescale_marks: false,
      supports_time: true,
    };
  }

  /**
   * Symbol resolve.
   * @param {string} symbol Symbol name or ticker.
   * @returns {object} Symbol.
   */
  symbol(symbol: string) {
    const comps = symbol.split(":");
    const s = (comps.length > 1 ? comps[1] : symbol).toUpperCase();

    for (const symbol of symbols) {
      if (symbol.symbol === s) {
        return symbol;
      }
    }

    throw new SymbolNotFound();
  }

  /**
   * Bars.
   * @param {string} symbol_str - Symbol name or ticker.
   * @param {number} from - Unix timestamp (UTC) of leftmost required bar.
   * @param {number} to - Unix timestamp (UTC) of rightmost required bar.
   * @param {string} resolution
   */
  async history(symbol_str: string, from: number, to: number, resolution: string) {
    // console.log({ from, to });
    const symbol = symbols.find((s) => s.symbol === symbol_str);
    if (symbol == null) throw new SymbolNotFound();
    const assetSymbol0 = symbol.symbol.replace(symbol.currency_code, "");
    const assetSymbol1 = symbol.currency_code;

    const RESOLUTIONS_INTERVALS_MAP: Record<string, string> = {
      "1": "1m",
      "3": "3m",
      "5": "5m",
      "15": "15m",
      "30": "30m",
      "60": "1h",
      "120": "2h",
      "240": "4h",
      "360": "6h",
      "480": "8h",
      "720": "12h",
      D: "1d",
      "1D": "1d",
      "3D": "3d",
      W: "1w",
      "1W": "1w",
      M: "1M",
      "1M": "1M",
    };

    const interval = RESOLUTIONS_INTERVALS_MAP[resolution];
    if (!interval) throw new InvalidResolution();

    let totalKlines: any[] = [];

    from *= 1000;
    to *= 1000;

    ////
    const binance = new Binance();
    const trades = (await binance.trades("BTCUSDT")) as TBinanceTrade[];
    return generateKlinesBinance(
      trades.filter((t) => {
        console.log(t.time, from, to);

        return t.time >= from && t.time <= to;
      }) as any,
      resolution,
      from,
      to
    );
    // const trades = await Trade.find({ timestamp: { $gt: from.toString(), $lt: to.toString() } });
    // const asset0 = TOKENS_BY_SYMBOL[assetSymbol0];
    // const asset1 = TOKENS_BY_SYMBOL[assetSymbol1];
    // const trades = await Trade.find({ asset0: asset0.assetId, asset1: asset1.assetId });
    // //
    // return generateKlines(
    //   trades.map((t) => ({ ...(t as any)._doc, timestamp: tai64ToUnix(t.timestamp).toString() })),
    //   // .filter((t) => +t.timestamp >= to && +t.timestamp <= from)
    //   resolution,
    //   asset0,
    //   asset1
    // );
    // return {
    //   s: klines.length > 0 ? "ok" : "no_data",
    //   t: klines.map(({ timestamp }) => timestamp),
    //   c: klines.map(({ close }) => close),
    //   o: klines.map(({ open }) => open),
    //   h: klines.map(({ high }) => high),
    //   l: klines.map(({ low }) => low),
    //   v: klines.map(({ volume }) => volume),
    // };
    while (true) {
      const klines: any = await this.binance.klines(symbol_str, interval, from, to, 500);

      totalKlines = totalKlines.concat(klines);
      if (klines.length == 500) {
        from = klines[klines.length - 1][0] + 1;
      } else {
        if (totalKlines.length === 0) {
          return { s: "no_data" };
        } else {
          return {
            s: "ok", //status
            t: totalKlines.map((b) => Math.floor(b[0] / 1000)), //timestamp
            c: totalKlines.map((b) => parseFloat(b[4])), //close
            o: totalKlines.map((b) => parseFloat(b[1])), //open
            h: totalKlines.map((b) => parseFloat(b[2])), //high
            l: totalKlines.map((b) => parseFloat(b[3])), //low
            v: totalKlines.map((b) => parseFloat(b[5])), //volume
          };
        }
      }
    }
  }
}

type TKlines = {
  s: "ok" | "no_data";
  o: Array<number>;
  h: Array<number>;
  l: Array<number>;
  c: Array<number>;
  v: Array<number>;
  t: Array<number>;
};

const getTradePrice = (trade: ITrade, asset0: IToken, asset1: IToken): number => {
  const amount0 = BN.formatUnits(trade.amount0, asset0.decimals);
  const amount1 = BN.formatUnits(trade.amount1, asset1.decimals);
  return amount0.div(amount1).toNumber();
};

type TBinanceTrade = {
  time: number;
  price: string;
};

function generateKlinesBinance(trades: TBinanceTrade[], period: string, from: number, to: number) {
  const sorted = trades.slice().sort((a, b) => (+a.time < +b.time ? -1 : 1));
  const result: TKlines = { s: "no_data", t: [], c: [], o: [], h: [], l: [], v: [] };
  if (sorted.length == 0) return result;
  let start = from;
  while (true) {
    const end = +start + getPeriodMs(period) / 1000;
    const batch = sorted.filter(({ time }) => +time >= start && +time < end);
    // .map((v) => (v as any)._doc);
    start = end;
    if (batch.length > 0) {
      if (result.s === "no_data") result.s = "ok";
      const prices = batch.map((t) => +t.price);
      result.t.push(+batch[0].time);
      result.o.push(prices[0]);
      result.c.push(prices[prices.length - 1]);
      result.h.push(Math.max(...prices));
      result.l.push(Math.min(...prices));
      result.v.push(0);
    }
    if (start > +sorted[sorted.length - 1].time) break;
  }
  result.t[result.t.length - 1] = to;
  return result;
}
function generateKlinesBackend(trades: ITrade[], period: string, asset0: IToken, asset1: IToken) {
  const sorted = trades.slice().sort((a, b) => (+a.timestamp < +b.timestamp ? -1 : 1));
  // const grouped = [];
  const result: TKlines = { s: "no_data", t: [], c: [], o: [], h: [], l: [], v: [] };
  let start = +sorted[0].timestamp;
  while (true) {
    const end = +start + getPeriodMs(period) / 1000;
    const batch = sorted.filter(({ timestamp }) => +timestamp >= start && +timestamp < end);
    // .map((v) => (v as any)._doc);
    start = end;
    if (batch.length > 0) {
      if (result.s === "no_data") result.s = "ok";
      const prices = batch.map((t) => getTradePrice(t, asset0, asset1));
      result.t.push(+batch[0].timestamp);
      result.o.push(prices[0]);
      result.c.push(prices[prices.length - 1]);
      result.h.push(Math.max(...prices));
      result.l.push(Math.min(...prices));
      result.v.push(0);
    }
    if (start > +sorted[sorted.length - 1].timestamp) break;
  }
  return result;
  // console.log(grouped);
  // const klines = [];
  // const periodMs = getPeriodMs(period);
  //
  // let startTime = tai64ToUnix(trades[0].timestamp);
  // let endTime = new Date(startTime).getTime() + periodMs;
  // let open = new BN(trades[0].amount1).div(trades[0].amount0);
  // let high = open;
  // let low = open;
  // let close = open;
  // let volume = new BN(trades[0].amount1);
  //
  // for (let i = 1; i < trades.length; i++) {
  //   const trade = trades[i];
  //   const tradeTime = new Date(tai64ToUnix(trade.timestamp)).getTime();
  //
  //   if (tradeTime >= endTime) {
  //     klines.push({
  //       open: open.toNumber(),
  //       high: high.toNumber(),
  //       low: low.toNumber(),
  //       close: close.toNumber(),
  //       volume: volume.toNumber(),
  //       timestamp: startTime,
  //     });
  //
  //     startTime = tai64ToUnix(trade.timestamp);
  //     endTime = tradeTime + periodMs;
  //     open = new BN(trade.amount1).div(trade.amount0);
  //     high = open;
  //     low = open;
  //     close = open;
  //     volume = new BN(trade.amount1);
  //   } else {
  //     const price = new BN(trade.amount1).div(trade.amount0);
  //
  //     if (price > high) {
  //       high = price;
  //     }
  //
  //     if (price < low) {
  //       low = price;
  //     }
  //
  //     close = price;
  //     volume = volume.plus(trade.amount1);
  //   }
  // }
  //
  // klines.push({
  //   open: open.toNumber(),
  //   high: high.toNumber(),
  //   low: low.toNumber(),
  //   close: close.toNumber(),
  //   volume: volume.toNumber(),
  //   timestamp: startTime,
  // });
  //
  // return klines;
}

function tai64ToUnix(timestamp: number | string) {
  const time = BigInt(timestamp) - BigInt(Math.pow(2, 62)) - BigInt(10);
  return dayjs(Number(time) * 1000).unix();
}

function getPeriodMs(period: string): number {
  const map: Record<string, number> = {
    "1": 60 * 1000,
    "3": 3 * 60 * 1000,
    "5": 5 * 60 * 1000,
    "15": 15 * 60 * 1000,
    "30": 30 * 60 * 1000,
    "60": 60 * 60 * 1000,
    "120": 2 * 60 * 60 * 1000,
    "240": 4 * 60 * 60 * 1000,
    "360": 6 * 60 * 60 * 1000,
    "480": 8 * 60 * 60 * 1000,
    "720": 12 * 60 * 60 * 1000,
    D: 24 * 60 * 60 * 1000,
    "1D": 24 * 60 * 60 * 1000,
    "3D": 3 * 24 * 60 * 60 * 1000,
    W: 7 * 24 * 60 * 60 * 1000,
    "1W": 7 * 24 * 60 * 60 * 1000,
    M: 30 * 24 * 60 * 60 * 1000,
    "1M": 30 * 24 * 60 * 60 * 1000,
  };
  if (map[period] != null) {
    return map[period];
  } else {
    throw new Error(`Invalid period: ${period}`);
  }
}
