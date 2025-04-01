
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { ProductOption } from '@/types/userData';

interface ProductSelectorProps {
  products: ProductOption[];
  selectedProduct: ProductOption | null;
  onSelect: (product: ProductOption) => void;
  onContinue: () => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({ 
  products, 
  selectedProduct,
  onSelect,
  onContinue
}) => {
  const { translate } = useLanguage();
  
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold mb-4 text-center">{translate('selectOffer')}</h1>
      
      <div className="space-y-3">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className={`border ${selectedProduct?.id === product.id ? 'border-accu-tech-blue' : 'border-gray-200'}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <RadioGroup value={selectedProduct?.id?.toString()} className="mt-1">
                  <div className="flex items-center">
                    <RadioGroupItem 
                      value={product.id.toString()} 
                      id={`product-${product.id}`} 
                      onClick={() => onSelect(product)}
                    />
                  </div>
                </RadioGroup>
                
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <img 
                      src="/lovable-uploads/12563003-3a79-4683-b6fa-482a7ee135e9.png" 
                      alt="Accu-Tech" 
                      className="w-12 h-12 object-contain mr-3" 
                    />
                    <div>
                      <h3 className="font-semibold">
                        {product.title} {product.discount && <span className="text-accu-tech-blue ml-1">{product.discount}</span>}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">€{product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-gray-500 line-through text-sm">€{product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {product.installments && (
                    <p className="text-sm text-gray-600 mt-1">{product.installments}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Button 
        onClick={onContinue} 
        disabled={!selectedProduct}
        className="w-full bg-accu-tech-blue hover:bg-accu-tech-dark-blue rounded-full py-3"
      >
        {translate('buy')} - €{selectedProduct?.price.toFixed(2) || '0.00'}
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full mt-3 border-gray-300 text-gray-600"
        onClick={() => window.navigator.clipboard.writeText('ACCUTECH30')}
      >
        {translate('copyPromoCode')}
      </Button>
    </div>
  );
};

export default ProductSelector;
