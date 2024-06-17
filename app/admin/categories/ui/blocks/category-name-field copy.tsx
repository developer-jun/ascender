import { useCategoryForm } from "@/app/admin/contexts/categoryFormcontext";

const CategoryNameField = () => {
  const { hasSlugManuallyChanged, useForm: { register, formState: { errors }, setValue }} = useCategoryForm();
  //const dispatch = useCategoryFormDispatch();

  const handleOnChange = (value, fieldName) => {
    let payload = {[fieldName]: value}
    if(!hasSlugManuallyChanged) {
      payload = {
        ...payload,
        slug: (typeof value === 'string' ? value.replace(/\s+/g, '-').toLowerCase() : value),
      }
      setValue('slug', typeof value === 'string' ? value.replace(/\s+/g, '-').toLowerCase() : value);
    }
    //dispatch({
    //  type: 'set_fields',      
    //  payload: payload     
    //});
  }

  return (
    <>
      <div className="field-row">
        <label className="label">
          <span className="label-text">Category Name</span>
        </label>
        <input 
          type="text" 
          placeholder="category name"          
          {...register('name', {
            onChange: e=>handleOnChange(e.target.value, 'name')
          })}
          />
        {errors.name && <span className="text-sm text-rose-500">{errors.name.message}</span>}      
      </div>
    </>
  );
}


export default CategoryNameField;