const mongoose = require('mongoose');

const transformationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['txt-to-pdf', 'form-to-pdf'],
    },
    originalName: {
      type: String,
      required: true,
    },
    generatedFile: {
      type: String,
      required: true,
    },
    formData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transformation', transformationSchema);
