const mongoose = require("mongoose");

const districtMetricSchema = new mongoose.Schema(
  {
    state: String,
    district: String,
    month: String,
    jobsCreated: Number,
    wagesPaid: Number,
    avgWorkdays: Number,
    raw: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model("DistrictMetric", districtMetricSchema);