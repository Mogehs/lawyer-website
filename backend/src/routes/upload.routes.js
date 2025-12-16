import express from "express";
import { uploadCaseDocuments as uploadCaseDocsMulter } from "../middleware/upload.js";
import { loginRequired } from "../utils/loginRequired.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

// Upload a single document (returns Cloudinary URL)
router.post(
  "/document",
  loginRequired,
  uploadCaseDocsMulter.single("document"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      url: req.file.path, // Cloudinary URL
      name: req.file.originalname,
      size: req.file.size,
    });
  })
);

// Upload multiple documents
router.post(
  "/documents",
  loginRequired,
  uploadCaseDocsMulter.array("documents", 10),
  asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const uploadedFiles = req.files.map((file) => ({
      url: file.path, // Cloudinary URL
      name: file.originalname,
      size: file.size,
    }));

    res.status(200).json({
      success: true,
      message: `${req.files.length} file(s) uploaded successfully`,
      files: uploadedFiles,
    });
  })
);

export default router;

