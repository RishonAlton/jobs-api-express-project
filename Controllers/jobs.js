const { StatusCodes } = require('http-status-codes')

const Job = require('../Models/Job')
const { NotFoundError } = require('../Errors')
const { BadRequestError } = require('../Errors')


const getAllJobs = async (req, res) => {

    const jobs = await Job.find({ createdBy: req.user.userID }).sort('createdAt')
    
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })

}


const createJob = async (req, res) => {

    req.body.createdBy = req.user.userID
    const job = await Job.create(req.body)

    res.status(StatusCodes.CREATED).json({ job })

}


const getJob = async (req, res) => {

    const { userID } = req.user
    const { id: jobID } = req.params

    const job = await Job.findOne({ _id: jobID, createdBy: userID })

    if(!job) {
        throw new NotFoundError(`No Job with the ID of ${jobID}`)
    }

    res.status(StatusCodes.OK).json({ job })

}


const updateJob = async (req, res) => {

    const { userID } = req.user
    const { id: jobID } = req.params
    const { company, position } = req.body

    if(company === '' || position === '') {
        throw new BadRequestError('Company or Position fields cannot be empty')
    }

    const job = await Job.findByIdAndUpdate({ _id: jobID, createdBy: userID }, req.body, { new: true, runValidators: true })

    if(!job) {
        throw new NotFoundError(`No Job with the ID of ${jobID}`)
    }

    res.status(StatusCodes.OK).json({ job })

}


const deleteJob = async (req, res) => {

    const { userID } = req.user
    const { id: jobID } = req.params

    const job = await Job.findByIdAndRemove({ _id: jobID, createdBy: userID })

    if(!job) {
        throw new NotFoundError(`No Job with the ID of ${jobID}`)
    }

    res.status(StatusCodes.OK).send()

}


module.exports = {

    getAllJobs,
    createJob,
    getJob,
    updateJob,
    deleteJob

}