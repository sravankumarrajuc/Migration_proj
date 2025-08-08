import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-migration.jpg";
import { ArrowRight, Database, Cloud, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-feature">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Data migration visualization" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-primary/5"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Badge */}
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
            <Zap className="w-4 h-4 mr-2" />
            Factspan Powered AI Migration
          </Badge>

          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-2xl md:text-4xl lg:text-4xl font-bold tracking-tight">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                FactiMigrate
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              No-code AI accelerator that automates enterprise data migrations from legacy schemas to cloud warehouses
            </p>
          </div>

          {/* Value proposition */}
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-foreground/80 leading-relaxed">
              Go from upload to validated reports in <span className="font-semibold text-primary">minutes instead of months</span>. 
              Powered by smart lineage discovery, AI-driven field mapping, automated ETL code generation, and built-in QA.
            </p>
          </div>

          {/* Migration flow visualization */}
          <div className="flex items-center justify-center space-x-4 md:space-x-8 py-8">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Database className="w-6 h-6" />
              <span className="text-sm font-medium">Legacy Systems</span>
            </div>
            <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
            <div className="flex items-center space-x-2 bg-gradient-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium">
              <Zap className="w-4 h-4" />
              FactiMigrate AI
            </div>
            <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Cloud className="w-6 h-6" />
              <span className="text-sm font-medium">Cloud Warehouses</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/projects">
              <Button variant="hero" size="lg" className="px-8 py-6 text-lg">
                Schema Analyzer
              </Button>
            </Link>
            <Link to="/code-generation">
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                Report Code Migration
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          {/* <div className="pt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">Trusted by enterprise teams worldwide</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <span className="text-sm font-medium">Fortune 500</span>
              <span className="text-sm font-medium">•</span>
              <span className="text-sm font-medium">Enterprise Ready</span>
              <span className="text-sm font-medium">•</span>
              <span className="text-sm font-medium">SOC 2 Compliant</span>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};