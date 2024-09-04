import multer from "multer";
import path from "path";
import fs from "fs";
import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDirectory = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /pdf|doc|docx/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed!"));
    }
  },
});

// Apply for a job
export const applyForJob = (req, res) => {

  upload.single("resume")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "Multer Error: " + err.message });
    } else if (err) {
      return res.status(400).json({ message: "Error: " + err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required." });
    }

    try {
      console.log("Request Body:", req.body);
      const job = await Job.findOne({
        title: req.body.title,
        company: req.body.company,
      });
      console.log("Found Job:", job);

      if (!job) {
        return res.status(404).json({
          message:
            "Job not found. Please check the job title and company name.",
        });
      }

      const existingApplication = await Application.findOne({
        jobTitle: job.title,
        companyName: job.company,
        email: req.body.email, 
      });

      if (existingApplication) {
        return res.status(400).json({
          message: "You have already applied for this job.",
        });
      }

      // Create a new application
      const application = new Application({
        jobTitle: job.title,
        companyName: job.company,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        resume: req.file.path,
        coverLetter: req.body.coverLetter || "",
      });

      await application.save();
      res.status(201).json({ message: "Application submitted successfully" });
    } catch (error) {
      console.error("Error submitting application:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error: " + error.message });
    }
  });
};
