import React from 'react';
import CategoryLayout from './CategoryLayout';

function Breakfast() {
  const subCategories = ['Instant Noodles', 'Breakfast Cereal', 'Oats', 'Poha & Upma'];
  return (
    <CategoryLayout 
      categoryName="Breakfast & Instant Food" 
      subCategories={subCategories} 
      icon="🥣" 
    />
  );
}

export default Breakfast;