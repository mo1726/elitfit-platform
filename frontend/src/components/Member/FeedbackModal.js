import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";

const FeedbackModal = ({ open, onClose, onSubmit, bookingId, initialScore = 0, initialText = "" }) => {
  const [score, setScore] = useState(initialScore);
  const [text, setText] = useState(initialText);

  useEffect(() => {
    if (open) {
      setScore(initialScore);
      setText(initialText);
    }
  }, [open, initialScore, initialText]);

  const handleStarClick = (index) => {
    setScore(index + 1);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-zinc-900 text-white p-6 rounded-xl shadow-lg w-full max-w-md"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-green-400">Leave Feedback</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-xl">×</button>
          </div>

          <div className="flex mb-4 gap-1">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                onClick={() => handleStarClick(index)}
                className={`cursor-pointer text-2xl ${
                  index < score ? "text-yellow-400" : "text-gray-600"
                }`}
              />
            ))}
          </div>

          <textarea
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded resize-none mb-4"
            rows="4"
            placeholder="Leave a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>

          <button
            onClick={() => {
              onSubmit({ bookingId, feedbackScore: score, feedbackText: text });
              onClose();
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
          >
            Submit Feedback
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeedbackModal;
