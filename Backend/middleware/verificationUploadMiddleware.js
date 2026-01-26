const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads/documents directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads', 'documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage for verification documents
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Format: citizenship-front-userId-timestamp.jpg or license-back-userId-timestamp.jpg
    const docType = file.fieldname; // citizenshipFront, citizenshipBack, etc.
    const filename = `${docType}-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, filename);
  }
});

// File filter - images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'application/pdf';

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WEBP) or PDF are allowed!'));
  }
};

// Configure multer for verification documents
const uploadDocuments = multer({
  storage: storage,
  limits: { 
    fileSize: 10 * 1024 * 1024  // 10MB limit for documents
  },
  fileFilter: fileFilter
});

module.exports = uploadDocuments;