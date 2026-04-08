import React from 'react';
import CategoryLayout from './CategoryLayout';

function Teacoffie() {
  const subCategories = ['Tea', 'Coffee', 'Juices', 'Energy Drinks'];
  return (
    <CategoryLayout 
      categoryName="Tea, Coffee & Drinks" 
      subCategories={subCategories} 
      icon="☕" 
    />
  );
}

export default Teacoffie;