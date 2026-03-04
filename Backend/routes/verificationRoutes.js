
const express = require("express");
const router = express.Router();
const {
  submitCitizenshipVerification,
  submitRiderVerification,
  upgradeToRider,
  updateVerification,
  getVerificationStatus,
  getVerificationDetails
} = require("../controllers/verificationController");
const authMiddleware = require("../middleware/authMiddleware");
const uploadDocuments = require("../middleware/verificationUploadMiddleware");

// ✅ NEW: Submit citizenship verification (user only)
router.post(
  "/submit-citizenship",
  authMiddleware,
  (req, res, next) => {
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
  submitCitizenshipVerification
);

// ✅ NEW: Submit rider verification (license only)
router.post(
  "/submit-rider",
  authMiddleware,
  (req, res, next) => {
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
  submitRiderVerification
);

// ✅ NEW: Upgrade to rider (for verified users)
router.post(
  "/upgrade-to-rider",
  authMiddleware,
  (req, res, next) => {
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
  upgradeToRider
);

// ✅ NEW: Update verification (citizenship or license)
router.post(
  "/update",
  authMiddleware,
  (req, res, next) => {
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
  updateVerification
);

// Get verification status
router.get("/status", authMiddleware, getVerificationStatus);

// Get specific verification details
router.get("/:id", authMiddleware, getVerificationDetails);

module.exports = router;