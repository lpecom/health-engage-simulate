
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CheckCircle, Clock, Package, AlertCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Tables } from '@/integrations/supabase/types';

type Order = Tables<'orders'>;

const AdminOrdersPage = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const handleExportOrder = async (id: string) => {
    // This function will be implemented later
    alert('Export functionality will be implemented later');
  };

  const handleEditOrder = async (id: string) => {
    // This function will be implemented later
    alert('Edit functionality will be implemented later');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-3"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">{translate('adminOrders')}</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>{translate('allOrders')}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-10">{translate('loading')}...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10">{translate('noOrders')}</div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">
                          {order.customer_name} {order.customer_surname}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€{order.total_price}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                          order.status === 'shipped' ? 'bg-green-100 text-green-800' :
                          order.status === 'error' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {translate(order.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">{translate('product')}</p>
                        <p className="text-sm">{order.product_name} (x{order.product_quantity})</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{translate('phone')}</p>
                        <p className="text-sm">{order.customer_phone}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-xs text-gray-500">{translate('address')}</p>
                      <p className="text-sm">{order.customer_address}, {order.city}</p>
                      <p className="text-sm">{order.zip_code}, {order.province}</p>
                    </div>
                    
                    {order.exported_to_shopify ? (
                      <div className="flex items-center gap-1 text-xs text-green-600 mb-3">
                        <CheckCircle className="h-3 w-3" />
                        <span>{translate('exportedToShopify')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-amber-600 mb-3">
                        <Clock className="h-3 w-3" />
                        <span>{translate('pendingExport')}</span>
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditOrder(order.id)}
                        className="flex items-center gap-1"
                      >
                        <span>{translate('editOrder')}</span>
                      </Button>
                      {!order.exported_to_shopify && (
                        <Button 
                          size="sm"
                          onClick={() => handleExportOrder(order.id)}
                          className="flex items-center gap-1"
                        >
                          <span>{translate('exportToShopify')}</span>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
