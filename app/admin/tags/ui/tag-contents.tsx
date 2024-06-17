"use client"

import { useEffect, useState } from 'react';
import { usePageContext, usePageDispatch } from '@/admin/contexts/tag'
import { Tag } from '@/types/tag';
import Loader from '@/components/loader';
import useFetchAPI from '@/hooks/useFetchAPI';

import TagList from "./tag-list";
import TagForm from "./tag-form";

export default function TagContents() {
  const { refreshCounter } = usePageContext(); 
  const { data: tags } = useFetchAPI<Tag>('/api/tags?ref='+ refreshCounter);  
  const [ loadingIndicator, setLoadingIndicator ] = useState(true);
  const pageDispatch = usePageDispatch();  

  useEffect(() => {
    console.log('tags: ',tags);
    if(tags) {
      pageDispatch({ 
        type: 'set_field', 
        payload: {
          fieldName: 'items',
          data: tags,
        }
      });   
      const timer = setTimeout(() => {
        setLoadingIndicator(false);
      }, 100);

      return () => clearTimeout(timer);
    }    
  },[tags, pageDispatch]); 

  return (
    <>      
      <div className="custom-form w-1/4">
        <TagForm key={refreshCounter} /> {/** Giving it a key allow us to clear the form when user selects a new category */}
      </div>
      <div className="custom-list w-3/4 relative">        
        {loadingIndicator 
          ? <div className="form-overlay"><Loader /></div>
          : <><TagList  /></>
        }
      </div>      
    </>    
  )
}
