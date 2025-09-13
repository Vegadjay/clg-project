"use client";

import { AnimatedNumber_002 } from "@/components/custom/AnimateNumber";
import { motion } from "motion/react";

// Stats Card
const StatCard = ({
  number,
  label,
  delay = 0,
}: {
  number: number;
  label: string;
  delay?: number;
}) => (
  <motion.div
    className="flex flex-col items-center justify-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border-2 border-dashed border-border hover:border-primary hover:shadow-lg transition-all duration-500"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05 }}
  >
    <div className="flex items-end gap-1 text-4xl md:text-5xl font-bold text-primary mb-2">
      <AnimatedNumber_002 number={number} />
      <span className="text-2xl md:text-3xl font-semibold text-primary">+</span>
    </div>
    <div className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
      {label}
    </div>
  </motion.div>
);

// Stats Section
const StatsSection = () => (
  <section className="py-20 border-y border-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, staggerChildren: 0.2, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <StatCard number={500} label="Books Available" />
        <StatCard number={1200} label="Books Issued" delay={0.1} />
        <StatCard number={350} label="Online Readers" delay={0.2} />
        <StatCard number={99} label="Satisfaction Rate" delay={0.3} />
      </motion.div>
    </div>
  </section>
);

export default StatsSection;
