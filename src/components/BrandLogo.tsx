
import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/876ba7b6-a6f5-4c1d-91fc-848c85d435bf.png" 
        alt="Accu-Tech" 
        className={`${sizeClasses[size]}`}
      />
    </div>
  );
};

export default BrandLogo;
