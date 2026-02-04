"use client";

import { motion } from "framer-motion";

export default function ScrollAnimation({
  children,
  className = "",
  delay = 0,
  ...props
}) {
  return (
    <motion.div
      {...props}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
