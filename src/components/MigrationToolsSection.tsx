import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const MigrationToolsSection = () => {
  return (
    <section className="py-12 md:py-20 lg:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Schema Analyzer</CardTitle>
              <CardDescription>Analyze and visualize your database schemas.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/projects">
                <Button>Open Schema Analyzer</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Report Code Migration</CardTitle>
              <CardDescription>Generate and manage code migration reports.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/code-generation">
                <Button>Open Report Code Migration</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};