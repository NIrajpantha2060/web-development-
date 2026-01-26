const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory for documents
const uploadDir = path.join(__dirname, '..', 'uploads', 'documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fieldName = file.fieldname; // citizenshipFront, citizenshipBack, etc.
    const filename = `${fieldName}-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, filename);
  }
});

// File filter - only images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'application/pdf';

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png) and PDF files are allowed!'));
  }
};

// Configure multer for multiple files
const uploadDocuments = multer({
  storage: storage,
  limits: { 
    fileSize: 10 * 1024 * 1024  // 10MB limit per file
  },
  fileFilter: fileFilter
});

module.exports = uploadDocuments;