const express = require('express');

const {
  addJob,
  allJobs
} = require('../controllers/jobController');

const router = express.Router();

router.post('/add', addJob);
router.get("/getAll", allJobs);

module.exports = router;
