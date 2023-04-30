import express from "express";
const cors = require("cors");
//routes
import orderPickingRouter from "./routes/orderPickingRouter";

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json(), cors({ origin: port }));

//routes
app.use("/order-picking", orderPickingRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
