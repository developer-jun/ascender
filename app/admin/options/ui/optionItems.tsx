'use client';
import React, { useEffect } from 'react'
import { OptionItem } from '@/types/option'
import { MessagePrompt, OptionItemsContextType } from '@/types/common';
import { usePageContext, usePageDispatch } from '@/admin/contexts/option';
import { SVG } from '@/components/svg';

type OptionItemsProps = {
  parentOptionId: number,
  items: OptionItem[]
}
export default function OptionItems({parentOptionId, items}: OptionItemsProps) {
  const { refreshCounter, selectedItem  } = usePageContext();
  const pageDispatch = usePageDispatch();
  const message: MessagePrompt = {} as MessagePrompt;

  useEffect(() => {
    if(message && message?.messageType === 'success') {
      pageDispatch({
        type: 'set_field', 
        payload: {
          fieldName: 'refreshOptions', 
          data: refreshCounter + 1
        }
      }); //setMisc({refreshOptions: true}); // notify parent to requery options via this context variable
    }
  }, [message]) // listen to the result of the API call via useOptions hook

  const handleOnClick = (option_id: number = 0) => {
    pageDispatch({
      type: 'set_fields', 
      payload: {          
        selectedOptionItem: {option_id: option_id, item_id: 0, item_name: ''} as OptionItem,
        formToggle: true  
      }  as Partial<OptionItemsContextType>
    });
  }
  
  const handleOnDeleteOption = (option_id: number) => {
    console.log('handleOnDeleteOption:', option_id);
    pageDispatch({
      type: 'set_field', 
      payload: {
        fieldName: 'deleteOption',
        data: selectedItem
      }
    });   
  }

  const onItemEdit = (item: OptionItem) => {
    console.log('editItem:', item);
    pageDispatch({
      type: 'set_fields', 
      payload: {
        selectedOptionItem: item,
        formToggle: true
      } as Partial<OptionItemsContextType> 
    });   
  }

  
  return (
    <>
      <div className='option-list-items-wrap'>
        <div className={`option-list-items active flex justify-between`}>
          <div className="option-list-items-inner flex grow">
            {items && items.map((item, index)=> {
              return (
                  <a key={item.item_id} className='option-list-item' onClick={e=>onItemEdit(item)} href='#'>
                    {item.item_name}, &nbsp; <span key={index} onClick={e=>onItemEdit(item)}>Edit</span>
                  </a>
            )})}
          <a href="#" onClick={e=>handleOnClick(parentOptionId)}><SVG icon='plus' className='text-blue-300' /></a>
          </div>
          { (!items || items.length === 0) 
              ? <div className="tooltip tooltip-left" data-tip="Delete Option">
                  <a className='sm-btn grow-0' href="#" onClick={e=>handleOnDeleteOption(parentOptionId)}><SVG icon='trash' className='text-red-300' /></a>
                </div>          
              : null
          }          
        </div>
      </div>      
    </>
  )
}