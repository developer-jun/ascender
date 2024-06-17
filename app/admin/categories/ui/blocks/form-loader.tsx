// import { useCategoryForm } from "@/app/admin/contexts/categoryFormcontext";
import Loader from "@/components/loader";
import { useFormContext } from "react-hook-form";

const FormLoader = () => {
  // const { isProcessing } = useCategoryForm();
  const { isProcessing } = useFormContext()
  //let isProcessing = false;
  return (
    <>
      {isProcessing && <div className="form-overlay z-100">
        <Loader />
      </div>}
    </>
  );
}

export default FormLoader;