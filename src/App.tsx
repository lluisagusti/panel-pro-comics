import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ComicProvider } from "@/contexts/ComicContext";
import NavBar from "@/components/layout/NavBar";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ComicCreator from "./pages/ComicCreator";
import CheckoutSuccess from "./pages/CheckoutSuccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ComicProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <NavBar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/create" element={<ComicCreator />} />
                  <Route path="/create/:id" element={<ComicCreator />} />
                  <Route path="/checkout/success" element={<CheckoutSuccess />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <footer className="bg-gray-800 text-white py-6">
                <div className="container mx-auto px-4 text-center">
                  <p>&copy; {new Date().getFullYear()} Panel Pro Comics. All rights reserved.</p>
                </div>
              </footer>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ComicProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
