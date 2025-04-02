
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Boxes, FileText, MapPin, ShoppingCart } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminPage = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  
  const { data: orderStats } = useQuery({
    queryKey: ['admin', 'order-stats'],
    queryFn: async () => {
      const { count: total } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
        
      const { count: pending } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
        
      const { count: shipped } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'shipped');
        
      return {
        total: total || 0,
        pending: pending || 0,
        shipped: shipped || 0
      };
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">{translate('adminDashboard')}</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Orders</CardTitle>
              <CardDescription>All orders in system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{orderStats?.total || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending</CardTitle>
              <CardDescription>Orders waiting to be shipped</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{orderStats?.pending || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Shipped</CardTitle>
              <CardDescription>Orders already shipped</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{orderStats?.shipped || 0}</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>View and manage customer orders</CardDescription>
            </CardHeader>
            <CardContent className="h-24 flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/admin/orders')} className="w-full">
                Manage Orders
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Address Check</CardTitle>
              <CardDescription>AI-powered address validation</CardDescription>
            </CardHeader>
            <CardContent className="h-24 flex items-center justify-center">
              <MapPin className="h-12 w-12 text-gray-400" />
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/admin/address-check')} className="w-full">
                Check Addresses
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Shopify</CardTitle>
              <CardDescription>Export orders to Shopify</CardDescription>
            </CardHeader>
            <CardContent className="h-24 flex items-center justify-center">
              <Boxes className="h-12 w-12 text-gray-400" />
            </CardContent>
            <CardFooter>
              <Button className="w-full">Configure Shopify</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
