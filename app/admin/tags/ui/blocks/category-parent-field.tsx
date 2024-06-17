import { useCategoryForm } from "@/app/admin/contexts/categoryFormcontext";
import useCategoryContext from "@/app/admin/hooks/useCategoryContext";

const CategoryParentField = () => {
  const { id, useForm: { register, formState: { errors } } } = useCategoryForm();
  const { state: { categories} } = useCategoryContext();
  //const dispatch = useCategoryFormDispatch();
  //console.log('dropdownOptions:', categories);
  
  //const handleOnChange = (value: string | number, fieldName: string) => {    
  //  dispatch({ payload: {[fieldName]: value} });
  //}
  //  onChange={e => handleOnChange(parseInt(e.target.value), 'parent')}

  return (
    <>
      <div className="field-row">
        <label className="label">
          <span className="label-text">Parent Category</span>
        </label>              
        <select name="parent" {...register('parent')}>                
          {categories && categories.map((option, index) => {
              if(option.id !== id) {
                return <option key={index} value={option.id}>{option.name}</option> 
              }
            }
          )}
        </select>
        {errors.parent && <span className="text-sm text-rose-500">{errors.parent.message}</span>}
      </div>
    </>
  );
}

export default CategoryParentField;