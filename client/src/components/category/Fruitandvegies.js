import React from 'react';
import CategoryLayout from './CategoryLayout';

function Fruitandvegies() {
  const subCategories = ['Fresh Fruits', 'Fresh Vegetables', 'Herbs & Seasonings', 'Exotic Fruits'];
  return (
    <CategoryLayout 
      categoryName="Fruits & Vegetables" 
      subCategories={subCategories} 
      icon="🥦" 
    />
  );
}

export default Fruitandvegies;