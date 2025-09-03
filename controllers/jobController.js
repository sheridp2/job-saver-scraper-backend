const Job = require('../models/Job');
const axios = require('axios');
const cheerio = require('cheerio');

// Create a new job
exports.addJob = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing URL' });
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    let jobs = [];
    if (url.includes('jobs.disneycareers.com')) {
      $('#job-details-top').each((i, el) => {
        const title = $(el).find('h1').text().trim();
        const company = 'Disney';
        const location = $(el).find('.job-location-scrape').text().trim();
        const description = $('.additional-field-value-razor').text().trim();
        const jobId = $(el).find('#jobs-id-scrape').text().trim() || $(el).attr('data-job-id') || '';
        const datePosted = $(el).find('.job-date').text().split("Date posted\n")[1].trim();
        if (title) {
          jobs.push({ title, company, location, url, description, jobId, datePosted });
        }
      });
    } else {
      $('.job, .job-listing, .result').each((i, el) => {
        const title = $(el).find('.title, .job-title, h1').text().trim();
        let company = $(el).find('.company, .job-company').text().trim();
        if (!company) {
          company = $("meta[property='og:site_name']").attr('content') || '';
        }
        const location = $(el).find('.location, .job-location').text().trim();
        const description = $(el).find('.description, .job-description').text().trim();
        const jobId = $(el).attr('data-job-id') || '';
        const datePosted = $(el).find('.job-posted-date-scrape').text().trim();
        if (title) {
          jobs.push({ title, company, location, url, description, jobId, datePosted });
        }
      });
    }
    if (jobs.length === 0) return res.status(404).json({ error: 'No jobs found. Try different selectors.' });
    // Save the first job found
    const newJob = new Job(jobs[0]);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.allJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ dateScraped: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}

