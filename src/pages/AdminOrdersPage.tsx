
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Package, 
  AlertTriangle, 
  Search,
  Filter,
  XCircle,
  Truck,
  ChevronDown,
  MapPin 
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tables } from '@/integrations/supabase/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Order = Tables<'orders'>;

const AdminOrdersPage = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'price-high' | 'price-low'>('newest');

  // Use React Query for orders data fetching
  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select('*');
      
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      
      // Add sorting
      switch (sortOption) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'price-high':
          query = query.order('total_price', { ascending: false });
          break;
        case 'price-low':
          query = query.order('total_price', { ascending: true });
          break;
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
  });

  // Filter orders by search query
  const filteredOrders = orders.filter(order => {
    const searchLower = searchQuery.toLowerCase();
    if (!searchQuery) return true;
    
    return (
      order.customer_name?.toLowerCase().includes(searchLower) ||
      order.customer_surname?.toLowerCase().includes(searchLower) ||
      order.customer_address?.toLowerCase().includes(searchLower) ||
      order.city?.toLowerCase().includes(searchLower) ||
      order.id.toLowerCase().includes(searchLower) ||
      order.product_name?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
            <Clock className="h-3 w-3" />
            <span>{translate('pending')}</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 flex items-center gap-1 w-fit">
            <Truck className="h-3 w-3" />
            <span>{translate('shipped')}</span>
          </span>
        );
      case 'error':
        return (
          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 flex items-center gap-1 w-fit">
            <AlertTriangle className="h-3 w-3" />
            <span>{translate('error')}</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 flex items-center gap-1 w-fit">
            <CheckCircle className="h-3 w-3" />
            <span>{translate('delivered')}</span>
          </span>
        );
      default:
        return (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 flex items-center gap-1 w-fit">
            {status}
          </span>
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
            onClick={() => navigate('/admin')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">{translate('adminOrders')}</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <CardTitle>{translate('allOrders')}</CardTitle>
                <CardDescription>
                  {filteredOrders.length} {translate('ordersFound')}
                </CardDescription>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <Button 
                  variant="outline" 
                  className="flex gap-1 items-center"
                  onClick={() => navigate('/admin/address-check')}
                >
                  <MapPin className="h-4 w-4" />
                  {translate('addressCheck')}
                </Button>
                <Button 
                  onClick={() => refetch()} 
                  variant="outline"
                  className="flex gap-1 items-center"
                >
                  <Package className="h-4 w-4" />
                  {translate('refresh')}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder={translate('searchOrders')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5"
                  >
                    <XCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter || 'all'} onValueChange={(value) => setStatusFilter(value === 'all' ? null : value)}>
                  <SelectTrigger className="w-[140px] flex gap-1 items-center">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder={translate('filterByStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{translate('allStatuses')}</SelectItem>
                    <SelectItem value="pending">{translate('pending')}</SelectItem>
                    <SelectItem value="shipped">{translate('shipped')}</SelectItem>
                    <SelectItem value="delivered">{translate('delivered')}</SelectItem>
                    <SelectItem value="error">{translate('error')}</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortOption} onValueChange={(value: any) => setSortOption(value)}>
                  <SelectTrigger className="w-[140px] flex gap-1 items-center">
                    <ChevronDown className="h-4 w-4" />
                    <SelectValue placeholder={translate('sortBy')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{translate('newest')}</SelectItem>
                    <SelectItem value="oldest">{translate('oldest')}</SelectItem>
                    <SelectItem value="price-high">{translate('priceHighToLow')}</SelectItem>
                    <SelectItem value="price-low">{translate('priceLowToHigh')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-10">{translate('loading')}...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-10">
                {searchQuery ? translate('noMatchingOrders') : translate('noOrders')}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">
                          <Button variant="link" className="p-0 h-auto text-left" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                            {order.customer_name} {order.customer_surname}
                          </Button>
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€{Number(order.total_price).toFixed(2)}</p>
                        {getStatusBadge(order.status)}
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
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                        className="flex items-center gap-1"
                      >
                        <span>{translate('viewDetails')}</span>
                      </Button>
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
