import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, X } from "lucide-react";

const FeedbackModal = ({ onCancel, onSubmit }) => {
  const [feedback, setFeedback] = useState("");

  return (
    <div className="px-4 fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[9999]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative bg-[#E1E1E2] text-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-[#fe9a00]/20"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800">
            <MessageSquare className="w-5 h-5 text-[#fe9a00]" />
            Return Case for Changes
          </h3>
         <button
  onClick={onCancel}
  className="w-9 h-9 flex items-center justify-center rounded-full 
  bg-gray-200 text-gray-700 hover:bg-[#fe9a00] hover:text-white 
  transition-all duration-200 shadow-md"
>
  <X className="w-5 h-5" />
</button>

        </div>

        {/* Textarea */}
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter feedback or reason for returning..."
          className="w-full bg-gray-300 text-black border border-[#fe9a00]/30 rounded-xl p-3 text-sm h-28 
          focus:ring-2 focus:ring-[#fe9a00] focus:outline-none resize-none placeholder-gray-400"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full bg-gray-700 text-gray-200 hover:bg-gray-600 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(feedback)}
            disabled={!feedback.trim()}
            className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-200 shadow-md
              ${feedback.trim()
                ? "bg-[#fe9a00] text-[#1c283c] hover:bg-[#ffad33]"
                : "bg-gray-500 text-gray-300 cursor-not-allowed"}`}
          >
            Submit
          </button>
        </div>

       
      </motion.div>
    </div>
  );
};

export default FeedbackModal;
