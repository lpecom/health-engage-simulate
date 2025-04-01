
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { ProductOption } from '@/types/userData';

interface ProductSummaryProps {
  product: ProductOption | null;
}

export const ProductSummary: React.FC<ProductSummaryProps> = ({ product }) => {
  const { translate } = useLanguage();
  
  if (!product) return null;
  
  const total = product.price + product.shipping;
  
  return (
    <Card className="mb-4 mt-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 border-b pb-3 mb-3">
          <img 
            src="/lovable-uploads/12563003-3a79-4683-b6fa-482a7ee135e9.png" 
            alt="Accu-Tech" 
            className="w-12 h-12 object-contain" 
          />
          <div>
            <p className="text-sm">Accu-Tech {product.units} {translate(product.units === 1 ? 'unit' : 'units')}</p>
            <p className="text-xs text-gray-500">{translate('deviceDescription')}</p>
          </div>
          <div className="ml-auto">
            <p className="font-bold">€{product.price.toFixed(2)}</p>
            {product.discount && <p className="text-xs text-accu-tech-blue">{product.discount}</p>}
          </div>
        </div>
        
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>{translate('subtotal')}</span>
            <span>€{product.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>{translate('shipping')}</span>
            <span>€{product.shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t mt-2">
            <span>{translate('total')}</span>
            <span>€{total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSummary;
