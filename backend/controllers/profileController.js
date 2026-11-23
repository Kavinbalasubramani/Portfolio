const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const sharp = require('sharp');
const { Profile } = require('../models');

const removeReplacedUpload = async (oldUrl, newUrl) => {
  if (!oldUrl || oldUrl === newUrl || !oldUrl.startsWith('/uploads/')) return;
  const filename = path.basename(oldUrl);
  const uploadPath = path.join(__dirname, '..', 'uploads', filename);
  try { await fsPromises.unlink(uploadPath); } catch (err) {
    if (err.code !== 'ENOENT') console.error('[Avatar] Could not remove replaced upload:', err.message);
  }
};

const autoTrimImage = async (filePath) => {
  try {
    if (!filePath || !fs.existsSync(filePath)) return;
    const meta = await sharp(filePath).metadata();
    if (meta.hasAlpha) {
      const tempPath = `${filePath}.trimmed.png`;
      await sharp(filePath).trim().toFile(tempPath);
      fs.unlinkSync(filePath);
      fs.renameSync(tempPath, filePath);
    }
  } catch (err) {
    console.warn('Could not auto-trim image:', err.message);
  }
};

const profileFields = [
  'name', 'brand_logo', 'brand_logo_url', 'title', 'animated_roles', 'hero_tagline', 'bio', 'email', 'phone',
  'location', 'resume_url', 'avatar_url', 'github_url', 'linkedin_url',
  'years_of_experience', 'projects_completed', 'clients_served',
];

// @desc  Get profile
// @route GET /api/profile
// @access Public
const getProfile = async (req, res, next) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    if (profile.avatar_url?.startsWith('/uploads/')) {
      const avatarPath = path.join(__dirname, '..', 'uploads', path.basename(profile.avatar_url));
      if (!fs.existsSync(avatarPath)) {
        profile.avatar_url = '';
        await profile.save({ fields: ['avatar_url'] });
      }
    }
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

const uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Choose an image to upload.' });

    const brand_logo_url = `/uploads/${req.file.filename}`;
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({ brand_logo_url });
    } else {
      profile.set({ brand_logo_url });
      await profile.save({ fields: ['brand_logo_url'] });
      await profile.reload();
    }

    res.json({ success: true, data: profile.get({ plain: true }) });
  } catch (err) {
    next(err);
  }
};

// @desc  Update profile
// @route PUT /api/profile
// @access Private
const updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    const updates = Object.fromEntries(
      profileFields
        .filter((field) => Object.prototype.hasOwnProperty.call(req.body, field))
        .map((field) => [field, req.body[field]])
    );
    if (req.file) {
      await autoTrimImage(req.file.path);
      updates.avatar_url = `/uploads/${req.file.filename}`;
    }

    // Treat these text fields consistently whether the client sends an empty
    // string, null, or a string with surrounding whitespace.
    if (Object.prototype.hasOwnProperty.call(updates, 'brand_logo')) {
      updates.brand_logo = String(updates.brand_logo || '').trim();
    }
    if (Object.prototype.hasOwnProperty.call(updates, 'animated_roles')) {
      updates.animated_roles = String(updates.animated_roles || '').trim();
    }

    if (!profile) {
      profile = await Profile.create(updates);
    } else {
      // Model.update persists the explicitly supplied whitelist and returns
      // the same profile shape used by the public GET endpoint.
      await profile.update(updates, { fields: Object.keys(updates) });
    }

    res.json({ success: true, data: profile.get({ plain: true }) });
  } catch (err) {
    next(err);
  }
};

// @desc  Upload avatar
// @route POST /api/profile/avatar
// @access Private
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    await autoTrimImage(req.file.path);
    const avatar_url = `/uploads/${req.file.filename}`;
    let profile = await Profile.findOne();
    const oldAvatarUrl = profile?.avatar_url;
    if (profile) {
      await profile.update({ avatar_url });
    } else {
      profile = await Profile.create({ avatar_url });
    }
    await removeReplacedUpload(oldAvatarUrl, avatar_url);

    res.json({ success: true, avatar_url, data: profile });
  } catch (err) {
    next(err);
  }
};

// @desc  Upload resume PDF
// @route POST /api/profile/resume
// @access Private
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const resume_url = `/uploads/${req.file.filename}`;
    const profile = await Profile.findOne();
    if (profile) {
      await profile.update({ resume_url });
    }

    res.json({ success: true, resume_url });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, uploadAvatar, uploadLogo, uploadResume };
