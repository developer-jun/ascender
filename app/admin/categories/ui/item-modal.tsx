import { memo, useEffect, useState } from "react";
import { OptionItem } from "@/types/option";
import { usePageContext, usePageDispatch } from "@/admin/contexts/category";
import { MessagePrompt, OptionItemsContextType, ToastContextType } from "@/types/common";
import { isEmpty } from "@/utils/helpers";
import Modal from '@/components/modal';
import useFetchRequest from "@/hooks/useFetchRequest";
import { Category, CategoryContextType } from "@/types/category";
import useCategoryItemModal from "@/admin/categories/hooks/useCategoryItemModal";
import { useToastDispatch } from "@/components/toast-provider";


const fetchUrl = '/api/categories/';

type ItemModalProps = {
  item: Category,
  onClose: () => void
}
const ItemModal = ({item, onClose}: ItemModalProps) => {
  const { selectedItem } = usePageContext();
  const { postAction, deleteAction } = useCategoryItemModal({item});
  const pageDispatch = usePageDispatch();
  const toastDispatch = useToastDispatch();
  const { data: deleteResult, loading, fetchRequest } = useFetchRequest<Category, unknown>(fetchUrl);

  useEffect(() => {
    if(deleteResult) {      
      let prompt: MessagePrompt | null = null;
      if(deleteResult.status === 'success') {
        prompt = {
          messageType: 'success', 
          message: 'Category deleted successfully'
        };
      } else if(deleteResult.status === 'failed') {
        prompt = {
          messageType: 'error', 
          message: deleteResult.prompt.message
        };
      }
      toastDispatch({ type: 'add', payload: {
        id: Math.floor(Math.random() * 100),
        alert: prompt
      } as ToastContextType});

      const timer = setTimeout(() => {
        // use this to refresh the category list
        pageDispatch({ 
          type: 'set_field',  
          payload: {
            fieldName: 'refreshCounter',
            data: null
          } 
        }); // should refresh the category list

        onClose(); // callback to parent
      }, 3000);

      return () => clearTimeout(timer);
    }    
  }, [deleteResult, pageDispatch, onClose, toastDispatch]); 

  const confirmCategoryDelete = async() => {
    console.log('confirm category Delete', item);
    fetchRequest({
      fetchUrl: `/${item.id}`,
      method: 'DELETE',
      data: {}
    });    
    // NOTE that the script will continue and won't wait for fetchRequest to finish,
    // we use the useEffect to listen to any changes to the data variable of the custom hook    
  }

  const handleOnDeleteCallback = (arg: boolean) => {
    console.log('handleOnDeleteCallback: ', arg, deleteOption);
    if(arg) {
      // confirm delete
      if(deleteOption && deleteOption.option_id > 0) {
        deleteAction(deleteOption.option_id, '/api/options')      
      }
    } else {
      // cancel, clear the delete object to close the dialog
      pageDispatch({
        type: 'set_fields', 
        payload: {
          deleteOption: undefined
        } as Partial<CategoryContextType> 
      });
    }
  }

  const handleOnCancel = () => {
    pageDispatch({
      type: 'set_fields', 
      payload: {
        selectedOptionItems: {} as Category,
        formToggle: false
      } as Partial<CategoryContextType>
    });
    onClose();
  }

  const handleOnClose = () => {
    console.log('handleOnClose');
    onClose();
  }

  return (
    <Modal
      header={<Modal.Header title="Category Delete" onClose={handleOnClose} />}
      footer={<Modal.Footer onConfirm={() => confirmCategoryDelete()} onCancel={() => handleOnCancel()} buttonLoader={loading} />}
    >
      <div className="items-center text-left px-4">            
        <div className="items-center text-left">
          <h2 className="title font-semibold">Name: { item.name }</h2>
          <p><strong>Description:</strong> {item.description}</p>          
        </div>
      </div>
    </Modal>      
  )
}

export default memo(ItemModal);