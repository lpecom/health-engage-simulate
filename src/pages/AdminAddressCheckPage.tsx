
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft, Check, X, AlertTriangle, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Order = Tables<'orders'>;

interface AddressCheckResult {
  isValid: boolean;
  suggestedAddress?: string;
  suggestedCity?: string;
  suggestedProvince?: string;
  suggestedZipCode?: string;
  issues?: string[];
}

const AdminAddressCheckPage = () => {
  const { translate } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [addressCheckResults, setAddressCheckResults] = useState<Record<string, AddressCheckResult>>({});
  
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
        const fullAddress = `${order.customer_address}, ${order.city}, ${order.province} ${order.zip_code}`;
        
        // For now we'll simulate the AI check with a simple validation
        // In a real application, this would call an AI service or API
        const simulateAICheck = (): AddressCheckResult => {
          // Simulating some basic address validation
          const hasNumber = /\d/.test(order.customer_address);
          const zipValid = order.zip_code.length >= 4;
          const cityValid = order.city.length > 2;
          
          const issues: string[] = [];
          if (!hasNumber) issues.push("Address might be missing a house/building number");
          if (!zipValid) issues.push("Zip code appears to be invalid");
          if (!cityValid) issues.push("City name seems too short or invalid");
          
          const isValid = issues.length === 0;
          
          // If not valid, generate some suggestions
          let result: AddressCheckResult = { isValid, issues };
          
          if (!isValid) {
            // Simulate some AI suggestions
            if (!hasNumber) {
              result.suggestedAddress = order.customer_address + " 1";
            }
            
            if (!zipValid) {
              const country = order.province === "Madrid" ? "Spain" : "Unknown";
              switch (country) {
                case "Spain":
                  result.suggestedZipCode = order.zip_code.padEnd(5, '0');
                  break;
                default:
                  result.suggestedZipCode = order.zip_code.padEnd(5, '0');
              }
            }
          }
          
          return result;
        };
        
        // Wait for a simulated response (would be an API call in production)
        await new Promise(resolve => setTimeout(resolve, 1500));
        const result = simulateAICheck();
        
        // Update the results state
        setAddressCheckResults(prev => ({
          ...prev,
          [order.id]: result
        }));
        
        return result;
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
        title: "Address updated",
        description: "The order address has been updated with the suggested changes",
      });
      
      // Clear the result for this order since we've applied the changes
      setAddressCheckResults(prev => {
        const newResults = { ...prev };
        delete newResults[data.id];
        return newResults;
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const applyAddressSuggestion = (order: Order) => {
    const result = addressCheckResults[order.id];
    if (!result) return;
    
    updateOrderAddressMutation.mutate({
      orderId: order.id,
      address: result.suggestedAddress,
      city: result.suggestedCity,
      province: result.suggestedProvince,
      zipCode: result.suggestedZipCode,
    });
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
            <CardTitle>{translate('aiAddressValidation')}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-10">{translate('loading')}...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
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
                    
                    return (
                      <TableRow key={order.id}>
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
                              {(checkResult.suggestedAddress || checkResult.suggestedZipCode) && (
                                <div className="mt-1">
                                  <p className="font-medium">{translate('suggestions')}:</p>
                                  {checkResult.suggestedAddress && (
                                    <p><span className="font-medium">Address:</span> {checkResult.suggestedAddress}</p>
                                  )}
                                  {checkResult.suggestedZipCode && (
                                    <p><span className="font-medium">Zip Code:</span> {checkResult.suggestedZipCode}</p>
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
