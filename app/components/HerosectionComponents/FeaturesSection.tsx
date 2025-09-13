"use client";

import { motion } from "motion/react";

// Feature Card
const FeatureCard = ({
  icon,
  title,
  description,
  delay = 0,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    className={`bg-card p-8 rounded-xl border-2 border-dashed border-border hover:border-primary hover:shadow-lg transition-all duration-500 group relative ${className}`}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    viewport={{ once: true }}
  >
    <div className="relative z-10">
      <div className="w-14 h-14 border-2 border-dashed border-primary/20 rounded-xl flex items-center justify-center mb-6 group-hover:border-primary group-hover:bg-primary/5 transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 text-card-foreground group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

// Features Section
const FeaturesSection = () => (
  <section className="py-24 bg-gradient-to-br from-background via-muted/20 to-background">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        className="text-center mb-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          Everything You Need for Reading
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          From instant book issuing to online reading and discovering our latest
          collection. Experience the future of library management with seamless
          digital workflows.
        </p>
      </motion.div>
      {/* Proper Bento Grid Layout */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.0, staggerChildren: 0.2, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* Large feature card - spans 2 columns */}
        <FeatureCard
          icon={
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          }
          title="Instant Book Issuing"
          description="Issue books instantly with our streamlined process. No more waiting in queues - get your books in seconds with our digital library system."
          className="md:col-span-2 md:row-span-2"
        />

        {/* Online Reading Feature */}
        <FeatureCard
          icon={
            <svg
              className="w-7 h-7 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          }
          title="Read Online"
          description="Access our digital collection and read books online from anywhere."
          delay={0.1}
          className="md:col-span-1"
        />

        {/* Latest Collection Feature */}
        <FeatureCard
          icon={
            <svg
              className="w-7 h-7 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          }
          title="Latest Collection"
          description="Discover our newest additions and curated collections."
          delay={0.2}
          className="md:col-span-1"
        />

        {/* Smart Search Feature */}
        <FeatureCard
          icon={
            <svg
              className="w-7 h-7 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          }
          title="Smart Search"
          description="Find exactly what you're looking for with intelligent search."
          delay={0.3}
          className="md:col-span-2"
        />
      </motion.div>
    </div>
  </section>
);

export default FeaturesSection;
