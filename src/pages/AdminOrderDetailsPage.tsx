
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, CheckCircle, Truck, AlertTriangle, Edit, Package, Printer, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Order = Tables<'orders'>;

const AdminOrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { translate } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string>('');
  
  const { data: order, isLoading, error, refetch } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setOrderStatus(data.status);
      }
      
      return data;
    },
  });
  
  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'order-stats'] });
      toast({
        title: translate("orderUpdated"),
        description: translate("statusUpdated"),
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: translate("updateFailed"),
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleStatusUpdate = () => {
    if (!order) return;
    updateOrderMutation.mutate({ id: order.id, status: orderStatus });
  };
  
  const handlePrintOrder = () => {
    window.print();
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>{translate('loading')}...</p>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{translate('errorLoadingOrder')}</p>
        <Button onClick={() => refetch()}>{translate('tryAgain')}</Button>
      </div>
    );
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {translate('pending')}
          </Badge>
        );
      case 'shipped':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <Truck className="h-3 w-3 mr-1" />
            {translate('shipped')}
          </Badge>
        );
      case 'delivered':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            {translate('delivered')}
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {translate('error')}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-3"
            onClick={() => navigate('/admin/orders')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">{translate('orderDetails')}</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                {translate('orderID')}: {order.id.slice(0, 8)}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={() => refetch()}
                  title={translate('refresh')}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </CardTitle>
              <CardDescription>
                {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}
              </CardDescription>
            </div>
            {!isEditing ? (
              <div className="flex items-center gap-2">
                {getStatusBadge(order.status)}
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  {translate('edit')}
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrintOrder}>
                  <Printer className="h-4 w-4 mr-2" />
                  {translate('print')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="border rounded px-3 py-1 text-sm"
                >
                  <option value="pending">{translate('pending')}</option>
                  <option value="shipped">{translate('shipped')}</option>
                  <option value="delivered">{translate('delivered')}</option>
                  <option value="error">{translate('error')}</option>
                </select>
                <Button size="sm" onClick={handleStatusUpdate} disabled={updateOrderMutation.isPending}>
                  {updateOrderMutation.isPending ? translate('saving') : translate('save')}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                  {translate('cancel')}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">{translate('customer')}</h3>
                <div className="bg-gray-50 rounded-md p-4">
                  <p className="font-medium">{order.customer_name} {order.customer_surname}</p>
                  <p>{order.customer_phone}</p>
                </div>
                
                <h3 className="font-medium mb-2 mt-4">{translate('shippingAddress')}</h3>
                <div className="bg-gray-50 rounded-md p-4">
                  <p>{order.customer_address}</p>
                  <p>{order.city}, {order.province} {order.zip_code}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">{translate('orderDetails')}</h3>
                <div className="bg-gray-50 rounded-md p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Package className="h-10 w-10 text-gray-400" />
                    <div>
                      <p className="font-medium">{order.product_name}</p>
                      <p className="text-sm text-gray-500">x{order.product_quantity}</p>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>{translate('productPrice')}</span>
                      <span>€{order.product_price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{translate('shipping')}</span>
                      <span>€{order.shipping_price.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>{translate('total')}</span>
                      <span>€{order.total_price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-medium mb-2 mt-4">{translate('paymentMethod')}</h3>
                <div className="bg-gray-50 rounded-md p-4">
                  <p>{order.payment_method === 'COD' ? translate('cashOnDelivery') : order.payment_method}</p>
                </div>
                
                {order.shopify_order_id && (
                  <>
                    <h3 className="font-medium mb-2 mt-4">Shopify</h3>
                    <div className="bg-gray-50 rounded-md p-4">
                      <p>{translate('shopifyOrderID')}: {order.shopify_order_id}</p>
                      <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                        <CheckCircle className="h-3 w-3" />
                        {translate('exportedToShopify')}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6 print:hidden">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/admin/address-check')}
              >
                {translate('validateAddress')}
              </Button>
              <Button onClick={() => navigate('/admin/orders')}>
                {translate('backToOrders')}
              </Button>
            </div>

            <style jsx global>{`
              @media print {
                .print\\:hidden {
                  display: none !important;
                }
                body {
                  background: white;
                }
              }
            `}</style>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOrderDetailsPage;
