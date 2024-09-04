// routes/application.routes.js
import express from 'express';
import { applyForJob } from '../controller/application.js';

const router = express.Router();

router.post('/jobs/apply', applyForJob);

export default router;