import React from 'react';
import CategoryLayout from './CategoryLayout';

function Organichealthy() {
  const subCategories = ['Organic Vegetables', 'Organic Fruits', 'Honey & Spreads', 'Healthy Snacks'];
  return (
    <CategoryLayout 
      categoryName="Organic & Healthy" 
      subCategories={subCategories} 
      icon="🌿" 
    />
  );
}

export default Organichealthy;