// Professional E-Commerce Platform - Main App
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Shop from "@/pages/Shop";
import Orders from "@/pages/Orders";
import Admin from "@/pages/Admin";
import DriverDashboard from "@/pages/DriverDashboard";
import Loyalty from "@/pages/Loyalty";
import Events from "@/pages/Events";
import Analytics from "@/pages/Analytics";
import AccountSettings from "@/pages/AccountSettings";

function PublicRoutes() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      {/* Catch-all for unauthenticated users, redirecting to landing */}
      <Route path="/:rest*">
        {() => {
          window.location.replace("/");
          return null;
        }}
      </Route>
    </Switch>
  );
}

function CustomerRoutes() {
  return (
    <Switch>
      <Route path="/" component={Shop} />
      <Route path="/shop" component={Shop} />
      <Route path="/orders" component={Orders} />
      <Route path="/loyalty" component={Loyalty} />
      <Route path="/events" component={Events} />
      <Route path="/settings" component={AccountSettings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AdminRoutes() {
  return (
    <Switch>
      <Route path="/" component={Admin} />
      <Route path="/admin" component={Admin} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/shop" component={Shop} />
      <Route path="/orders" component={Orders} />
      <Route path="/loyalty" component={Loyalty} />
      <Route path="/events" component={Events} />
      <Route path="/settings" component={AccountSettings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function DriverRoutes() {
  return (
    <Switch>
      <Route path="/" component={DriverDashboard} />
      <Route path="/driver" component={DriverDashboard} />
      <Route path="/shop" component={Shop} />
      <Route path="/orders" component={Orders} />
      <Route path="/loyalty" component={Loyalty} />
      <Route path="/events" component={Events} />
      <Route path="/settings" component={AccountSettings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20" />
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PublicRoutes />;
  }

  // Redirect based on role if on root path
  if (window.location.pathname === "/") {
    if (user?.role === "admin") return <AdminRoutes />;
    if (user?.role === "driver") return <DriverRoutes />;
    return <CustomerRoutes />;
  }

  if (user?.role === "admin") {
    return <AdminRoutes />;
  }

  if (user?.role === "driver") {
    return <DriverRoutes />;
  }

  return <CustomerRoutes />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
