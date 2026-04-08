import React from 'react';
import CategoryLayout from './CategoryLayout';

function Personalcare() {
  const subCategories = ['Bath & Body', 'Hair Care', 'Skin Care', 'Oral Care', 'Wellness'];
  return (
    <CategoryLayout 
      categoryName="Personal Care" 
      subCategories={subCategories} 
      icon="🧴" 
    />
  );
}

export default Personalcare;