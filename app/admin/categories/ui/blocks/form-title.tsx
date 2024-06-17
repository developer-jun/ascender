//import { useCategoryForm } from "@/app/admin/contexts/categoryFormcontext";

import { memo } from "react";

const FormTitle = () => {
  //const { id } = useCategoryForm();
  let id = 0;
  return (
    <h2 className="card-title">{ id ? 'Update' : 'New' } Category</h2>
  );
}

export default memo(FormTitle);