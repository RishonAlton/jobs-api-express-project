const express = require('express')
const router = express.Router()

const { getAllJobs, createJob, getJob, updateJob, deleteJob } = require('../Controllers/jobs')


router.route('/').get(getAllJobs).post(createJob)
router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob)


module.exports = router