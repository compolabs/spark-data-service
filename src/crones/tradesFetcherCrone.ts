import { schedule } from "node-cron";
import TradesFetcher from "../services/tradesFetcher";

export const initTradesFetcherCrone = async () => {
  const fetcher = new TradesFetcher();
  await fetcher.init().then(() => console.log("✅ Trades Fetcher initialized"));
  const scheduledJobFunction = schedule("*/5 * * * * *", fetcher.fetchNewTrades);

  scheduledJobFunction.start();

  console.log("✅ Trades Fetcher Crone started");
};
