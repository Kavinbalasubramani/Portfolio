const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadAvatar, uploadLogo, uploadResume } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { uploadResume: uploadResumeMw } = require('../middleware/uploadMiddleware');

router.get('/', getProfile);
router.put('/', protect, upload.single('avatar'), updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.post('/logo', protect, upload.single('logo'), uploadLogo);
router.post('/resume', protect, uploadResumeMw.single('resume'), uploadResume);

module.exports = router;

