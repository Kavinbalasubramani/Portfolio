const express = require('express');
const router = express.Router();
const { getProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', protect, upload.single('thumbnail'), createProject);
router.put('/:id', protect, upload.single('thumbnail'), updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
