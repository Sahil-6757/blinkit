import React from 'react';
import CategoryLayout from './CategoryLayout';

function Colddrink() {
  const subCategories = ['Soft Drinks', 'Juices', 'Energy Drinks', 'Water', 'Soda & Mixers'];
  return (
    <CategoryLayout 
      categoryName="Cold Drinks & Juices" 
      subCategories={subCategories} 
      icon="🥤" 
    />
  );
}

export default Colddrink;