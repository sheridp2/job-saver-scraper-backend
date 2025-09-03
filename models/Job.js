const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  url: String,
  description: String,
  jobId: String,
  datePosted: String,
  dateScraped: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", jobSchema);
