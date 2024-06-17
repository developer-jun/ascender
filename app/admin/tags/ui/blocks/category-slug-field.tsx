import { useCategoryForm, useCategoryFormDispatch } from "@/app/admin/contexts/categoryFormcontext";

const CategorySlugField = () => {
  const { slug, name, hasSlugManuallyChanged, useForm: { register, formState: { errors }, getValues, setValue } } = useCategoryForm();
  const dispatch = useCategoryFormDispatch();

  const handleOnChange = (value, fieldName) => {
    //let payload = {[fieldName]: value};
    if(!hasSlugManuallyChanged) {        
      //const slug = value.replace(/\s+/g, '-').toLowerCase(); // generate the slug based on the category name
      //payload = {
        //[fieldName]: slug,
        //['hasSlugManuallyChanged']: true
      //}    
      dispatch({
        type: 'set_field',      
        payload: {'fieldName': 'hasSlugManuallyChanged', 'data': true}
      });
    } else {      
      if(value.trim() === '') {
        dispatch({
          type: 'set_field',      
          payload: {'fieldName': 'hasSlugManuallyChanged', 'data': false}
        });
        const categoryName = getValues("name");
        if(categoryName !== '') {
          setValue('slug', typeof categoryName === 'string' ? categoryName.trim().replace(/\s+/g, '-').toLowerCase() : categoryName);
        }
        
      //  payload = { 
          //[fieldName]: name.replace(/\s+/g, '-').toLowerCase(), // slug is empty, default to what the category name has
      //    ['hasSlugManuallyChanged']: false
      //  }
      } else {
        //payload = { [fieldName]: value  }
      }      
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
          <span className="label-text">Category URL Slug</span>
        </label>
        <input 
          type="text" 
          placeholder="slug"          
          {...register('slug', {
            onChange: (e)=>handleOnChange(e.target.value, 'slug')
          })} />
        {errors.slug && <span className="text-sm text-rose-500">{errors.slug.message}</span>}      
      </div>
    </>
  );
}

export default CategorySlugField;