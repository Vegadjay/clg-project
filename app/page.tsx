"use client";

import {
  HeroSection,
  StatsSection,
  FeaturesSection,
  FeaturedBooksSection,
  CTASection,
} from "./components/HerosectionComponents";

// Main Page
const Page = () => {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <FeaturedBooksSection />
      <CTASection />
    </main>
  );
};

export default Page;
