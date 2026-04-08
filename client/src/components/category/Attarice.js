import React from 'react';
import CategoryLayout from './CategoryLayout';

function Attarice() {
  const subCategories = ['Atta', 'Rice', 'Dal & Pulses', 'Sugar & Salt'];
  return (
    <CategoryLayout 
      categoryName="Atta, Rice & Dal" 
      subCategories={subCategories} 
      icon="🌾" 
    />
  );
}

export default Attarice;