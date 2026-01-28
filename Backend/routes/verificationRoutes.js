// const express = require("express");
// const router = express.Router();
// const {
//   submitVerification,
//   getVerificationStatus,
//   getVerificationDetails
// } = require("../controllers/verificationController");
// const authMiddleware = require("../middleware/authMiddleware");
// const uploadDocuments = require("../middleware/UploadMiddleware");

// // Submit verification request
// router.post(
//   "/submit",
//   authMiddleware,
//   uploadDocuments.fields([
//     { name: 'citizenshipFront', maxCount: 1 },
//     { name: 'citizenshipBack', maxCount: 1 },
//     { name: 'drivingLicenseFront', maxCount: 1 },
//     { name: 'drivingLicenseBack', maxCount: 1 }
//   ]),
//   submitVerification
// );

// // Get verification status
// router.get("/status", authMiddleware, getVerificationStatus);

// // Get specific verification details
// router.get("/:id", authMiddleware, getVerificationDetails);

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const {
//   submitVerification,
//   getVerificationStatus,
//   getVerificationDetails
// } = require("../controllers/verificationController");
// const authMiddleware = require("../middleware/authMiddleware");
// // ✅ FIX: Import the correct upload middleware for documents
// const uploadDocuments = require("../middleware/verificationUploadMiddleware");

// // Submit verification request
// router.post(
//   "/submit",
//   authMiddleware,
//   uploadDocuments.fields([
//     { name: 'citizenshipFront', maxCount: 1 },
//     { name: 'citizenshipBack', maxCount: 1 },
//     { name: 'drivingLicenseFront', maxCount: 1 },
//     { name: 'drivingLicenseBack', maxCount: 1 }
//   ]),
//   submitVerification
// );

// // Get verification status
// router.get("/status", authMiddleware, getVerificationStatus);

// // Get specific verification details
// router.get("/:id", authMiddleware, getVerificationDetails);

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const {
//   submitVerification,
//   getVerificationStatus,
//   getVerificationDetails
// } = require("../controllers/verificationController");
// const authMiddleware = require("../middleware/authMiddleware");
// const uploadDocuments = require("../middleware/verificationUploadMiddleware");

// // Submit verification request
// router.post(
//   "/submit",
//   authMiddleware,
//   uploadDocuments, // Now uses the wrapped version with error handling
//   submitVerification
// );

// // Get verification status
// router.get("/status", authMiddleware, getVerificationStatus);

// // Get specific verification details
// router.get("/:id", authMiddleware, getVerificationDetails);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  submitVerification,
  getVerificationStatus,
  getVerificationDetails
} = require("../controllers/verificationController");
const authMiddleware = require("../middleware/authMiddleware");
const uploadDocuments = require("../middleware/verificationUploadMiddleware");

// ✅ Submit verification request with error handling
router.post(
  "/submit",
  authMiddleware,
  (req, res, next) => {
    // ✅ Call multer middleware with explicit error handling
    uploadDocuments(req, res, (err) => {
      if (err) {
        console.error('❌ MULTER ERROR:', err.message);
        return res.status(400).json({ 
          message: err.message || 'File upload error',
          error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }
      next();
    });
  },
  submitVerification
);

// Get verification status
router.get("/status", authMiddleware, getVerificationStatus);

// Get specific verification details
router.get("/:id", authMiddleware, getVerificationDetails);

module.exports = router;