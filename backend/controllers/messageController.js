const { Message } = require('../models');
const nodemailer = require('nodemailer');

const contactRequests = new Map();
const CONTACT_LIMIT = 5;
const CONTACT_WINDOW_MS = 60 * 1000;

const escapeHtml = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

// @desc  Get all messages (admin)
// @route GET /api/messages
// @access Private
const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.findAll({ order: [['created_at', 'DESC']] });
    const unreadCount = await Message.count({ where: { is_read: false } });
    res.json({ success: true, data: messages, unreadCount });
  } catch (err) { next(err); }
};

// @desc  Get single message
// @route GET /api/messages/:id
// @access Private
const getMessage = async (req, res, next) => {
  try {
    const msg = await Message.findByPk(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, data: msg });
  } catch (err) { next(err); }
};

// @desc  Send message (public contact form)
// @route POST /api/messages
// @access Public
const sendMessage = async (req, res, next) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const recent = (contactRequests.get(ip) || []).filter((timestamp) => now - timestamp < CONTACT_WINDOW_MS);
    if (recent.length >= CONTACT_LIMIT) {
      return res.status(429).json({ success: false, message: 'Too many messages. Please try again in a minute.' });
    }
    contactRequests.set(ip, [...recent, now]);

    const { name, email, subject, message, website } = req.body;
    if (website) return res.status(201).json({ success: true, message: 'Message sent successfully' });
    if (typeof name !== 'string' || name.trim().length < 2 || name.length > 200 ||
        typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        typeof subject !== 'string' || !subject.trim() || subject.length > 500 ||
        typeof message !== 'string' || message.trim().length < 10 || message.length > 10000) {
      return res.status(422).json({ success: false, message: 'Please provide a valid name, email, subject and message.' });
    }
    const msg = await Message.create({ name, email, subject, message });

    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.trim().replace(/\s+/g, '');
    let emailStatus = { owner: 'not_configured', visitor: 'not_configured' };

    if (smtpUser && smtpPass) {
      try {
        const isGmail = (process.env.SMTP_HOST || '').includes('gmail') || !process.env.SMTP_HOST;
        const transporter = nodemailer.createTransport(
          isGmail
            ? {
                service: 'gmail',
                auth: { user: smtpUser, pass: smtpPass },
              }
            : {
                host: process.env.SMTP_HOST?.trim() || 'smtp.gmail.com',
                port: Number(process.env.SMTP_PORT || 465),
                secure: String(process.env.SMTP_SECURE).toLowerCase() !== 'false',
                auth: { user: smtpUser, pass: smtpPass },
              }
        );

        const sender = `"Portfolio Contact" <${smtpUser}>`;
        const contactEmail = process.env.CONTACT_EMAIL?.trim() || 'kavinkbs2021@gmail.com, kavinkbs2202@gmail.com';

        const recipients = [
          transporter.sendMail({
            from: sender,
            to: contactEmail,
            replyTo: email,
            subject: `Portfolio inquiry: ${subject} (from ${name})`,
            text: `New Portfolio Inquiry\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #4f46e5; margin-top: 0;">New Portfolio Inquiry</h2>
                <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
                <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;">
                <p style="white-space: pre-wrap; color: #334155; line-height: 1.6;">${escapeHtml(message)}</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;">
                <p style="font-size: 12px; color: #94a3b8;">Sent from your portfolio contact form</p>
              </div>
            `,
          }),
          transporter.sendMail({
            from: sender,
            to: email,
            subject: `Thank you for contacting Kavin B - "${subject}"`,
            text: `Hi ${name},\n\nThank you! Your message has been received. I will get back to you shortly.\n\nYour message:\n${message}\n\nBest regards,\nKavin B\nFull Stack Developer`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #4f46e5; margin-top: 0;">Message Received!</h2>
                <p>Hi <strong>${escapeHtml(name)}</strong>,</p>
                <p>Thank you for reaching out through my portfolio. I have received your message and will get back to you shortly.</p>
                <div style="background: #f8fafc; padding: 16px; border-left: 4px solid #4f46e5; border-radius: 4px; margin: 16px 0;">
                  <p style="margin: 0 0 8px 0; font-weight: bold; color: #475569;">Your message:</p>
                  <p style="margin: 0; color: #334155; white-space: pre-wrap;">${escapeHtml(message)}</p>
                </div>
                <p style="margin-bottom: 0;">Best regards,<br><strong>Kavin B</strong><br><span style="color: #64748b; font-size: 13px;">Full Stack Developer</span></p>
              </div>
            `,
          }),
        ];
        const notifications = await Promise.allSettled(recipients);
        emailStatus = {
          owner: notifications[0].status === 'fulfilled' ? 'sent' : 'failed',
          visitor: notifications[1].status === 'fulfilled' ? 'sent' : 'failed',
        };
        notifications.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.error(index === 0 ? 'Contact email notification failed:' : 'Visitor confirmation email failed:', {
              code: result.reason.code,
              responseCode: result.reason.responseCode,
              message: result.reason.message,
            });
          }
        });
      } catch (mailError) {
        emailStatus = { owner: 'failed', visitor: 'failed' };
        console.error('Contact email setup failed:', mailError.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Message received and saved',
      emailStatus,
      data: msg,
    });
  } catch (err) { next(err); }
};

// @desc  Mark message as read
// @route PATCH /api/messages/:id/read
// @access Private
const markRead = async (req, res, next) => {
  try {
    const msg = await Message.findByPk(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    await msg.update({ is_read: true });
    res.json({ success: true, data: msg });
  } catch (err) { next(err); }
};

// @desc  Delete message
// @route DELETE /api/messages/:id
// @access Private
const deleteMessage = async (req, res, next) => {
  try {
    const msg = await Message.findByPk(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    await msg.destroy();
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) { next(err); }
};

// @desc  Dashboard stats
// @route GET /api/messages/stats
// @access Private
const getStats = async (req, res, next) => {
  try {
    const { Skill, Project, Experience, Education } = require('../models');
    const [total, unread, skills, projects, experiences, educations] = await Promise.all([
      Message.count(),
      Message.count({ where: { is_read: false } }),
      Skill.count(),
      Project.count(),
      Experience.count(),
      Education.count(),
    ]);
    res.json({ success: true, data: { totalMessages: total, unreadMessages: unread, totalSkills: skills, totalProjects: projects, totalExperiences: experiences, totalEducation: educations } });
  } catch (err) { next(err); }
};

module.exports = { getMessages, getMessage, sendMessage, markRead, deleteMessage, getStats };
