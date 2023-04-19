import mongoose from "mongoose";
import { app } from "./app";
import { port } from "./config";
import cron from "node-cron";
import { updateOrdersData } from "./services/orderService";

// Connect to MongoDB
// mongoose.Promise = bluebird;
const mongoUrl = "mongodb://superadmin:1488mongo228@localhost:27017/?authSource=admin";
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅  Connected to MongoDB");
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  })
  .catch((err) => {
    console.log(`❌  MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    // process.exit();
  });

//keep updating all the time
cron.schedule("0 */3 * * *", () => {
  updateOrdersData().catch((e) => console.log("❌  Update pools statistics Error: ", e));
});

app.listen(port ?? 5000, () => {
  console.log("🚀 Server ready at: http://localhost:" + port);
});
