import Job from "../models/job.model.js";

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error: " + error.message });
  }
};

const getJobDetails = async (req, res) => {
  const { title, company } = req.params;
  try {
    const job = await Job.findOne({ title, company });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching job details:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error: " + error.message });
  }
};

const createJob = async (req, res) => {
  const { title, company, description, deadline } = req.body;
  try {
    if (!title || !company || !description || !deadline) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const job = new Job({ title, company, description, deadline });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error("Error creating job:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error: " + error.message });
  }
};

export default {
  getJobs,
  getJobDetails,
  createJob,
};
