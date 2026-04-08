import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CategoryLayout from './CategoryLayout';

function DynamicCategory() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/categories/${slug}`);
        if (!response.ok) {
          throw new Error('Category not found');
        }
        const data = await response.json();
        setCategory(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCategoryDetails();
  }, [slug]);

  if (loading) return <div className="loading text-center p-5">Loading Category...</div>;
  if (error) return <div className="error text-center p-5 text-danger">Error: {error}</div>;
  if (!category) return <div className="text-center p-5">Category not found</div>;

  return (
    <CategoryLayout 
      categoryName={category.name} 
      icon={category.icon} 
    />
  );
}

export default DynamicCategory;
