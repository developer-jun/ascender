import React, { useCallback } from "react";
import { useState } from "react";
import { Tag } from "@/types/tag";
import { usePageContext, usePageDispatch } from '@/admin/contexts/tag';
import TagItem from "./tag-item";
import ItemModal from "./item-modal";

const fetchUrl = '/api/tags/';
const TagList = () => {
  // custom hooks
  const { items, selectedItem, refreshCounter } = usePageContext();
  const pageDispatch = usePageDispatch();  
  //const toastDispatch = useToastDispatch();

  // local variables  
  const totalItems = items.length;
  const [ deleteSelect, setDeleteSelect ] = useState<Tag | null>(null);  

  const handleOnDeleteSelection = useCallback((deleteSelected: Tag) => {
    setDeleteSelect(deleteSelected);
    // if our form has a selected item to be edited, check if the current item to be deleted is the same, if so must remove it to avoid bug
    if(deleteSelected.tag_id === selectedItem?.tag_id) {
      pageDispatch({ 
        type: 'set_field',  
        payload: {
          fieldName: 'selectedItem',
          data: null 
        }
      });
    }
  }, []);
  
  const handleOnItemSelect = useCallback((item: Tag) => {
    // setSelectedCategory(item);
    console.log('handleOnItemSelect', item);
    // if our form has a selected item to be edited, check if the current item to be deleted is the same, if so must remove it to avoid bug
    if(item.tag_id === selectedItem?.tag_id) {
      pageDispatch({
        type: 'set_field', 
        payload: {
          fieldName: 'selectedItem', 
          data: null
        }
      });
      setDeleteSelect(null);
    } else {      
      pageDispatch({
        type: 'set_field', 
        payload: {
          fieldName: 'selectedItem', 
          data: item
        }
      });      
    }
  }, [pageDispatch]);

  return (
    <div id="category-list" className="p-5">      
      Total Tags: {totalItems ? totalItems : 0}
      <br/>
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>Tag Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {items.length ? (
            items.map(item => (
              <React.Fragment key={item.tag_id}>
                <TagItem 
                  handleOnDeleteAttempt={handleOnDeleteSelection} 
                  onItemSelect={handleOnItemSelect} 
                  item={item} 
                /> 
              </React.Fragment>
            ))
          ) : null}
        </tbody>
      </table>
      {deleteSelect !== null 
        ? <ItemModal item={deleteSelect} onClose={() => setDeleteSelect(null)} />
        : null
      }      
    </div>
  )
}

export default TagList;