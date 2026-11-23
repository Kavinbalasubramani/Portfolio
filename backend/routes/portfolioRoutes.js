const express = require("express");
const router = express.Router();
const Portfolio = require("../models/Portfolio");
const { protect } = require("../middleware/auth");

// GET /api/portfolio  → public, used by the live site
router.get("/", async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      portfolio = await Portfolio.create({}); // create empty doc on first run
    }
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT /api/portfolio  → admin only, updates hero/about/skills/projects/socialLinks
router.put("/", protect, async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();
    if (!portfolio) portfolio = new Portfolio();

    const { hero, about, skills, projects, socialLinks } = req.body;

    if (hero) portfolio.hero = { ...portfolio.hero.toObject(), ...hero };
    if (about) portfolio.about = { ...portfolio.about.toObject(), ...about };
    if (skills) portfolio.skills = skills;
    if (projects) portfolio.projects = projects;
    if (socialLinks)
      portfolio.socialLinks = { ...portfolio.socialLinks.toObject(), ...socialLinks };

    await portfolio.save();
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
