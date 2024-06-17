import { useCategoryForm, useCategoryFormDispatch } from "@/app/admin/contexts/categoryFormcontext";

const CategoryDescriptionField = () => {
  const { description, useForm: { register, formState: { errors } } } = useCategoryForm();
  const { ref } = register('firstName');
  //const dispatch = useCategoryFormDispatch();
  // 
  return (
    <>
      <div className="field-row">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea 
          placeholder="description"          
          {...register('description', {
            //onChange: (e)=>dispatch({ type: 'set_field', payload: {fieldName: 'description', data: e.target.value} })
          })} 
          />
        {errors.description && <span className="text-sm text-rose-500">{errors.description.message}</span>}      
      </div>
    </>
  );
}

export default CategoryDescriptionField;