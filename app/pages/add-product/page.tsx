import ProductForm from '@/components/product/AddProduct';
import { Button } from '@/components/ui/button';
import React from 'react';

const AddProductPage = () => {
  return (
    <div>
      <Button
        variant='outline'
        className='mb-4'
        onClick={() => {
          console.log('Back button clicked');
        }}
      >
        Back
      </Button>
      <ProductForm />
    </div>
  );
};

export default AddProductPage;
