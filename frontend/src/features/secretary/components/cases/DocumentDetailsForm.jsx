import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

const DocumentDetailsForm = ({ caseInfo, onChange }) => {
  const [documents, setDocuments] = useState(caseInfo?.documents || []);
  const [errors, setErrors] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const fileInputRef = useRef(null);
  const isInitialMount = useRef(true);

  // Update parent when documents change (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (onChange) {
      onChange({
        target: {
          name: "documents",
          value: documents,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents]); // onChange is now memoized in parent, safe to exclude

  // Upload file to backend API which will handle Cloudinary upload
  const uploadFileToBackend = async (file) => {
    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload/document`,
        {
          method: 'POST',
          body: formData,
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const data = await response.json();
      return data.url; // Returns the Cloudinary URL from backend
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  // Handle file selection with upload
  const handleFileSelect = async (files) => {
    setUploadingFiles(true);
    setErrors([]);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        try {
          // Upload to backend API
          const cloudinaryUrl = await uploadFileToBackend(file);

          return {
            name: file.name,
            url: cloudinaryUrl, // Store actual Cloudinary URL
            uploadedAt: new Date().toISOString(),
          };
        } catch (error) {
          console.error('Upload error:', error);
          setErrors(prev => [...prev, `Failed to upload ${file.name}`]);
          return null;
        }
      });

      const uploadedDocs = (await Promise.all(uploadPromises)).filter(Boolean);

      if (uploadedDocs.length > 0) {
        setDocuments((prev) => [...prev, ...uploadedDocs]);
      }
    } catch (error) {
      console.error('Upload batch error:', error);
      setErrors(prev => [...prev, 'Failed to upload files. Please try again.']);
    } finally {
      setUploadingFiles(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
    // Reset input to allow selecting same files again
    e.target.value = "";
  };

  // Remove document
  const removeDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  // Get file icon based on type
  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "jpg":
      case "jpeg":
      case "png":
        return "🖼️";
      default:
        return "📎";
    }
  };

  return (
    <div className="space-y-3">
      {/* Validation Status */}
      <div
        className={`p-2 rounded border ${
          documents.length >= 3
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-yellow-50 border-yellow-200 text-yellow-800"
        }`}
      >
        <div className="flex items-center gap-1.5">
          {documents.length >= 3 ? (
            <CheckCircle size={14} className="text-green-600" />
          ) : (
            <AlertCircle size={14} className="text-yellow-600" />
          )}
          <span className="font-medium text-xs">
            {documents.length} / 3 documents uploaded
          </span>
        </div>
        <p className="text-[10px] mt-0.5">
          {documents.length >= 3
            ? "Minimum requirement met."
            : `Need ${3 - documents.length} more.`}
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded p-4 text-center transition-all ${
          uploadingFiles ? 'cursor-wait opacity-75' : 'cursor-pointer'
        } ${
          isDragging
            ? "border-blue-400 bg-[#BCB083]"
            : "border-slate-300 bg-slate-50 hover:bg-slate-100"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploadingFiles && fileInputRef.current?.click()}
      >
        {uploadingFiles ? (
          <>
            <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-spin" />
            <p className="text-blue-600 mb-1 font-medium text-xs">
              Uploading files to cloud storage...
            </p>
            <p className="text-[10px] text-slate-500">
              Please wait, this may take a moment
            </p>
          </>
        ) : (
          <>
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-600 mb-1 font-medium text-xs">
              Drag and drop or click to upload
            </p>
            <p className="text-[10px] text-slate-500">
              PDF, DOC, DOCX, JPG, PNG (Max 10MB)
            </p>
          </>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          className="hidden"
          disabled={uploadingFiles}
        />
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded p-2">
          <div className="flex items-center gap-1.5 text-red-800 mb-1">
            <AlertCircle size={14} />
            <h4 className="font-semibold text-xs">Please fix:</h4>
          </div>
          <ul className="text-[10px] text-red-700 space-y-0.5">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Uploaded Documents List */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <FileText size={14} className="text-blue-600" />
            Uploaded Documents ({documents.length})
          </h3>

          <div className="grid grid-cols-1 gap-2">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded hover:shadow-sm transition"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-lg">{getFileIcon(doc.name)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">
                      {doc.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {doc.file
                        ? `${(doc.file.size / 1024 / 1024).toFixed(2)}MB`
                        : "Uploaded"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDocument(index);
                  }}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded p-2">
        <h4 className="font-semibold text-[#A48C65] mb-1 flex items-center gap-1.5 text-xs">
          <AlertCircle size={12} />
          Required
        </h4>
        <ul className="text-[10px] text-[#A48C65] space-y-0.5">
          <li>• At least 3 documents mandatory</li>
          <li>• PDF, Word, Images supported</li>
          <li>• Max 10MB per file</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentDetailsForm;
