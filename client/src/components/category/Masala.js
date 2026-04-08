import React from 'react';
import CategoryLayout from './CategoryLayout';

function Masala() {
  const subCategories = ['Masala', 'Oil', 'Ghee', 'Spices'];
  return (
    <CategoryLayout 
      categoryName="Masala, Oil & More" 
      subCategories={subCategories} 
      icon="🧂" 
    />
  );
}

export default Masala;