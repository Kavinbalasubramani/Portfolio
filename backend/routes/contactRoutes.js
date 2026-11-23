const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const { protect } = require("../middleware/auth");

// POST /api/contact → public, visitor submits the contact form
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required" });
    }

    const contact = await Contact.create({ name, email, subject, message });
    res.status(201).json({ message: "Message sent successfully", contact });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/contact → admin only, list all messages (newest first)
router.get("/", protect, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PATCH /api/contact/:id/read → admin only, toggle read/unread
router.patch("/:id/read", protect, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Message not found" });

    contact.read = !contact.read;
    await contact.save();
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE /api/contact/:id → admin only
router.delete("/:id", protect, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
