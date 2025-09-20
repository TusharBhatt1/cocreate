import React from "react";
import { Users, Pen, ZoomIn, RotateCcw } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Real-Time Collaboration",
    description:
      "Multiple people in one room, working together seamlessly with live cursors and instant updates.",
    gradient: "from-primary to-primary/80",
  },
  {
    icon: Pen,
    title: "Rich Drawing Tools",
    description:
      "Add text, paths, and shapes easily with our intuitive toolkit designed for creative workflows.",
    gradient: "from-accent to-accent/80",
  },
  {
    icon: ZoomIn,
    title: "Smooth Zoom Controls",
    description:
      "Navigate your infinite canvas with smooth zoom in and zoom out interactions that feel natural.",
    gradient: "from-primary to-accent",
  },
  {
    icon: RotateCcw,
    title: "Undo & Redo Actions",
    description:
      "Never worry about mistakes with comprehensive undo and redo functionality for all actions.",
    gradient: "from-accent to-primary",
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30 h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features for
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {" "}
              Creative Teams
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to bring your ideas to life, together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="feature-card scroll-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-6">
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
