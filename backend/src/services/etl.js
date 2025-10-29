const dotenv = require("dotenv");
const axios = require("axios");
const DistrictMetric = require("../models/DistrictMetric");

dotenv.config();

const url = process.env.API_URL;
const params = {
  "api-key": process.env.API_KEY,
  format: "json",
  limit: 1000, // you can increase to 1000 or 10000 depending on API support
};

async function fetchAndSaveData() {
  try {
    console.log("🔄 Starting full data fetch from data.gov.in...");
    let offset = 0;
    let totalRecords = 0;

    while (true) {
      const response = await axios.get(url, {
        params: { ...params, offset },
      });

      const records = response.data.records;
      if (!records || records.length === 0) {
        console.log("✅ No more records to fetch. Stopping.");
        break;
      }

      for (const record of records) {
        const doc = {
          state: record.state_name,
          district: record.district_name,
          month: record.month,
          jobsCreated: Number(record.Total_Households_Worked) || 0,
          wagesPaid: Number(record.Wages) || 0,
          avgWorkdays:
            Number(record.Average_days_of_employment_provided_per_Household) ||
            0,
          raw: {},
        };

        await DistrictMetric.findOneAndUpdate(
          { state: doc.state, district: doc.district, month: doc.month },
          doc,
          { upsert: true }
        );
      }

      totalRecords += records.length;
      offset += params.limit;

      if (records.length < params.limit) {
        console.log("✅ Reached last page. All records fetched.");
        break;
      }
    }
  } catch (error) {
    console.error("❌ Error fetching and saving data:", error.message);
  }
}

module.exports = fetchAndSaveData;
