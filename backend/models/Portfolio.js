const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: "General" }, // e.g. Frontend, Backend, Tools
    level: { type: Number, min: 0, max: 100, default: 70 },
  },
  { _id: true }
);

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: "" },
    techStack: [{ type: String }],
    githubLink: { type: String, default: "" },
    liveLink: { type: String, default: "" },
    featured: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true }
);

const PortfolioSchema = new mongoose.Schema(
  {
    hero: {
      name: { type: String, default: "" },
      title: { type: String, default: "" }, // e.g. "Full Stack Developer"
      tagline: { type: String, default: "" },
      image: { type: String, default: "" },
      resumeLink: { type: String, default: "" },
    },
    about: {
      description: { type: String, default: "" },
      image: { type: String, default: "" },
    },
    skills: [SkillSchema],
    projects: [ProjectSchema],
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      email: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

// There should only ever be ONE portfolio document.
module.exports = mongoose.model("Portfolio", PortfolioSchema);
