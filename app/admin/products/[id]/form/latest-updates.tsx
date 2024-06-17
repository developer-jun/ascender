'use client';

import { useEffect } from 'react'
import { Product } from "@/types/product";
import { usePageContext, usePageDispatch } from '@/admin/contexts/product';
import Link from 'next/link';
import useFetchRequest from "@/hooks/useFetchRequest";
import PageLoader from '@/components/page-loader';
import ProductSummary from '../../ui/product-item-summary';

// import useProductContext from '@/app/admin/hooks/useProductsContext';

// by moving the variable outside the component, we prevent it from being recreated on every render.
const latestUpdatesParams = { 
  take: '5', 
  skip: '0',
  sortBy: 'updatedAt',
  order: 'desc'
};
export default function LatestUpdates() {  
  const { data, loading, fetchRequest } = useFetchRequest<Product, unknown>('/api/products/?' + new URLSearchParams(latestUpdatesParams).toString());
  const { items } = usePageContext();
  const pageDispatch = usePageDispatch(); 

  useEffect(() => {
    if(data) {
      console.log('DATA: ', data);
      pageDispatch({
        type: 'set_field',
        payload: {
          fieldName: 'items',
          data
        }
      });
    }    
  }, [data]);

  useEffect(() => {
    console.log('items: ', items);
    if(!items || items.length === 0) {
      fetchRequest({method: 'GET'});
    }    
  }, []);  

  return (
    <>
      { loading && 
        <div className='flex items-center justify-center'>
          <PageLoader />
        </div>
      }
      <ul className='text-sm'>
        {items && items.map((product: Product) => (
          <li key={product.id} className='product-item mb-2'>
            <ProductSummary key={product.id} item={product} />
          </li>
        ))}
      </ul>    
    </>
  )
}

