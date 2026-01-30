const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ CRITICAL: Use ABSOLUTE path resolution
const uploadDir = path.resolve(__dirname, '..', 'uploads', 'documents');

console.log('=== VERIFICATION UPLOAD MIDDLEWARE INIT ===');
console.log('📁 Upload directory:', uploadDir);

// ✅ Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Directory created');
} else {
  console.log('✅ Directory already exists');
}

// ✅ Test write permissions
try {
  const testFile = path.join(uploadDir, '.test-write');
  fs.writeFileSync(testFile, 'test');
  fs.unlinkSync(testFile);
  console.log('✅ Write permissions: OK');
} catch (error) {
  console.error('❌ Write permissions FAILED:', error.message);
}
console.log('===========================================\n');

// ✅ Configure storage with ABSOLUTE path + fsync for Windows
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(`📤 [${file.fieldname}] Saving to: ${uploadDir}`);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${file.fieldname}-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`;
    console.log(`📝 [${file.fieldname}] Filename: ${filename}`);
    cb(null, filename);
  }
});

// ✅ CRITICAL FIX: Override _handleFile to force fsync on Windows
const originalHandleFile = storage._handleFile.bind(storage);
storage._handleFile = function(req, file, cb) {
  originalHandleFile(req, file, (err, info) => {
    if (!err && info && info.path) {
      try {
        // ✅ CRITICAL: Force file system to flush write buffer
        // This is essential on Windows to ensure file is written before continuing
        const fd = fs.openSync(info.path, 'r+');
        fs.fsyncSync(fd);
        fs.closeSync(fd);
        console.log(`✅ [${file.fieldname}] fsync completed for: ${info.filename}`);
      } catch (syncError) {
        console.error(`⚠️  [${file.fieldname}] fsync warning:`, syncError.message);
        // Don't fail the upload, but log the warning
      }
    }
    cb(err, info);
  });
};

// ✅ File filter
const fileFilter = (req, file, cb) => {
  console.log(`🔍 [${file.fieldname}] Validating: ${file.originalname} (${file.mimetype})`);
  
  const allowedExtensions = /jpeg|jpg|png|gif|webp|pdf/;
  const allowedMimes = /image\/(jpeg|jpg|png|gif|webp)|application\/pdf/;
  
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMimes.test(file.mimetype);

  if (mimetype && extname) {
    console.log(`✅ [${file.fieldname}] ACCEPTED`);
    return cb(null, true);
  } else {
    console.error(`❌ [${file.fieldname}] REJECTED - Invalid file type`);
    cb(new Error(`Invalid file type for ${file.fieldname}. Only JPEG, PNG, GIF, WEBP, or PDF allowed.`));
  }
};

// ✅ Configure multer
const uploader = multer({
  storage: storage,
  limits: { 
    fileSize: 10 * 1024 * 1024  // 10MB
  },
  fileFilter: fileFilter
});

// ✅ Export ONLY the fields middleware
module.exports = uploader.fields([
  { name: 'citizenshipFront', maxCount: 1 },
  { name: 'citizenshipBack', maxCount: 1 },
  { name: 'drivingLicenseFront', maxCount: 1 },
  { name: 'drivingLicenseBack', maxCount: 1 }
]);