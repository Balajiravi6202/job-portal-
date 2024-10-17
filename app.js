import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import dbmongoose from "./config/db.config.js";
import jobroute from "../server/routes/job.route.js";
import applyroute from "../server/routes/apply.route.js";
import errorHandler from "./middleware/error.js";
dotenv.config()

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use("/api", jobroute);
app.use("/api", applyroute);

app.use(errorHandler);

app.listen(port, async () => {
  try {
    await console.log(`Server is running on port ${port}`);
    await dbmongoose;
    console.log("Database Connection Done!!");
  } catch (error) {
    console.log(error);
  }
});
