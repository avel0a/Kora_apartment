import React, { Suspense } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CookieBanner } from "@/components/CookieBanner";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

// Lazy-loaded pages for code-splitting
const Home = React.lazy(() => import("@/pages/Home"));
const About = React.lazy(() => import("@/pages/About"));
const Rooms = React.lazy(() => import("@/pages/Rooms"));
const RoomDetail = React.lazy(() => import("@/pages/RoomDetail"));
const Gallery = React.lazy(() => import("@/pages/Gallery"));
const Contact = React.lazy(() => import("@/pages/Contact"));
const AuthPage = React.lazy(() => import("@/pages/auth-page"));
const AdminPage = React.lazy(() => import("@/pages/admin-page"));
const NotFound = React.lazy(() => import("@/pages/not-found"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary/30" />
      <span className="text-sm font-bold tracking-[0.3em] text-primary/40 uppercase">Loading…</span>
    </div>
  );
}

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15, ease: "easeInOut" },
};

function AnimatedRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <motion.div {...pageTransition}>
      <Component />
    </motion.div>
  );
}

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />} key={location}>
        <Switch location={location}>
          <Route path="/" component={() => <AnimatedRoute component={Home} />} />
          <Route path="/about" component={() => <AnimatedRoute component={About} />} />
          <Route path="/rooms" component={() => <AnimatedRoute component={Rooms} />} />
          <Route path="/rooms/:slug" component={() => <AnimatedRoute component={RoomDetail} />} />
          <Route path="/gallery" component={() => <AnimatedRoute component={Gallery} />} />
          <Route path="/contact" component={() => <AnimatedRoute component={Contact} />} />
          <Route path="/auth" component={() => <AnimatedRoute component={AuthPage} />} />
          <Route path="/admin">
            <ProtectedRoute component={() => <AnimatedRoute component={AdminPage} />} />
          </Route>
          <Route component={() => <AnimatedRoute component={NotFound} />} />
        </Switch>
      </Suspense>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router />
          <WhatsAppButton />
          <CookieBanner />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
