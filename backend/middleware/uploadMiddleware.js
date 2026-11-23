const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const sanitized = file.originalname.replace(/\s+/g, '-').toLowerCase();
    cb(null, `${timestamp}-${sanitized}`);
  },
});

// ── Image-only filter ──────────────────────────────────────────────────────────
const imageFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|svg/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype.replace('image/', ''));
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp, svg)'), false);
  }
};

// ── PDF-only filter (for resume uploads) ──────────────────────────────────────
const pdfFilter = (_req, file, cb) => {
  const extOk = path.extname(file.originalname).toLowerCase() === '.pdf';
  const mimeOk = file.mimetype === 'application/pdf';
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed for resume upload'), false);
  }
};

// Default upload (images)
const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Resume upload (PDF only, 10 MB max)
const uploadResume = multer({
  storage,
  fileFilter: pdfFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

module.exports = upload;
module.exports.uploadResume = uploadResume;
