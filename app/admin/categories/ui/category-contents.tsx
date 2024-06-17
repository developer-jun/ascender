"use client"

import { usePageContext, usePageDispatch } from '@/admin/contexts/category'
import { createHierarchy}  from '@/utils/category';
import { Category } from '@/types/category';
import { useEffect, useState } from 'react';
import Loader from '@/components/loader';
import useFetchAPI from '@/hooks/useFetchAPI';
import CategoryList from "@/admin/categories/ui/category-list";
import CategoryForm from "./category-form";

export default function CategoryContents() {
  const { refreshCounter } = usePageContext(); 
  const { data: categories } = useFetchAPI<Category>('/api/categories?ref='+ refreshCounter);  
  const [ loadingIndicator, setLoadingIndicator ] = useState(true); // a more reliable way to show loading indicator, the one from useFetchAPI is slow as the custom hook has to be mounted
  const pageDispatch = usePageDispatch();  

  useEffect(() => {
    console.log('categories:',categories);
    if(categories) {
      pageDispatch({ 
        type: 'set_fields', 
        payload: {
          items: categories,
          hierarchedCategories: createHierarchy(categories)
        }
      });   
      const timer = setTimeout(() => {
        setLoadingIndicator(false);
      }, 100);

      return () => clearTimeout(timer);
    }    
  },[categories, pageDispatch]); 

  return (
    <>      
      <div className="custom-form w-1/4">
        <CategoryForm key={refreshCounter} /> {/** Giving it a key allow us to clear the form when user selects a new category */}
      </div>
      <div className="custom-list w-3/4 relative">        
        {loadingIndicator 
          ? <div className="form-overlay"><Loader /></div>
          : <CategoryList  />
        }
      </div>      
    </>    
  )
}
