const path = require('path');
const fs = require('fs');
const pdfService = require('../services/pdfService');
const Transformation = require('../models/Transformation');

/**
 * Handle TXT to PDF conversion
 * POST /api/transform/upload
 */
const uploadAndConvert = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const inputPath = req.file.path;
    const originalName = req.file.originalname;
    const outputFileName = Date.now() + '-' + Math.round(Math.random() * 1e9) + '.pdf';
    const outputPath = path.join(__dirname, '../generated', outputFileName);

    // Convert TXT to PDF
    await pdfService.convertTxtToPdf(inputPath, outputPath);

    // Get file size
    const stats = fs.statSync(outputPath);

    // Save to database
    const transformation = await Transformation.create({
      type: 'txt-to-pdf',
      originalName,
      generatedFile: outputFileName,
      fileSize: stats.size,
    });

    // Clean up uploaded file
    fs.unlinkSync(inputPath);

    res.status(201).json({
      message: 'File converted successfully',
      downloadUrl: `/generated/${outputFileName}`,
      transformation,
    });
  } catch (error) {
    // Clean up on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Failed to convert file' });
  }
};

/**
 * Handle form-to-PDF generation
 * POST /api/transform/form-to-pdf
 */
const formToPdf = async (req, res) => {
  try {
    const { name, email, phone, address, description } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const formData = { name, email, phone, address, description };

    const outputFileName = Date.now() + '-' + Math.round(Math.random() * 1e9) + '.pdf';
    const outputPath = path.join(__dirname, '../generated', outputFileName);

    // Generate PDF from form data
    await pdfService.generatePdfFromForm(formData, outputPath);

    // Get file size
    const stats = fs.statSync(outputPath);

    // Save to database
    const transformation = await Transformation.create({
      type: 'form-to-pdf',
      originalName: 'Form Submission',
      generatedFile: outputFileName,
      formData,
      fileSize: stats.size,
    });

    res.status(201).json({
      message: 'PDF generated successfully',
      downloadUrl: `/generated/${outputFileName}`,
      transformation,
    });
  } catch (error) {
    console.error('Form-to-PDF error:', error);
    res.status(500).json({ error: 'Failed to generate PDF from form' });
  }
};

module.exports = {
  uploadAndConvert,
  formToPdf,
};
