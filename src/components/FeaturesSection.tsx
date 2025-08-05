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

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="px-4 py-2">
            Platform Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Everything you need for
            <span className="bg-gradient-accent bg-clip-text text-transparent"> enterprise migration</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From discovery to deployment, AccelMigrate handles every step of your data migration journey with AI precision.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {metrics.map((metric, index) => (
            <Card key={index} className="text-center p-8 shadow-card hover:shadow-enterprise transition-smooth">
              <CardContent className="space-y-4">
                <metric.icon className="w-8 h-8 mx-auto text-primary" />
                <div className="text-4xl font-bold text-primary">{metric.value}</div>
                <div className="text-muted-foreground">{metric.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-enterprise transition-smooth shadow-card">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{highlight}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center text-primary group-hover:text-accent transition-colors">
                  <span className="text-sm font-medium">Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};