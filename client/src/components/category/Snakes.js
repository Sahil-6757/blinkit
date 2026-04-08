import React from 'react';
import CategoryLayout from './CategoryLayout';

function Snakes() {
  const subCategories = ['Chips & Crisps', 'Namkeen', 'Biscuits & Cookies', 'Chocolates', 'Dry Fruits'];
  return (
    <CategoryLayout 
      categoryName="Snacks & Munchies" 
      subCategories={subCategories} 
      icon="🍿" 
    />
  );
}

export default Snakes;
