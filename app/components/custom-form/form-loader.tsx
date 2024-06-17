import Loader from "@/components/loader";
import { useFormContext } from "./form-context";

const FormLoader = () => {
  const { state: { isProcessing } } = useFormContext();
  return (
    <>
      {isProcessing ? 
        <div className="form-overlay">
          <Loader />
        </div>
      : null}
    </>
  );
}

export default FormLoader;