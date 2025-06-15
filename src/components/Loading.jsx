import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigation } from "react-router";
import { motion } from "framer-motion";

const Loading = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    isLoading && (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4 p-8 rounded-lg shadow-xl bg-base-100"
        >
          <AiOutlineLoading3Quarters className="animate-spin text-primary text-6xl" />
          <p className="text-lg font-semibold text-primary">Loading, please wait...</p>
          <progress className="progress w-56 progress-primary" />
        </motion.div>
      </div>
    )
  );
};

export default Loading;
