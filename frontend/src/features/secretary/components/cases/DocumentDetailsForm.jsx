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
    <div className="space-y-4">
      {/* Validation Status */}


      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          uploadingFiles ? 'cursor-wait opacity-75' : 'cursor-pointer'
        } ${
          isDragging
            ? "border-[#A48C65] bg-[#A48C65]/10"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-[#A48C65]/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploadingFiles && fileInputRef.current?.click()}
      >
        {uploadingFiles ? (
          <>
            <Loader2 className="w-12 h-12 text-[#A48C65] mx-auto mb-3 animate-spin" />
            <p className="text-[#A48C65] mb-2 font-semibold text-base">
              Uploading files to cloud storage...
            </p>
            <p className="text-sm text-gray-500">
              Please wait, this may take a moment
            </p>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-700 mb-2 font-semibold text-base">
              Drag and drop files here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB each)
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
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800 mb-2">
            <AlertCircle size={20} />
            <h4 className="font-semibold text-base">Upload Errors:</h4>
          </div>
          <ul className="text-sm text-red-700 space-y-1 ml-7">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Uploaded Documents List */}
      {documents.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <FileText size={20} className="text-[#A48C65]" />
            Uploaded Documents ({documents.length})
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-[#A48C65]/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl">{getFileIcon(doc.name)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {doc.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {doc.file
                        ? `${(doc.file.size / 1024 / 1024).toFixed(2)} MB`
                        : "Successfully uploaded"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDocument(index);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove document"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}


    </div>
  );
};

export default DocumentDetailsForm;
