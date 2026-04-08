import React from 'react';
import CategoryLayout from './CategoryLayout';

function Babycare() {
  const subCategories = ['Diapers & Wipes', 'Baby Food', 'Baby Skin Care', 'Baby Accessories'];
  return (
    <CategoryLayout 
      categoryName="Baby Care" 
      subCategories={subCategories} 
      icon="🍼" 
    />
  );
}

export default Babycare;