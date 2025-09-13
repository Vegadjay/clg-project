"use client";

import Link from "next/link";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { motion } from "motion/react";

const HeroSection = () => (
  <section className="relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float"></div>
      <div
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="inline-flex items-center gap-3 mb-8 px-6 py-3 glass rounded-full text-sm text-muted-foreground shadow-soft"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          Your Digital Library Experience
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
        >
          <span className="italic">KitabGhar</span>
          <br />
          <span className="text-primary font-light italic">
            Issue • Read • Discover
          </span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.4, ease: "easeOut" }}
        >
          Issue books instantly, read online with our digital collection, and
          explore our latest curated selection of books. Your gateway to endless
          knowledge awaits.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.5, ease: "easeOut" }}
        >
          <Link
            href="/books"
            className="group px-10 py-4 rounded-xl bg-primary text-primary-foreground font-semibold border-2 border-primary hover:bg-primary/90 hover:shadow-strong hover-lift transition-all duration-300 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Browse Latest Books
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
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
