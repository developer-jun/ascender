import { memo, useEffect } from "react";
import { usePageContext, usePageDispatch } from "@/admin/contexts/tag";
import { ContextType, MessagePrompt } from "@/types/common";
import { Tag } from "@/types/tag";
import { useToastDispatch } from "@/components/toast-provider";
import Modal from '@/components/modal';
import useFetchRequest from "@/hooks/useFetchRequest";
import useItemModal from "../hooks/useItemModal";

const fetchUrl = '/api/tags/';

type ItemModalProps = {
  item: Tag,
  onClose: () => void
}
const ItemModal = ({item, onClose}: ItemModalProps) => {
  const { selectedItem } = usePageContext();
  const { postAction, deleteAction } = useItemModal({item});
  const pageDispatch = usePageDispatch();
  const toastDispatch = useToastDispatch();
  const { data: deleteResult, loading, fetchRequest } = useFetchRequest<Tag, unknown>(fetchUrl);

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
    fetchRequest({
      fetchUrl: `/${item.tag_id}`,
      method: 'DELETE',
      data: {}
    });    
    // NOTE that the script will continue and won't wait for fetchRequest to finish,
    // we use the useEffect to listen to any changes to the data variable of the custom hook    
  } 

  const handleOnCancel = () => {
    pageDispatch({
      type: 'set_fields', 
      payload: {
        selectedOptionItems: {} as Tag,
        formToggle: false
      } as Partial<ContextType<Tag>>
    });
    onClose();
  }

  const handleOnClose = () => {
    console.log('handleOnClose');
    onClose();
  }

  return (
    <Modal
      header={<Modal.Header title="Item Delete" onClose={handleOnClose} />}
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