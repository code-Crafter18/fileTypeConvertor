const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Convert a TXT file to PDF
 * @param {string} inputPath - Path to the input TXT file
 * @param {string} outputPath - Path for the output PDF file
 * @returns {Promise<string>} - Path to the generated PDF
 */
const convertTxtToPdf = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      // Read the text file
      const text = fs.readFileSync(inputPath, 'utf-8');

      // Create a new PDF document
      const doc = new PDFDocument({
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      // Create write stream
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Add content to PDF
      doc.fontSize(12).text(text, {
        align: 'left',
        lineGap: 4,
      });

      // Finalize the PDF
      doc.end();

      stream.on('finish', () => {
        resolve(outputPath);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate a PDF from form data
 * @param {object} formData - The form data (name, email, phone, address, description)
 * @param {string} outputPath - Path for the output PDF file
 * @returns {Promise<string>} - Path to the generated PDF
 */
const generatePdfFromForm = (formData, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Add title
      doc.fontSize(20).text('Form Submission', { align: 'center' });
      doc.moveDown(2);

      // Add form data
      doc.fontSize(14);

      const fields = [
        { label: 'Name', value: formData.name },
        { label: 'Email', value: formData.email },
        { label: 'Phone', value: formData.phone },
        { label: 'Address', value: formData.address },
        { label: 'Description', value: formData.description },
      ];

      fields.forEach((field) => {
        doc.font('Helvetica-Bold').text(`${field.label}: `, { continued: true });
        doc.font('Helvetica').text(field.value || 'N/A');
        doc.moveDown(0.5);
      });

      // Add timestamp
      doc.moveDown(2);
      doc
        .fontSize(10)
        .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });

      doc.end();

      stream.on('finish', () => {
        resolve(outputPath);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  convertTxtToPdf,
  generatePdfFromForm,
};
