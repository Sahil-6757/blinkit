import React from 'react';
import CategoryLayout from './CategoryLayout';

function Bakery() {
  const subCategories = ['Biscuits', 'Cookies', 'Cakes', 'Muffins', 'Rusk'];
  return (
    <CategoryLayout 
      categoryName="Bakery & Biscuits" 
      subCategories={subCategories} 
      icon="🍞" 
    />
  );
}

export default Bakery;