import React from 'react';
import CategoryLayout from './CategoryLayout';

function Cleaning() {
  const subCategories = ['Laundry', 'Dishwash', 'Surface Cleaners', 'Tissues & Rolls'];
  return (
    <CategoryLayout 
      categoryName="Cleaning Essentials" 
      subCategories={subCategories} 
      icon="🧹" 
      
    />
  );
}

export default Cleaning;