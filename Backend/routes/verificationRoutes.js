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


const express = require("express");
const router = express.Router();
const {
  submitVerification,
  getVerificationStatus,
  getVerificationDetails
} = require("../controllers/verificationController");
const authMiddleware = require("../middleware/authMiddleware");
// ✅ FIX: Import the correct upload middleware for documents
const uploadDocuments = require("../middleware/verificationUploadMiddleware");

// Submit verification request
router.post(
  "/submit",
  authMiddleware,
  uploadDocuments.fields([
    { name: 'citizenshipFront', maxCount: 1 },
    { name: 'citizenshipBack', maxCount: 1 },
    { name: 'drivingLicenseFront', maxCount: 1 },
    { name: 'drivingLicenseBack', maxCount: 1 }
  ]),
  submitVerification
);

// Get verification status
router.get("/status", authMiddleware, getVerificationStatus);

// Get specific verification details
router.get("/:id", authMiddleware, getVerificationDetails);

module.exports = router;