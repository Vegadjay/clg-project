"use client";

import Link from "next/link";
import FeaturedBooks from "./components/FeaturedBooks";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { AnimatedNumber_002 } from "@/components/custom/AnimateNumber";

const page = () => {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors">
      <section className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 border border-border rounded-full text-sm text-muted-foreground">
              <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
              Modern Library Management System
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-none animate-fade-in">
              <LineShadowText className="italic">KitabGhar</LineShadowText>
              <br />
              <span className="text-primary font-light italic">
                Your world of books
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay">
              Discover a complete library at your fingertips: seamlessly borrow,
              buy, sell, or read books online while expanding your knowledge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
              <Link
                href="/books"
                className="px-10 py-4 rounded-lg bg-primary text-primary-foreground font-semibold border-2 border-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center justify-center transition-transform duration-300">
              <div className="flex items-end gap-1 text-4xl md:text-5xl font-bold text-primary mb-2">
                <AnimatedNumber_002 number={20} />
                <span className="text-2xl md:text-3xl font-semibold text-primary">
                  +
                </span>
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                Books Managed
              </div>
            </div>
            <div className="flex flex-col items-center justify-center transition-transform duration-300">
              <div className="flex items-end gap-1 text-4xl md:text-5xl font-bold text-primary mb-2">
                <AnimatedNumber_002 number={30} />
                <span className="text-2xl md:text-3xl font-semibold text-primary">
                  +
                </span>
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                Transactions
              </div>
            </div>
            <div className="flex flex-col items-center justify-center transition-transform duration-300">
              <div className="flex items-end gap-1 text-4xl md:text-5xl font-bold text-primary mb-2">
                <AnimatedNumber_002 number={10} />
                <span className="text-2xl md:text-3xl font-semibold text-primary">
                  +
                </span>
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                Libraries
              </div>
            </div>
            <div className="flex flex-col items-center justify-center transition-transform duration-300">
              <div className="flex items-end gap-1 text-4xl md:text-5xl font-bold text-primary mb-2">
                <AnimatedNumber_002 number={40} />
                <span className="text-2xl md:text-3xl font-semibold text-primary">
                  +
                </span>
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                Uptime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Built for Modern Libraries
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Every feature designed with librarians, administrators, and
              patrons in mind. Experience seamless workflows and intuitive
              interfaces.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl border-2 border-border hover:border-primary/50 hover:scale-105 transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <svg
                  className="w-6 h-6 text-primary"
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
              </div>
              <h3 className="text-xl font-bold mb-4 text-card-foreground">
                Intelligent Search
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                AI-powered search with natural language queries, advanced
                filters, and personalized recommendations.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl border-2 border-border hover:border-primary/50 hover:scale-105 transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <svg
                  className="w-6 h-6 text-primary"
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
              </div>
              <h3 className="text-xl font-bold mb-4 text-card-foreground">
                Lightning Fast
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Optimized performance with instant search results and real-time
                updates across all devices.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl border-2 border-border hover:border-primary/50 hover:scale-105 transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-card-foreground">
                Secure & Reliable
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Enterprise-grade security with automated backups and 99.9%
                uptime guarantee.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl border-2 border-border hover:border-primary/50 hover:scale-105 transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-card-foreground">
                Smart Analytics
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Comprehensive insights into usage patterns, popular content, and
                operational efficiency.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl border-2 border-border hover:border-primary/50 hover:scale-105 transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <svg
                  className="w-6 h-6 text-primary animate-spin-slow"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-card-foreground">
                Automated Workflows
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Smart notifications, automated renewals, and intelligent
                inventory management.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl border-2 border-border hover:border-primary/50 hover:scale-105 transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-card-foreground">
                Cloud Native
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Access from anywhere with seamless synchronization and offline
                capabilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="border-2 border-primary rounded-2xl p-12 bg-primary/5 hover:bg-primary/10 transition-colors duration-300">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Ready to Transform Your Library?
            </h2>
            <p className="text-xl mb-10 text-muted-foreground leading-relaxed">
              Join the revolution in library management. Start your free trial
              today and see the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-10 py-4 rounded-lg bg-primary text-primary-foreground font-semibold border-2 border-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200"
              >
                Start Free Trial
              </Link>
              <Link
                href="/demo"
                className="px-10 py-4 rounded-lg border-2 border-border text-foreground font-semibold hover:bg-muted hover:scale-105 transition-all duration-200"
              >
                Schedule Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }
        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s both;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-counter {
          animation: fade-in 1s ease-out 0.5s both;
        }
      `}</style>

      <footer className="text-center">
        <a href="/admin/login">admin</a>
      </footer>
    </main>
  );
};

export default page;
