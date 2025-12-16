import React, { useRef, useState, useMemo } from "react";
import { FiUpload, FiFileText, FiLoader } from "react-icons/fi";
import StatusPill from "./StatusPill";
import { useUploadMemorandumFileMutation } from "../../api/lawyerApi";

export default function MemorandumTab({
  selectedCase,
  selectedStage,
  userRole = "Lawyer",
}) {
  // Get memorandum from the stages array, not from memorandum object
  const currentStage = selectedCase.stages?.[selectedStage];
  const memo = currentStage?.memorandum || {};
  const fileInputRef = useRef(null);

  const [uploadMemorandum, { isLoading: isUploading }] =
    useUploadMemorandumFileMutation();
  const [content, setContent] = useState("");
  const [localFile, setLocalFile] = useState(null);

  // Use useMemo to prevent creating new objects on every render
  const uploadedFile = useMemo(() => memo.fileUrl || null, [memo.fileUrl]);
  const status = useMemo(() => memo.status || "Pending", [memo.status]);

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLocalFile(file);
  };

  const handleSubmitMemorandum = async () => {
    if (!localFile && !content) {
      alert("Please provide content or upload a file");
      return;
    }

    console.log("📝 Uploading memorandum:", {
      hasFile: !!localFile,
      hasContent: !!content,
      stageIndex: selectedStage,
      caseId: selectedCase._id || selectedCase.id,
      fileName: localFile?.name,
    });

    try {
      const formData = new FormData();
      if (localFile) {
        formData.append("memorandum", localFile);
        console.log("📄 Added file to FormData:", localFile.name);
      }
      formData.append("stageIndex", selectedStage);
      console.log("🎯 Stage index:", selectedStage);
      if (content) {
        formData.append("content", content);
        console.log("📝 Content length:", content.length);
      }

      const result = await uploadMemorandum({
        id: selectedCase._id || selectedCase.id,
        formData,
      }).unwrap();

      console.log("✅ Upload successful:", result);
      console.log(
        "📝 New memorandum in response:",
        result.data?.stages?.[selectedStage]?.memorandum
      );
      alert("Memorandum uploaded successfully!");
      setLocalFile(null);
      setContent("");
      // Note: Parent component will auto-refresh from RTK Query cache invalidation
    } catch (error) {
      console.error("❌ Failed to upload memorandum:", {
        error,
        message: error?.message,
        data: error?.data,
        status: error?.status,
      });
      alert(
        `Failed to upload memorandum: ${
          error?.data?.message || error?.message || "Unknown error"
        }`
      );
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="text-[10px] font-medium text-slate-800">
            Memorandum -{" "}
            <span className="text-slate-600">
              {currentStage?.stageType || `Stage ${selectedStage + 1}`}
            </span>
          </div>
          <div className="text-[9px] text-slate-500">
            Updated:{" "}
            {memo?.preparedAt
              ? new Date(memo.preparedAt).toLocaleDateString()
              : "—"}
          </div>
          {status && <StatusPill status={status} />}
        </div>

        <div className="flex gap-1.5">
          {/* Lawyer Actions */}
          {userRole === "Lawyer" && (
            <>
              <button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="inline-flex items-center gap-1 px-2 py-1 border border-slate-300 rounded text-[10px] hover:bg-[#A48C65] hover:text-white disabled:opacity-50"
              >
                <FiUpload size={12} /> Choose
              </button>
              {(localFile || content) && (
                <button
                  onClick={handleSubmitMemorandum}
                  disabled={isUploading}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[#A48C65] text-white rounded text-[10px] hover:bg-[#8B7A4B] transition disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <FiLoader size={12} className="animate-spin" /> Uploading
                    </>
                  ) : (
                    <>
                      <FiUpload size={12} /> Submit
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />
      </div>

      {/* Upload Form */}
      {userRole === "Lawyer" && !memo?.fileUrl && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-semibold text-[10px] mb-2 text-blue-800">
            Upload New Memorandum
          </h4>

          {/* Content Textarea */}
          <div className="mb-2">
            <label className="block text-[10px] font-medium text-slate-700 mb-1">
              Content (Optional)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter memorandum content..."
              className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none text-xs"
              rows={3}
            />
          </div>

          {/* File Selection Display */}
          {localFile && (
            <div className="flex items-center gap-2 p-2 bg-white border border-[#A48C65] rounded text-[10px]">
              <FiFileText size={12} className="text-[#A48C65]" />
              <span className="flex-1 text-slate-700 truncate">
                {localFile.name}
              </span>
              <button
                onClick={() => setLocalFile(null)}
                className="text-red-500 hover:text-red-700 text-[9px] shrink-0"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}

      {/* Display memorandum content and file */}
      {memo && (memo.content || memo.fileUrl) ? (
        <div className="space-y-2">
          {/* Content */}
          {memo.content && (
            <div className="p-3 bg-slate-50 border border-[#A48C65] rounded">
              <h4 className="font-semibold text-[10px] mb-1 text-slate-800">
                Content:
              </h4>
              <p className="text-xs text-slate-700 whitespace-pre-wrap">
                {memo.content}
              </p>
            </div>
          )}

          {/* File */}
          {memo.fileUrl && (
            <div className="flex items-center gap-2 p-2 border border-[#A48C65] rounded bg-white">
              <FiFileText size={14} className="text-[#A48C65] shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium text-slate-800">
                  Memorandum Document
                </div>
                <div className="text-[9px] text-slate-500">
                  {memo.preparedAt &&
                    `Uploaded: ${new Date(
                      memo.preparedAt
                    ).toLocaleDateString()}`}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={memo.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded border text-[10px] hover:bg-[#A48C65] hover:text-white"
                >
                  View
                </a>
                <a
                  href={memo.fileUrl}
                  download
                  className="px-2 py-1 rounded border text-[10px] hover:bg-[#A48C65] hover:text-white"
                >
                  Download
                </a>
              </div>
            </div>
          )}

          {/* Feedback if rejected */}
          {memo.feedback && (
            <div className="p-2 bg-red-50 border border-red-200 rounded">
              <h4 className="font-semibold text-[10px] text-red-700 mb-1">
                Feedback:
              </h4>
              <p className="text-xs text-red-600">{memo.feedback}</p>
            </div>
          )}

          {/* Approval info */}
          {memo.status === "Approved" && memo.approvedAt && (
            <div className="p-2 bg-green-50 border border-green-200 rounded">
              <p className="text-xs text-green-700">
                ✓ Approved on {new Date(memo.approvedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 text-[10px] text-slate-500 bg-slate-50 rounded border">
          No memorandum uploaded for this stage yet.
        </div>
      )}
    </div>
  );
}
