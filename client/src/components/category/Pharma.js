import React from 'react';
import CategoryLayout from './CategoryLayout';

function Pharma() {
  const subCategories = ['Medicines', 'Wellness', 'Health Drinks', 'First Aid'];
  return (
    <CategoryLayout 
      categoryName="Pharma & Wellness" 
      subCategories={subCategories} 
      icon="💊" 
    />
  );
}

export default Pharma;