import React from "react";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#1B1427] text-white rounded-lg shadow-lg p-6 relative"
      >
        <div
          className="absolute top-2 right-2 cursor-pointer"
          onClick={onClose}
        >
          X
        </div>
        <h2 className="text-2xl font-bold mb-4">
          Are you sure you want to leave the game?
        </h2>
        <p className="text-lg italic mb-4">
          "Once you leave, there's no coming back!"
        </p>
        <div className="flex justify-between mt-4">
          <motion.button
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded"
            whileHover={{ scale: 1.05 }}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={onConfirm}
            className="bg-red-600 z-10 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded mr-12"
            whileHover={{ scale: 1.05 }}
          >
            Leave Game
          </motion.button>
        </div>

        {/* Hardcoded Quote Icons */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {/* <div
            className="text-6xl text-purple-300 opacity-30"
            style={{
              position: "absolute",
              top: "10%", // 10% from the top
              left: "5%", // 5% from the left
              transform: "rotate(-15deg)", // Rotate -15 degrees
            }}
          >
            <FaQuoteLeft />
          </div> */}
          <div
            className="text-6xl text-purple-300 opacity-10"
            style={{
              position: "absolute",
              bottom: "5%", // 15% from the bottom
              right: "1%", // 30% from the left
              transform: "rotate(0deg)", // Rotate 20 degrees
            }}
          >
            <FaQuoteRight />
          </div>
          <div
            className="text-6xl text-purple-300 opacity-10"
            style={{
              position: "absolute",
              bottom: "5%", // 15% from the bottom
              right: "40%", // 30% from the left
              transform: "rotate(0deg)", // Rotate 10 degrees
            }}
          >
            <FaQuoteLeft />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmationModal;
