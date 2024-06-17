import { useEffect } from "react";
import { usePageContext, usePageDispatch } from "@/admin/contexts/option";
import { useToastDispatch } from "@/components/toast-provider";
import { MessagePrompt, OptionItemsContextType } from "@/types/common";
import { OptionItem } from "@/types/option";
import { isEmpty } from "@/utils/helpers";
import useDeleteAPI from "@/hooks/useDeleteAPI";
import usePostAPI from "@/hooks/usePostAPI";

const useOptionItemActions = () => {
  const { selectedOptionItem, deleteOption, refreshCounter } = usePageContext() as OptionItemsContextType;
  const { postRequest, loading: postLoading, postResult } = usePostAPI<OptionItem>('/api/optionItem/' + (selectedOptionItem ? selectedOptionItem.option_id : '')); // what differentiates a create from an update is the id that will be appended to the url
  const { deleteRequest, loading: deleteLoading, deleteResult } = useDeleteAPI<OptionItem>('/api/optionItem/'); // url is just base url, id is appended to the url before url request
  const optionDispatch = usePageDispatch();
  const toastDispatch = useToastDispatch();

  // for Delete of Option Item
  useEffect(() => {
    if(deleteResult) {
      let notificationMessage: MessagePrompt;
      if(deleteOption && deleteOption.option_id > 0) {
        if(deleteResult.status === 'success') {
          notificationMessage = {
            messageType: "success",
            message: "Option successfully Deleted!",
          } as MessagePrompt;
          console.log('Delete success, clearing delete object, refetching data....')
          optionDispatch({
            type: 'set_fields', 
            payload: {
              selectedItem: {},
              deleteOption: undefined,
              refreshCounter: refreshCounter + 1
            } as Partial<OptionItemsContextType> 
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
          optionDispatch({
            type: 'set_fields', 
            payload: {
              selectedOptionItems: {} as OptionItem,
              formToggle: false,
              refreshCounter: refreshCounter + 1
            } as Partial<OptionItemsContextType> 
          });
        } else {        
          notificationMessage = {
            messageType: "error",
            message: "Failed to delete Option Item!",
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

  // for the Create new and Update Option Items
  useEffect(() => {
    if(postResult) {
      let action = (!isEmpty(selectedOptionItem) && selectedOptionItem.item_id) ? 'Updated' : 'Created';
      
      let toastMessage: MessagePrompt;
      if(postResult.status === 'success') {
        toastMessage = {
          messageType: "success",
          message: "Option Item successfully " + action + "!",
        };
        optionDispatch({
          type: 'set_fields', 
          payload: {
            selectedOptionItems: {} as OptionItem,
            formToggle: false,
            refreshCounter: refreshCounter + 1
          } as Partial<OptionItemsContextType> 
        });
      } else {        
        toastMessage = {
          messageType: "error",
          message: "Failed to " + action + " Option Item!",
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

  const postAction = (optionItem: OptionItem) => {
    postRequest(optionItem);
  }

  const deleteAction = (item_id: number, url?: string) => {
    deleteRequest(item_id, url);
  }

  return {postAction, postLoading, deleteAction, deleteLoading};
}

export default useOptionItemActions;