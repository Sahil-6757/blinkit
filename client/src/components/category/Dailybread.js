import React from 'react';
import CategoryLayout from './CategoryLayout';

function Dailybread() {
  const subCategories = ['Milk', 'Butter & Spread', 'Bread', 'Eggs', 'Cheese', 'Yogurt'];
  return (
    <CategoryLayout 
      categoryName="Dairy, Bread & Eggs" 
      subCategories={subCategories} 
      icon="🥛" 
    />
  );
}

export default Dailybread;