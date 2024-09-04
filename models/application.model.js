import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  companyName: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  resume: { type: String, required: true },
  coverLetter: { type: String },
  submittedAt: { type: Date, default: Date.now },
});

const Application = mongoose.model("Application", applicationSchema);

export default Application;
