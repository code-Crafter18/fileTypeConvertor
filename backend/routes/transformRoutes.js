const express = require('express');
const router = express.Router();
const upload = require('../middleware/fileUpload');
const { uploadAndConvert, formToPdf } = require('../controllers/transformController');

// POST /api/transform/upload - Upload TXT and convert to PDF
router.post('/upload', upload.single('file'), uploadAndConvert);

// POST /api/transform/form-to-pdf - Generate PDF from form data
router.post('/form-to-pdf', formToPdf);

module.exports = router;
