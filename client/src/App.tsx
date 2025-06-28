import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import UploadContent from "@/pages/UploadContent";
import StudySession from "@/pages/StudySession";
import Library from "@/pages/Library";
import AITutor from "@/pages/AITutor";
import Progress from "@/pages/Progress";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";
import LoginSignup from "@/pages/LoginSignup";
import { useEffect } from "react";
import { useLocation } from "wouter";

function isAuthenticated() {
  return Boolean(localStorage.getItem("token"));
}

function ProtectedRoute({ component: Component }: { component: any }) {
  const [location, navigate] = useLocation();
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);
  // Optionally, show nothing or a loading spinner while redirecting
  return isAuthenticated() ? <Component /> : null;
}

function Router() {
  return (
    <>
      <Switch>
        <Route path="/login" component={LoginSignup} />
        <Route>
          <Layout>
            <Switch>
              <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
              <Route path="/upload" component={() => <ProtectedRoute component={UploadContent} />} />
              <Route path="/study" component={() => <ProtectedRoute component={StudySession} />} />
              <Route path="/library" component={() => <ProtectedRoute component={Library} />} />
              <Route path="/tutor" component={() => <ProtectedRoute component={AITutor} />} />
              <Route path="/progress" component={() => <ProtectedRoute component={Progress} />} />
              <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </Route>
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
