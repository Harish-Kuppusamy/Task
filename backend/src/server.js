const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fetchAndSaveData = require("./services/etl");
const cors = require("cors");
const DistrictMetric = require("./models/DistrictMetric");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("MGNREGA Backend OK"));

app.get("/data/:state", async (req, res) => {
  try {
    const state = decodeURIComponent(req.params.state);
    const data = await DistrictMetric.find({ state : { $regex: new RegExp(`^${state}$`, "i")  } });
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
