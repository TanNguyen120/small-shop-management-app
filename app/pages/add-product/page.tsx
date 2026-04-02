import { DataImportButton } from '@/components/import-from-csv-button';
import ProductForm from '@/components/product/AddProduct';

import React from 'react';

const AddProductPage = () => {
  return (
    <div className='p-4'>
      <DataImportButton />
      <ProductForm />
    </div>
  );
};

export default AddProductPage;
