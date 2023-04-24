import mongoose from "mongoose";
import { app } from "./app";
import { mongoUrl, port } from "./config";
import { initOrderFetcherCrone } from "./crones/orderFetcherCrone";
import { initTradesFetcherCrone } from "./crones/tradesFetcherCrone";

// Connect to MongoDB
// mongoose.Promise = bluebird;
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  })
  .catch((err) => {
    console.log(`❌  MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    // process.exit();
  });

Promise.all([initOrderFetcherCrone(), initTradesFetcherCrone()]).then(() => {
  app.listen(port ?? 5000, () => {
    console.log("🚀 Server ready at: http://localhost:" + port);
  });
});
