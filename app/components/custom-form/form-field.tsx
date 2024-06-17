import { HTMLAttributes, ReactNode, useMemo, useState } from 'react';
import { FormFieldAttribute } from "./inputs-data-types"
import { Controller, FieldValues, Path, useController } from 'react-hook-form';
import { useFormContext } from './form-context';
import { Textarea } from '@/components/textarea';
import { Input } from '@/components/input';
import { UploadButton } from '@/utils/uploadthing';
import FormFieldContext, { useFieldContext } from "./field-context";
import Select2 from '../select2';
import FormUploadImage from './form-upload-image';

//import { Controller } from 'react-hook-form';
//import { Select } from '@/components/select';

//import { Button } from '@/components/button';
//import { Loader } from "@/components/loader";

// This is the structure of our Custom Form Field and will be followed by all
type FormFieldProps<T extends FieldValues> = {
  inputData: FormFieldAttribute<T>;
  label?: ReactNode;
  field?: ReactNode;  
  error?: ReactNode;
  children?: ReactNode; 
}

const FormField = <T extends FieldValues>({ inputData, label, field, error, children }: FormFieldProps<T>) => {  
  const contextValues = useMemo(() => inputData, [inputData]); // all attributes that are related to the form field only
  return (
    <FormFieldContext.Provider value={ contextValues }>
      <label className="form-control w-full">
        {label}
        {field}
        {error}
        {children}
      </label>             
    </FormFieldContext.Provider>
  );
}

// THE COMPONENTS BELOWS ARE WHAT COMPOSED THE CUSTOM FIELD above
const InputField = () => {
  const { type, placeholder, name, callback, step } = useFieldContext(); // field attributes
  const { state: {useForm: { register }} } = useFormContext();

  return (
    <>
      <input 
        className="h-10 w-full rounded-md px-3 py-2 text-sm bg-zinc-200 text-zinc-700"
        type={type}
        placeholder={placeholder}
        id={name}
        {...(type === 'number' ? {step} : {})}
        {...register((name as unknown) as Path<FieldValues>,          
          {
            onChange: (e)=>{
              if(callback) {
                callback(e.target.value, name);
                console.log('onchange triggered for '+name+ ': ', e.target.value)
              }            
            },
            valueAsNumber: (type === 'number' && step) ? true : false 
          },          
        )} 
        />
    </>
  )
}

const TextareaField = () => {
  const { placeholder, name } = useFieldContext();
  const { state: { useForm: { register }} } = useFormContext();
  return (
    <>
      <Textarea 
        className="h-20 w-full rounded-md px-3 py-2 text-sm bg-zinc-200 text-zinc-700"
        placeholder={placeholder}
        id={name}
        {...register((name as unknown) as Path<FieldValues>)} 
      ></Textarea>
    </>
  )
}

const SelectField: React.FC<HTMLAttributes<HTMLSelectElement>> = ({ className, ...restProps }) => {
  const { name, options, value } = useFieldContext();
  const { state: {useForm: { control }} } = useFormContext();
  const { field } = useController({
    name,
    control,
    defaultValue: value,
  });
  // console.log('options: ', options);
  return (
    <>
      <Controller        
        control={control}
        name={name}
        defaultValue={value}
        render={
          ({ field }) => <Select2 {...field}>
            {options && options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select2>
        }
      />      
    </>
  )
}
/*
const SelectField: React.FC<HTMLAttributes<HTMLSelectElement>> = ({ className, ...restProps }) => {
  const { state: {useForm: { register, control }} } = useFormContext();
  const { name, options, value } = useFieldContext();
  const { field } = useController({
    name,
    control,
    defaultValue: value,
  });

  return (
    <>
      <Select2 {...register(name, { value: value })} {...restProps}>
        {options && options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select2>
            
    </>
  )
}*/

const HiddenField = () => {
  const { type, placeholder, name, callback } = useFieldContext(); // field attributes
  const { state: {useForm: { register, formState: { errors,  } }} } = useFormContext();

  return (
    <>
      <Input 
        className="h-10 w-full rounded-md px-3 py-2 text-sm bg-zinc-200 text-zinc-700"
        type={type}
        placeholder={placeholder}
        id={name}
        {...register((name as unknown) as Path<FieldValues>,{
          onChange: (e)=>{
            if(callback) {
              callback(e.target.value, name);
              console.log('onchange triggered for '+name+ ': ', e.target.value)
            }            
          }
        })} 
        />
    </>
  )
}

const ImageUploadField2 = () => {
  const { name, callback } = useFieldContext(); // field attributes
  const { state: {useForm} } = useFormContext();
  //console.log(errors);
  //console.log('callback['+name+']: ', callback);
  return (
    <>
      <FormUploadImage 
        useForm={useForm} 
        name={name}
        className="w-full rounded-md px-3 py-2 text-sm bg-zinc-200 text-zinc-700"
        />
    </>
  )
}

const PREVIEW_IMAGE = 'https://placehold.co/400x300';
const ImageUploadField = () => {
  const { name, callback } = useFieldContext(); // field attributes
  const { state: {useForm: { register, setValue, getValues} }} = useFormContext();
  const [ imagePreview, setImagePreview ] = useState(PREVIEW_IMAGE);
  //console.log(errors);
  //console.log('callback['+name+']: ', callback);
  const imageField = getValues('imageUrl');
  if(imageField === 'reset' && imagePreview !== PREVIEW_IMAGE) {
    setImagePreview(PREVIEW_IMAGE);
    setValue('imageUrl', '');
    console.log('Image Preview has changed: ', imagePreview);
  } else if(imageField !== '' && imageField !== imagePreview) {
    // for default value
    setImagePreview(imageField);
  }
  console.log('imageField value: ', imageField);

  return (
    <>      
      <input
        type="text"
        className='hidden'
        {...register('imageUrl')} // Make sure this input is registered
        placeholder="Image URL"
      />
      <div className="avatar">
        <div className="w-24 rounded">
          <img src={imagePreview} />
        </div>
      </div>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if(res?.length) {
            //const urlImage = URL.createObjectURL(res[0].fileUrl);
            setImagePreview(res[0].url);
            console.log('imagepreview: ', res[0].url);
            if(callback) {
              callback(res[0].url, name);
              console.log('calling triggered for ' + name +  ': ', res[0].url)
            }   
            // setValue(name, res[0].url, { shouldValidate: true })
          }
        }}
        onUploadError={(error: Error) => {
          console.log('UPLOADTHING error: ', error);
        }}
      />      
    </>
  )
}



/*const FieldLabel = ({children}: {children: ReactNode}) => {
  const { name, label } = useFieldContext();
  return (
    <>
      <label className=" mt-2 text-sm font-medium" htmlFor={name}>{label}</label>    
    </>
  )
}*/
const Label = () => {
  const { label } = useFieldContext();
  return (
    <div className="label">
      <span className="label-text">{label}</span>
    </div>
  )
}
              
const Error = () => {
  const { name } = useFieldContext();
  const { state: {useForm: { formState: { errors,  } }} } = useFormContext();

  if(errors && errors[name]) {
    return (
      <div className="label justify-end">
        <span key={name} className="label-text-alt text-rose-500">{errors[name].message}</span>
      </div>
    )
  } else {
    return null;
  }  
}

FormField.Input = InputField;
FormField.Select = SelectField;
FormField.Textarea = TextareaField;
FormField.ImageUpload = ImageUploadField;
FormField.Label = Label;
FormField.Error = Error;

export default FormField;