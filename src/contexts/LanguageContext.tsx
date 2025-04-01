import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  translate: (key: string, params?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>(() => {
    // Get saved language from localStorage or default to 'en'
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    // Save language to localStorage whenever it changes
    localStorage.setItem('language', language);
  }, [language]);

  const translations = {
    en: {
      'language': 'Language',
      'selectLanguage': 'Select Language',
      'spanish': 'Spanish',
      'portuguese': 'Portuguese',
      'saveAndReturn': 'Save and Return',
      'firstName': 'First Name',
      'lastName': 'Last Name',
      'phone': 'Phone',
      'address': 'Address',
      'province': 'Province',
      'city': 'City',
      'postalCode': 'Postal Code',
      'enterShippingAddress': 'Enter Shipping Address',
      'total': 'Total',
      'finishOrder': 'Finish Order',
      'paymentOnDelivery': 'Payment on Delivery',
      'shippingMethod': 'Shipping Method',
      'freeShipping': 'Free Shipping',
      'days': 'days',
      'free': 'Free',
      'moneyBackGuarantee': 'Money-Back Guarantee',
      'secureTransaction': 'Secure Transaction',
      'subtotal': 'Subtotal',
      'shipping': 'Shipping',
      'unit': 'unit',
      'buy': 'Buy',
      'copyPromoCode': 'Copy Promo Code',
      'installments': '{count} installments of {value}',
      'buy3get1': 'Buy 3 Get 1 Free',
      'selectOffer': 'Select your offer',
      'confirmYourOrder': 'Confirm Your Order',
      'confirmationWarning': 'Please confirm your shipping address and order details carefully before proceeding.',
      'shippingAddress': 'Shipping Address',
      'paymentMethod': 'Payment Method',
      'confirmAndFinish': 'Confirm and Finish',
      'processing': 'Processing...',
      'cancelOrder': 'Cancel Order',
      'orderCancelled': 'Order Cancelled',
      'orderCancelledMessage': 'Your order has been cancelled. Thank you for considering our product.'
    },
    es: {
      'language': 'Idioma',
      'selectLanguage': 'Seleccionar idioma',
      'spanish': 'Español',
      'portuguese': 'Portugués',
      'saveAndReturn': 'Guardar y volver',
      'firstName': 'Nombre',
      'lastName': 'Apellido',
      'phone': 'Teléfono',
      'address': 'Dirección',
      'province': 'Provincia',
      'city': 'Ciudad',
      'postalCode': 'Código Postal',
      'enterShippingAddress': 'Ingrese la dirección de envío',
      'total': 'Total',
      'finishOrder': 'Finalizar pedido',
      'paymentOnDelivery': 'Pago contra entrega',
      'shippingMethod': 'Método de envío',
      'freeShipping': 'Envío gratis',
      'days': 'días',
      'free': 'Gratis',
      'moneyBackGuarantee': 'Garantía de devolución de dinero',
      'secureTransaction': 'Transacción segura',
      'subtotal': 'Subtotal',
      'shipping': 'Envío',
      'unit': 'unidad',
      'buy': 'Comprar',
      'copyPromoCode': 'Copiar código promocional',
      'installments': '{count} cuotas de {value}',
      'buy3get1': 'Compra 3 y llévate 1 gratis',
      'selectOffer': 'Seleccione su oferta',
      'confirmYourOrder': 'Confirma tu orden',
      'confirmationWarning': 'Por favor, confirme cuidadosamente su dirección de envío y los detalles del pedido antes de continuar.',
      'shippingAddress': 'Dirección de Envío',
      'paymentMethod': 'Método de Pago',
      'confirmAndFinish': 'Confirmar y Finalizar',
      'processing': 'Procesando...',
      'cancelOrder': 'Cancelar Orden',
      'orderCancelled': 'Orden Cancelada',
      'orderCancelledMessage': 'Su pedido ha sido cancelado. Gracias por considerar nuestro producto.'
    },
    pt: {
      'language': 'Idioma',
      'selectLanguage': 'Selecionar idioma',
      'spanish': 'Espanhol',
      'portuguese': 'Português',
      'saveAndReturn': 'Salvar e retornar',
      'firstName': 'Primeiro Nome',
      'lastName': 'Sobrenome',
      'phone': 'Telefone',
      'address': 'Endereço',
      'province': 'Província',
      'city': 'Cidade',
      'postalCode': 'Código Postal',
      'enterShippingAddress': 'Insira o endereço de entrega',
      'total': 'Total',
      'finishOrder': 'Finalizar pedido',
      'paymentOnDelivery': 'Pagamento na entrega',
      'shippingMethod': 'Método de envio',
      'freeShipping': 'Frete grátis',
      'days': 'dias',
      'free': 'Grátis',
      'moneyBackGuarantee': 'Garantia de devolução do dinheiro',
      'secureTransaction': 'Transação segura',
      'subtotal': 'Subtotal',
      'shipping': 'Frete',
      'unit': 'unidade',
      'buy': 'Comprar',
      'copyPromoCode': 'Copiar código promocional',
      'installments': '{count} parcelas de {value}',
      'buy3get1': 'Compre 3 Leve 4',
      'selectOffer': 'Selecione sua oferta',
      'confirmYourOrder': 'Confirme seu pedido',
      'confirmationWarning': 'Por favor, confirme cuidadosamente seu endereço de entrega e os detalhes do pedido antes de prosseguir.',
      'shippingAddress': 'Endereço de entrega',
      'paymentMethod': 'Método de pagamento',
      'confirmAndFinish': 'Confirmar e finalizar',
      'processing': 'Processando...',
      'cancelOrder': 'Cancelar pedido',
      'orderCancelled': 'Pedido cancelado',
      'orderCancelledMessage': 'Seu pedido foi cancelado. Obrigado por considerar nosso produto.'
    }
  };

  const translate = (key: string, params: { [key: string]: string | number } = {}) => {
    let translation = translations[language as keyof typeof translations][key] || key;

    for (const paramKey in params) {
      translation = translation.replace(`{${paramKey}}`, String(params[paramKey]));
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
