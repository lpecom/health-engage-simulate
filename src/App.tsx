
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider } from "@/contexts/UserContext";
import { ShopifyProvider } from "@/contexts/ShopifyContext";
import { initTaboolaPixel, trackTaboolaPageView } from "@/utils/tracking";
import OnboardingPage from "./pages/OnboardingPage";
import HomePage from "./pages/HomePage";
import LearnPage from "./pages/LearnPage";
import LanguagePage from "./pages/LanguagePage";
import PersonalizedPlanPage from "./pages/PersonalizedPlanPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import DeviceConnectionPage from "./pages/DeviceConnectionPage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index"; 
import AdminPage from "./pages/AdminPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminOrderDetailsPage from "./pages/AdminOrderDetailsPage";
import AdminAddressCheckPage from "./pages/AdminAddressCheckPage";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// RouteChangeTracker component to track route changes
const RouteChangeTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    trackTaboolaPageView();
  }, [location]);
  
  return null;
};

const App = () => {
  // Initialize Taboola pixel on app load
  useEffect(() => {
    initTaboolaPixel();
  }, []);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LanguageProvider>
            <UserProvider>
              <ShopifyProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <RouteChangeTracker />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/onboarding" element={<OnboardingPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/device" element={<DeviceConnectionPage />} />
                    <Route path="/learn/:topic" element={<LearnPage />} />
                    <Route path="/language" element={<LanguagePage />} />
                    <Route path="/plan" element={<PersonalizedPlanPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-success" element={<OrderSuccessPage />} />
                    {/* Admin routes */}
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/admin/orders" element={<AdminOrdersPage />} />
                    <Route path="/admin/orders/:id" element={<AdminOrderDetailsPage />} />
                    <Route path="/admin/address-check" element={<AdminAddressCheckPage />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </ShopifyProvider>
            </UserProvider>
          </LanguageProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
