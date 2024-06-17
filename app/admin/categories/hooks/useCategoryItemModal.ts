import { useEffect } from "react";
import { usePageContext, usePageDispatch } from "@/admin/contexts/category";
import { useToastDispatch } from "@/components/toast-provider";
import { MessagePrompt } from "@/types/common";
import { OptionItem } from "@/types/option";
import { isEmpty } from "@/utils/helpers";
import useDeleteAPI from "@/hooks/useDeleteAPI";
import usePostAPI from "@/hooks/usePostAPI";
import { Category, CategoryContextType } from "@/types/category";

const useCategoryItemModal = ({item}: {item: Category}) => {
  const { selectedItem, refreshCounter } = usePageContext() as CategoryContextType;
  const { postRequest, loading: postLoading, postResult } = usePostAPI<OptionItem>('/api/optionItem/' + (item ? item.id : '')); // what differentiates a create from an update is the id that will be appended to the url
  const { deleteRequest, loading: deleteLoading, deleteResult } = useDeleteAPI<OptionItem>('/api/categories/'); // url is just base url, id is appended to the url before url request
  const pageDispatch = usePageDispatch();
  const toastDispatch = useToastDispatch();

  // for Delete of Option Item
  useEffect(() => {
    if(deleteResult) {
      let notificationMessage: MessagePrompt;
      if(item && item.id > 0) {
        if(deleteResult.status === 'success') {
          notificationMessage = {
            messageType: "success",
            message: "Option successfully Deleted!",
          } as MessagePrompt;
          console.log('Delete success, clearing delete object, refetching data....')
          pageDispatch({
            type: 'set_fields', 
            payload: {
              selectedItem: {},
              deleteOption: undefined,
              refreshCounter: refreshCounter + 1
            } as Partial<CategoryContextType> 
          });
        } else {        
          notificationMessage = {
            messageType: "error",
            message: "Failed to delete Option!",
          } as MessagePrompt;       
        }
      } else {
        if(deleteResult.status === 'success') {
          notificationMessage = {
            messageType: "success",
            message: "Option Item successfully Deleted!",
          } as MessagePrompt;
          pageDispatch({
            type: 'set_fields', 
            payload: {
              selectedOptionItems: {} as Category,
              formToggle: false,
              refreshCounter: refreshCounter + 1
            } as Partial<CategoryContextType>
          });
        } else {        
          notificationMessage = {
            messageType: "error",
            message: "Failed to delete Category!",
          } as MessagePrompt;       
        }
      }
      
      toastDispatch({
        type: 'add', 
        payload: { 
          alert: notificationMessage
        }
      }); 
    }
  }, [deleteResult]);

  // for the Create new and Update
  useEffect(() => {
    if(postResult) {
      let action = (!isEmpty(item) && item.id) ? 'Updated' : 'Created';
      
      let toastMessage: MessagePrompt;
      if(postResult.status === 'success') {
        toastMessage = {
          messageType: "success",
          message: "Category successfully " + action + "!",
        };
        pageDispatch({
          type: 'set_fields', 
          payload: {
            selectedItem: {} as Category,
            refreshCounter: (refreshCounter ? refreshCounter : 0) + 1
          } as Partial<CategoryContextType>
        });
      } else {        
        toastMessage = {
          messageType: "error",
          message: "Failed to " + action + " Category!",
        };       
      }
      toastDispatch({
        type: 'add', 
        payload: { 
          alert: toastMessage
        }
      }); 
    }    
  }, [postResult]);

  const postAction = (categoryItem: Category) => {
    postRequest(categoryItem);
  }

  const deleteAction = (id: number, url?: string) => {
    deleteRequest(id, url);
  }

  return {postAction, postLoading, deleteAction, deleteLoading};
}

export default useCategoryItemModal;