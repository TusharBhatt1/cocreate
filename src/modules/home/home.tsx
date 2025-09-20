"use client";

import React from "react";
import {
  ArrowRight,
  Play,
  Users,
  PenTool as Pen,
  ZoomIn,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Users,
    title: "Real-Time Collaboration",
    description:
      "Multiple people in one room, working together seamlessly with live cursors and instant updates.",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
  },
  {
    icon: Pen,
    title: "Rich Drawing Tools",
    description:
      "Add text, paths, and shapes easily with our intuitive toolkit designed for creative workflows.",
    gradient: "from-emerald-500 to-green-400",
  },
  {
    icon: ZoomIn,
    title: "Smooth Zoom Controls",
    description:
      "Navigate your infinite canvas with smooth zoom in and zoom out interactions that feel natural.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: RotateCcw,
    title: "Undo & Redo Actions",
    description:
      "Never worry about mistakes with comprehensive undo and redo functionality for all actions.",
    gradient: "from-orange-500 to-red-400",
  },
];

export default function LandingPage() {
  return (
    <main className="bg-white text-black space-y-12 py-7">
      {/* HERO SECTION */}
      <section className="flex  items-center justify-center px-6">
      <div className="container mx-auto px-6">
      {/* Heading */}
          <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">
            <span className="bg-gradient-to-r from-black via-gray-700 to-gray-300 bg-clip-text text-transparent">
              Create
            </span>
            <br />
            Collaborate
            <br />
            in Real Time
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-lg text-gray-600 md:text-xl">
            Design, brainstorm, and build ideas together on an infinite canvas.
          </p>

          {/* CTA buttons */}
          <div className="mt-6 flex flex-col items-center gap-4 md:flex-row md:items-center">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-md bg-black px-5 py-3 text-white transition hover:scale-105"
            >
              Start Creating <ArrowRight size={18} />
            </Link>
          </div>

          {/* Portfolio link */}
          <div className="mt-6">
            <a
              href="https://tusharbhatt.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 underline hover:text-gray-700"
            >
              View Tushar Bhatt&apos;s Portfolio
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-6">
          {/* Section Heading */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for{" "}
              <span>
                Creative Teams
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to bring your ideas to life, together.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="feature-card group flex flex-col items-center text-center rounded-2xl bg-white/5 p-8 shadow-sm hover:shadow-lg transition duration-300"
                >
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
