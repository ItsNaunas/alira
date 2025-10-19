"use client";

import { motion } from "framer-motion";
import React from "react";

export const Ripple = () => {
  return (
    <>
      {/* Ripple 1 */}
      <motion.div
        className="absolute -top-4 -left-4 h-72 w-72 rounded-full bg-white/10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Ripple 2 */}
      <motion.div
        className="absolute -top-4 -left-4 h-72 w-72 rounded-full bg-white/5"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      
      {/* Ripple 3 */}
      <motion.div
        className="absolute -top-4 -left-4 h-72 w-72 rounded-full bg-white/3"
        animate={{
          scale: [1, 1.6, 1],
          opacity: [0.03, 0.08, 0.03],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      
      {/* Additional ripples for more coverage */}
      <motion.div
        className="absolute top-1/2 -right-4 h-96 w-96 rounded-full bg-white/8"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      
      <motion.div
        className="absolute -bottom-4 left-1/3 h-80 w-80 rounded-full bg-white/6"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.06, 0.12, 0.06],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />
    </>
  );
};
