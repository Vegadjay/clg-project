"use client";

import FeaturedBooks from "../FeaturedBooks";
import { motion } from "motion/react";

// Featured Books Section
const FeaturedBooksSection = () => (
  <section className="py-24 bg-gradient-to-br from-muted/30 via-background to-muted/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          Latest Book Collection
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Explore our newest additions and trending titles. Issue these books
          instantly or read them online from our digital library.
        </p>
      </motion.div>
      <FeaturedBooks />
    </div>
  </section>
);

export default FeaturedBooksSection;
