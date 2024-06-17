import Loader from "@/components/loader";

const PageLoader = () => {
  
  return (
    <>
      <div className="form-overlay z-100"  style={{zIndex: '9999'}}>
        <Loader />
      </div>
    </>
  );
}

export default PageLoader;