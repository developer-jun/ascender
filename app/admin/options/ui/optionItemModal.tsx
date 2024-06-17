import { useState } from "react";
import { OptionItem } from "@/types/option";
import { usePageContext, usePageDispatch } from "@/admin/contexts/option";
import { OptionItemsContextType } from "@/types/common";
import { isEmpty } from "@/utils/helpers";
import useOptionItemModal from "../hooks/useOptionItemModal";
import Dialog from "@/components/dialog";
import FormDialog from "@/components/formDialog";
import OptionItemForm from "./optionItemForm";

const OptionItemModal = () => {
  const { selectedOptionItem, formToggle, deleteOption } = usePageContext() as OptionItemsContextType;
  const { postAction, deleteAction } = useOptionItemModal();
  const optionDispatch = usePageDispatch();

  const handleOnDeleteCallback = (arg: boolean) => {
    console.log('handleOnDeleteCallback: ', arg, deleteOption);
    if(arg) {
      // confirm delete
      if(deleteOption && deleteOption.option_id > 0) {
        deleteAction(deleteOption.option_id, '/api/options')      
      }
    } else {
      // cancel, clear the delete object to close the dialog
      optionDispatch({
        type: 'set_fields', 
        payload: {
          deleteOption: undefined
        } as Partial<OptionItemsContextType> 
      });
    }
  }

  const handleCallback = (arg: boolean) => {
    console.log('handleCallback: ', arg);    
    optionDispatch({
      type: 'set_fields', 
      payload: {
        formToggle: arg
      } as Partial<OptionItemsContextType> 
    });    
  }  

  const handleOnSave = (value: string) => {
    console.log('handleOnSave:', value);
    if(selectedOptionItem || value) {
      // check if either create or (update | delete)
      if(!isEmpty(selectedOptionItem) && selectedOptionItem.item_id) {
        if(value === '') {
          // delete
          deleteAction(selectedOptionItem.item_id);
        } else {
          // update
          postAction({...selectedOptionItem, item_name: value} as OptionItem);
        }        
      } else {
        // create
        postAction({...selectedOptionItem, item_name: value} as OptionItem);
      }      
    }
  }

  const handleOnCancel = () => {
    optionDispatch({
      type: 'set_fields', 
      payload: {
        selectedOptionItems: {} as OptionItem,
        formToggle: false
      } as Partial<OptionItemsContextType> 
    });    
  }

  return (
    <>
      {selectedOptionItem
        ? <FormDialog callback={handleCallback} title={`${(selectedOptionItem.item_id) ? 'Edit' : 'Create'} Option Item`} control={formToggle} noClose={true}>
            <OptionItemForm item={selectedOptionItem} handleOnSave={handleOnSave} handleOnCancel={handleOnCancel} />
          </FormDialog>
        : null
      }
      {(deleteOption && !isEmpty(deleteOption))
        ? <Dialog callback={handleOnDeleteCallback} title="Confirm Delete Option?" control={true}>
            <div>
              <strong>ID:</strong> {deleteOption.option_id},<br />
              <strong>Name:</strong> {deleteOption.option_name},<br />
              <strong>Description:</strong> {deleteOption.option_description}
            </div>
          </Dialog>
        : null
      }
    </>
  )
}

export default OptionItemModal;