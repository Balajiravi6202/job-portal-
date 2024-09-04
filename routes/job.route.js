import express from 'express';
import jobController from '../controller/jobdetaile.js';

const { getJobDetails, getJobs, createJob } = jobController;


const router = express.Router();

router.get('/jobs', getJobs);
router.get('/jobs/:title/:company', getJobDetails);
router.post('/jobs/create', createJob);

export default router;