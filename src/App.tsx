import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Projects from "./pages/Projects";
import SchemaUpload from "./pages/SchemaUpload";
import Discovery from "./pages/Discovery";
import { Mapping } from "./pages/Mapping";
import { CodeGeneration } from "./pages/CodeGeneration";
import { Validation } from "./pages/Validation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/projects" replace />} />
          <Route path="/projects" element={<AppLayout />}>
            <Route index element={<Projects />} />
          </Route>
          <Route path="/upload/:projectId" element={<AppLayout />}>
            <Route index element={<SchemaUpload />} />
          </Route>
          {/* Placeholder routes for future phases */}
          <Route path="/discovery/:projectId" element={<AppLayout />}>
            <Route index element={<Discovery />} />
          </Route>
          <Route path="/mapping/:projectId" element={<AppLayout />}>
            <Route index element={<Mapping />} />
          </Route>
          <Route path="/codegen/:projectId" element={<AppLayout />}>
            <Route index element={<CodeGeneration />} />
          </Route>
          <Route path="/validation/:projectId" element={<AppLayout />}>
            <Route index element={<Validation />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
