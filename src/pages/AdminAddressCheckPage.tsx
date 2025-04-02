
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Check, X, AlertTriangle, Loader2, CheckSquare } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Order = Tables<'orders'>;

interface AddressCheckResult {
  isValid: boolean;
  suggestedAddress?: string;
  suggestedCity?: string;
  suggestedProvince?: string;
  suggestedPostalCode?: string;
  issues?: string[];
  confidence?: number;
}

const AdminAddressCheckPage = () => {
  const { translate } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [addressCheckResults, setAddressCheckResults] = useState<Record<string, AddressCheckResult>>({});
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
  });
  
  const checkAddressMutation = useMutation({
    mutationFn: async (order: Order) => {
      setSelectedOrderId(order.id);
      
      try {
        // Call the Supabase Edge Function for address validation
        const { data, error } = await supabase.functions.invoke('address-validation', {
          body: { 
            address: {
              street: order.customer_address,
              city: order.city,
              province: order.province,
              postalCode: order.zip_code,
              country: 'ES' // Default to Spain for now
            }
          }
        });
        
        if (error) throw error;
        
        // Update the results state
        setAddressCheckResults(prev => ({
          ...prev,
          [order.id]: data
        }));
        
        return data;
      } catch (error) {
        console.error("Error checking address:", error);
        throw error;
      } finally {
        setSelectedOrderId(null);
      }
    },
    onError: (error) => {
      toast({
        title: "Address check failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const bulkCheckAddressMutation = useMutation({
    mutationFn: async (orderIds: string[]) => {
      setIsBulkProcessing(true);
      
      try {
        const results: Record<string, AddressCheckResult> = {};
        
        // Process orders sequentially to avoid rate limiting
        for (const orderId of orderIds) {
          const order = orders?.find(o => o.id === orderId);
          if (!order) continue;
          
          setSelectedOrderId(orderId);
          
          // Call the Supabase Edge Function for address validation
          const { data, error } = await supabase.functions.invoke('address-validation', {
            body: { 
              address: {
                street: order.customer_address,
                city: order.city,
                province: order.province,
                postalCode: order.zip_code,
                country: 'ES' // Default to Spain for now
              }
            }
          });
          
          if (error) throw error;
          
          results[orderId] = data;
          
          // Add a small delay between requests
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Update the results state with all new results
        setAddressCheckResults(prev => ({
          ...prev,
          ...results
        }));
        
        return results;
      } catch (error) {
        console.error("Error checking addresses in bulk:", error);
        throw error;
      } finally {
        setIsBulkProcessing(false);
        setSelectedOrderId(null);
      }
    },
    onSuccess: () => {
      toast({
        title: translate("bulkValidationComplete"),
        description: translate("addressesValidated"),
      });
    },
    onError: (error) => {
      toast({
        title: translate("bulkValidationFailed"),
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const updateOrderAddressMutation = useMutation({
    mutationFn: async ({ 
      orderId, 
      address, 
      city, 
      province, 
      zipCode 
    }: { 
      orderId: string, 
      address?: string, 
      city?: string, 
      province?: string, 
      zipCode?: string 
    }) => {
      const updateData: any = {};
      if (address) updateData.customer_address = address;
      if (city) updateData.city = city;
      if (province) updateData.province = province;
      if (zipCode) updateData.zip_code = zipCode;
      
      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      toast({
        title: translate("addressUpdated"),
        description: translate("orderAddressUpdated"),
      });
      
      // Clear the result for this order since we've applied the changes
      setAddressCheckResults(prev => {
        const newResults = { ...prev };
        delete newResults[data.id];
        return newResults;
      });

      // Also remove from selected orders if it's there
      setSelectedOrders(prev => {
        const newSelected = new Set(prev);
        newSelected.delete(data.id);
        return newSelected;
      });
    },
    onError: (error) => {
      toast({
        title: translate("updateFailed"),
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const bulkApplyAddressSuggestions = () => {
    // Filter to only selected orders that have invalid addresses with suggestions
    const ordersToUpdate = Array.from(selectedOrders).filter(orderId => {
      const result = addressCheckResults[orderId];
      return result && !result.isValid && 
        (result.suggestedAddress || result.suggestedCity || result.suggestedPostalCode || result.suggestedProvince);
    });
    
    // Apply updates sequentially
    const applyUpdates = async () => {
      for (const orderId of ordersToUpdate) {
        const result = addressCheckResults[orderId];
        const order = orders?.find(o => o.id === orderId);
        
        if (order && result) {
          await updateOrderAddressMutation.mutateAsync({
            orderId,
            address: result.suggestedAddress,
            city: result.suggestedCity,
            province: result.suggestedProvince,
            zipCode: result.suggestedPostalCode,
          });
        }
      }
      
      toast({
        title: translate("bulkUpdateComplete"),
        description: `${ordersToUpdate.length} ${translate("ordersUpdated")}`,
      });
    };
    
    if (ordersToUpdate.length > 0) {
      applyUpdates();
    } else {
      toast({
        title: translate("noOrdersToUpdate"),
        description: translate("noValidSuggestions"),
      });
    }
  };

  const applyAddressSuggestion = (order: Order) => {
    const result = addressCheckResults[order.id];
    if (!result) return;
    
    updateOrderAddressMutation.mutate({
      orderId: order.id,
      address: result.suggestedAddress,
      city: result.suggestedCity,
      province: result.suggestedProvince,
      zipCode: result.suggestedPostalCode,
    });
  };
  
  const handleSelectAll = () => {
    if (isAllSelected) {
      // Deselect all
      setSelectedOrders(new Set());
    } else {
      // Select all orders
      const allOrderIds = orders?.map(order => order.id) || [];
      setSelectedOrders(new Set(allOrderIds));
    }
    setIsAllSelected(!isAllSelected);
  };
  
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(orderId)) {
        newSelected.delete(orderId);
      } else {
        newSelected.add(orderId);
      }
      return newSelected;
    });
  };
  
  const handleBulkValidation = () => {
    const orderIdsToValidate = selectedOrders.size > 0 
      ? Array.from(selectedOrders)
      : (orders?.map(order => order.id) || []);
    
    if (orderIdsToValidate.length === 0) {
      toast({
        title: translate("noOrdersSelected"),
        description: translate("selectOrdersToValidate"),
      });
      return;
    }
    
    bulkCheckAddressMutation.mutate(orderIdsToValidate);
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
          <h1 className="text-xl font-bold">{translate('addressCheck')}</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <CardTitle>{translate('aiAddressValidation')}</CardTitle>
                <CardDescription>{translate('validateAddresses')}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={isBulkProcessing}
                  onClick={handleSelectAll}
                >
                  {isAllSelected ? translate('deselectAll') : translate('selectAll')}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBulkValidation}
                  disabled={isBulkProcessing}
                >
                  {isBulkProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {translate('processing')}
                    </>
                  ) : (
                    translate('bulkValidateAddresses')
                  )}
                </Button>
                {selectedOrders.size > 0 && (
                  <Button 
                    onClick={bulkApplyAddressSuggestions}
                    disabled={isBulkProcessing || updateOrderAddressMutation.isPending}
                  >
                    {translate('bulkApplySuggestions')}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-10">{translate('loading')}...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <input 
                        type="checkbox" 
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </TableHead>
                    <TableHead>{translate('orderID')}</TableHead>
                    <TableHead>{translate('customer')}</TableHead>
                    <TableHead>{translate('address')}</TableHead>
                    <TableHead>{translate('status')}</TableHead>
                    <TableHead>{translate('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.map((order) => {
                    const checkResult = addressCheckResults[order.id];
                    const isSelected = selectedOrders.has(order.id);
                    
                    return (
                      <TableRow key={order.id} className={isSelected ? "bg-slate-50" : ""}>
                        <TableCell>
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => handleSelectOrder(order.id)}
                            className="rounded"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <Button variant="link" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                            {order.id.slice(0, 8)}
                          </Button>
                        </TableCell>
                        <TableCell>
                          {order.customer_name} {order.customer_surname}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {order.customer_address}, {order.city}, {order.province} {order.zip_code}
                        </TableCell>
                        <TableCell>
                          {checkResult ? (
                            checkResult.isValid ? (
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                <Check className="h-3 w-3 mr-1" />
                                {translate('valid')}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {translate('issuesFound')}
                              </Badge>
                            )
                          ) : (
                            <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                              {translate('notChecked')}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => checkAddressMutation.mutate(order)}
                              disabled={selectedOrderId === order.id}
                            >
                              {selectedOrderId === order.id ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              ) : (
                                <>{translate('checkAddress')}</>
                              )}
                            </Button>
                            
                            {checkResult && !checkResult.isValid && (
                              <Button 
                                size="sm" 
                                onClick={() => applyAddressSuggestion(order)}
                              >
                                {translate('applySuggestions')}
                              </Button>
                            )}
                          </div>
                          
                          {checkResult && !checkResult.isValid && checkResult.issues && (
                            <div className="mt-2 text-xs text-amber-700">
                              <p className="font-medium mb-1">{translate('issuesDetected')}:</p>
                              <ul className="list-disc list-inside">
                                {checkResult.issues.map((issue, i) => (
                                  <li key={i}>{issue}</li>
                                ))}
                              </ul>
                              {(checkResult.suggestedAddress || checkResult.suggestedPostalCode) && (
                                <div className="mt-1">
                                  <p className="font-medium">{translate('suggestions')}:</p>
                                  {checkResult.suggestedAddress && (
                                    <p><span className="font-medium">Address:</span> {checkResult.suggestedAddress}</p>
                                  )}
                                  {checkResult.suggestedPostalCode && (
                                    <p><span className="font-medium">Zip Code:</span> {checkResult.suggestedPostalCode}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAddressCheckPage;
