import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, MessageCircle } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-feature">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Card className="shadow-enterprise border-0">
          <CardContent className="p-12 md:p-16 text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Ready to accelerate your
                <span className="bg-gradient-hero bg-clip-text text-transparent"> data migration?</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join hundreds of enterprise teams who've transformed months of migration work into minutes of automated precision.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="lg" className="px-8 py-6 text-lg">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                <MessageCircle className="w-5 h-5 mr-2" />
                Talk to Sales
              </Button>
            </div>

            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Start your free trial today • No credit card required • Enterprise support included
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};