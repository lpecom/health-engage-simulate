
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider } from "@/contexts/UserContext";
import OnboardingPage from "./pages/OnboardingPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LearnPage from "./pages/LearnPage";
import LanguagePage from "./pages/LanguagePage";
import PersonalizedPlanPage from "./pages/PersonalizedPlanPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LanguageProvider>
            <UserProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <Navigate 
                        to={localStorage.getItem('onboardingComplete') === 'true' ? '/home' : '/onboarding'} 
                        replace 
                      />
                    } 
                  />
                  <Route path="/onboarding" element={<OnboardingPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-success" element={<OrderSuccessPage />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/learn/:topic" element={<LearnPage />} />
                  <Route path="/language" element={<LanguagePage />} />
                  <Route path="/plan" element={<PersonalizedPlanPage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </UserProvider>
          </LanguageProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
