import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Network, 
  Brain, 
  Code2, 
  Shield, 
  Gauge, 
  Database,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const features = [
  {
    icon: Network,
    title: "Smart Lineage Discovery",
    description: "Automatically maps data relationships and dependencies across complex legacy systems with AI-powered analysis.",
    badge: "Core Feature",
    highlights: ["Auto-discovery", "Dependency mapping", "Visual lineage"]
  },
  {
    icon: Brain,
    title: "AI-Driven Field Mapping",
    description: "Intelligent field matching and transformation suggestions that adapt to any source or target dialect.",
    badge: "AI Powered",
    highlights: ["Smart matching", "Auto-suggestions", "Context aware"]
  },
  {
    icon: Code2,
    title: "Automated ETL Generation",
    description: "Generate production-ready ETL code with zero boilerplate, supporting multiple platforms and languages.",
    badge: "Code Gen",
    highlights: ["Zero boilerplate", "Multi-platform", "Production ready"]
  },
  {
    icon: Shield,
    title: "Built-in Quality Assurance",
    description: "Comprehensive validation, testing, and monitoring throughout the migration process.",
    badge: "Enterprise",
    highlights: ["Data validation", "Automated testing", "Real-time monitoring"]
  }
];

const metrics = [
  { value: "95%", label: "Faster migrations", icon: Gauge },
  { value: "99.9%", label: "Data accuracy", icon: CheckCircle },
  { value: "500+", label: "Data sources", icon: Database },
];

import { Button } from "@/components/ui/button";

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
          Start Your Migration Journey
        </h2>
        <div className="flex justify-center space-x-4">
          <Button size="lg">Start Free Migration</Button>
          <Button size="lg" variant="outline">Watch Demo</Button>
        </div>
      </div>
    </section>
  );
};