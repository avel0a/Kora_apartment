import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useSettings, getSetting } from "@/hooks/use-settings";

export function InitialLoader({ onComplete }: { onComplete: () => void }) {
  const { data: settings } = useSettings();
  const siteName = getSetting(settings, "site_name", "KORA");

  useEffect(() => {
    // Show the loader for 2 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      key="initial-loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-background flex items-center justify-center pointer-events-none"
    >
      <div className="flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-serif font-bold tracking-[0.3em] text-primary"
        >
          {siteName.toUpperCase()}
        </motion.span>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
          className="h-[1px] bg-accent mt-4"
        />
      </div>
    </motion.div>
  );
}
