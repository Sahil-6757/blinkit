import React from 'react';
import CategoryLayout from './CategoryLayout';

function Petcare() {
  const subCategories = ['Dog Food', 'Cat Food', 'Pet Grooming', 'Pet Accessories'];
  return (
    <CategoryLayout 
      categoryName="Pet Care" 
      subCategories={subCategories} 
      icon="🐾" 
    />
  );
}

export default Petcare;