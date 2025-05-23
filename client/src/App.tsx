import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/index";
import Blog from "@/pages/Blog";
import FreeTools from "@/pages/FreeTools";
import AdHooks from "@/pages/AdHooks";
import TestLeadForm from "@/pages/TestLeadForm";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog" component={Blog} />
      <Route path="/tools" component={FreeTools} />
      <Route path="/hooks" component={AdHooks} />
      <Route path="/test-form" component={TestLeadForm} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;