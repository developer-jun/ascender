"use client";

import { useEffect, useState } from 'react'
import { usePageContext, usePageDispatch } from '@/admin/contexts/option';
import { OptionAndItems } from '@/types/option';
import { OptionContextType, ReducerAction } from '@/types/common';
import OptionGroupForm from './optionGroupForm';
import OptionLists from './optionLists';
import useFetchAPI from '@/hooks/useFetchAPI';
import PageLoader from '@/components/page-loader';

import '../options.scss';

export default function OptionGroups() {
  const { refreshCounter } = usePageContext();  
  const { data: optionData, loading } = useFetchAPI<OptionAndItems>('/api/options?ref='+ refreshCounter);  // url FETCH the options 
  const pageDispatch = usePageDispatch();
  
  // listen to the result of our database FETCH results
  useEffect(() => {
    // result of fetching the options
    if(optionData) {
      pageDispatch({ type: 'set_field', payload: { fieldName: 'items', data: optionData }} as ReducerAction<OptionContextType>);
    }    
  }, [optionData, pageDispatch]);
  
  return (
    <>
      { loading
        ? <PageLoader />
        : null
      }
      <div className='mt-5 flex justify-between gap-2'>
        <div className="custom-form w-1/4 px-2">
          {/* The Add New FORM */}        
          <OptionGroupForm />        
        </div>
        <div className="custom-list w-3/4 px-2">        
          <OptionLists />
        </div>
      </div>
    </>
  )
}
