"use client";

import Link from "next/link";
import { motion } from "motion/react";

// CTA Section
const CTASection = () => (
  <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-primary/5">
    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
      <motion.div
        className="border border-primary/20 rounded-3xl p-12 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-500 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to Start Reading?
          </h2>
          <p className="text-xl mb-10 text-muted-foreground leading-relaxed">
            Join our digital library today! Issue books instantly, read online,
            and explore our latest collection. Your reading journey starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="group px-10 py-4 rounded-xl bg-primary text-primary-foreground font-semibold border-2 border-primary hover:bg-primary/90 hover:shadow-strong hover-lift transition-all duration-500 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Join Library
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            </Link>
            <Link
              href="/books"
              className="px-10 py-4 rounded-xl border-2 border-border text-foreground font-semibold hover:bg-muted hover:border-primary/30 hover-lift transition-all duration-500"
            >
              Browse Books
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
