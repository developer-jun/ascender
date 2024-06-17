import React, { useRef, useState } from "react";
import { UploadButton } from "@/utils/uploadthing";

type FormUploadImageProps = {
  useForm: any, 
  name: string,
  className: string,
}
const FormUploadImage = ({ useForm, name, className }: FormUploadImageProps) => {
  const hiddenInputRef = useRef();
  const { register, setValue } = useForm;
  const { ref: registerRef, ...rest } = register(name);
  const [ imagePreview, setImagePreview ] = useState('https://placehold.co/400x300');

  const handleUploadedFile = (event) => {
    console.log('ON Upload: ', event.target.files[0]);
    //const file = event.target.files[0];

    //const urlImage = URL.createObjectURL(file);

    //setImagePreview(urlImage);
  };

  const onUpload = () => {
    hiddenInputRef.current.click();
  };
  const onUploadComplete = (res) => {    
    console.log("Files: ", res);
    
    // if possible, keep track of the images that has been uploaded to the server
    // that way, we can delete it if it's not used anymore
    // reason is because we are using third party free tier server
    // space is limited to 1 gig only
    
    if(res?.length) {
      //const urlImage = URL.createObjectURL(res[0].fileUrl);
      setImagePreview(res[0].url);
      console.log('imagepreview: ', res[0].url);

      setValue('imageUrl', res[0].url, { shouldValidate: true })
    }
      /*dispatch({
        type: ACTIONS.UPDATE_PRODUCT_FIELD,                       
        payload: {
          value: res[0].fileUrl,
          fieldName: 'prodImage'
        }
      });*/
      //setProdImage(res[0].fileUrl);
    
  };

  const uploadButtonLabel = imagePreview ? "Change image" : "Upload image";

  return (
    <div className={className}>
      <input
        type="file"
        className="hidden"
        name={name}
        {...rest}
        onChange={handleUploadedFile}
        ref={(e) => {
          registerRef(e);
          hiddenInputRef.current = e;
        }}
      />
      {/* Preview */}
      <div className="avatar">
        <div className="w-24 rounded">
          <img src={imagePreview} />
        </div>
      </div>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => onUploadComplete(res)}
        onUploadError={(error: Error) => {
          console.log('UPLOADTHING error: ', error);
        }}
      />
    </div>
  );
};

export default FormUploadImage;
