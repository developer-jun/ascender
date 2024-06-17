import React, { useCallback } from "react";
import { useState } from "react";
import { Category } from "@/types/category";
import { usePageContext, usePageDispatch } from '@/admin/contexts/category';
import CategoryItem from "./category-item";
import ItemModal from "./item-modal";
//import { useToastDispatch } from "@/components/toast-provider";


const fetchUrl = '/api/categories/';
const CategoryList = () => {
  // custom hooks
  const { items, selectedItem, refreshCounter } = usePageContext();
  const pageDispatch = usePageDispatch();  
  //const toastDispatch = useToastDispatch();

  // local variables  
  const totalCategories = items.length;
  const [ deleteSelect, setDeleteSelect ] = useState<Category | null>(null);  

  const handleOnDeleteSelection = useCallback((deleteSelected: Category) => {
    setDeleteSelect(deleteSelected);
    // if our form has a selected item to be edited, check if the current item to be deleted is the same, if so must remove it to avoid bug
    if(deleteSelected.id === selectedItem?.id) {
      pageDispatch({ 
        type: 'set_field',  
        payload: {
          fieldName: 'selectedItem',
          data: null 
        }
      });
    }
  }, []);
  
  const handleOnItemSelect = useCallback((item: Category) => {
    // setSelectedCategory(item);
    console.log('handleOnItemSelect', item);
    // if our form has a selected item to be edited, check if the current item to be deleted is the same, if so must remove it to avoid bug
    if(item.id === selectedItem?.id) {
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
  }, []);

  return (
    <div id="category-list" className="p-5">      
      Total Categories: {totalCategories ? totalCategories - 1 : 0}
      <br/>
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>Parent</th>
            <th>Category Name</th>
            <th>Description</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {items.length ? (
            items.map(item => (
              <React.Fragment key={item.id}>
                {item.parent !== null 
                  ? <CategoryItem 
                      handleOnDeleteAttempt={handleOnDeleteSelection} 
                      onItemSelect={handleOnItemSelect} 
                      item={item} 
                    /> 
                  : <></>}
              </React.Fragment>
            ))
          ) : null}
        </tbody>
      </table>
      {deleteSelect !== null 
        ? <ItemModal item={deleteSelect} onClose={() => setDeleteSelect(null)} />
        : null
      }
      {/*(resultDialog !== null)
        ? <Dialog title={resultDialog.title}>
            <Alert alert={resultDialog.prompt} iconSize={""} />
          </Dialog>
        : null


        <FormDialog title="Are you sure you want to delete this category?">
            <CategoryInfo {...selectedCategory}>
              <div className="modal-action gap-2">
                <Button 
                  className="btn btn-xs text-white" 
                  onClick={() => { 
                    confirmCategoryDelete(selectedCategory);
                  }}>Confirm</Button> 
                <Button 
                  className="btn btn-xs bg-slate-500 text-white" 
                  onClick={() => { 
                    setSelectedCategory(null);
                  }}><label htmlFor="my_modal_6">Cancel</label></Button>
              </div>
            </CategoryInfo>            
          </FormDialog>
    */}
    </div>
  )
}

export default CategoryList;