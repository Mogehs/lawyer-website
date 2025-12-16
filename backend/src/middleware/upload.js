import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const caseDocumentsStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "lawyer-system/case-documents",
    allowed_formats: ["jpg", "jpeg", "png", "pdf", "doc", "docx"],
    resource_type: "auto",
  },
});

const memorandumStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "lawyer-system/memorandums",
    allowed_formats: ["pdf", "doc", "docx"],
    resource_type: "auto",
  },
});

const courtProofStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "lawyer-system/court-proofs",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    resource_type: "auto",
  },
});

const signatureStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "lawyer-system/signatures",
    allowed_formats: ["jpg", "jpeg", "png"],
    resource_type: "image",
  },
});

export const uploadCaseDocuments = multer({
  storage: caseDocumentsStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadMemorandum = multer({
  storage: memorandumStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadCourtProof = multer({
  storage: courtProofStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadSignature = multer({
  storage: signatureStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
});
