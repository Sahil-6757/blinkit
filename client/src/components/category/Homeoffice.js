import React from 'react';
import CategoryLayout from './CategoryLayout';

function Homeoffice() {
  const subCategories = ['Stationery', 'Home Decor', 'Kitchenware', 'Pooja Needs'];
  return (
    <CategoryLayout 
      categoryName="Home & Office" 
      subCategories={subCategories} 
      icon="🏠" 
    />
  );
}

export default Homeoffice;