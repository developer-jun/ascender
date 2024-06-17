"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { MessagePrompt } from "@/types/common"
import { useForm, FieldError, UseFormRegister } from "react-hook-form"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input" 
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { User } from "@/types/userTypes"
import usePostAPI from "@/hooks/usePostAPI"

import '../styles.css';


export const metadata = {
  title: 'User Registration',
  description: '',
}
-

type FormData = {
  name: string;
  email: string;  
  password: string;
  confirmPassword: string;
};

export type FormFieldProps = {
  type: string;
  placeholder: string;
  name: ValidFieldNames;
  register: UseFormRegister<FormData>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
};

export type ValidFieldNames =
  | "name"
  | "email"  
  | "password"
  | "confirmPassword";

  const UserSchema: z.ZodType<FormData> = z.object({
    name: z.string().min(1, {
      message: "Name is required.",
    }),
    email: z.string().email({
      message: "Email is invalid",
    }),
    password: z.string().min(4, {
      message: "Password must be at least 4 characters.",
    }),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords did not match!",
    path: ["confirmPassword"],
  });

  /*export const UserSchema: z.ZodType<FormData> = z.object({
    name: z
      .string()
      .min(1, { message: "Name is Required" }), 
    email: z.string().email(),       
    password: z
      .string()
      .min(8, { message: "Password is too short" })
      .max(20, { message: "Password is too long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // path of error
  });*/

/*.superRefine((arg: { cpassword, password }, ctx) => {
  console.log(arg.cpassword + ' = ' + arg.password);
  if (arg.cpassword !== arg.password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "The passwords did not match",
      fatal: true
    });
  }
});*/
export default function Register() {
  const { data, loading, postRequest } = usePostAPI<User>('/api/user/register');
  const [ results, setResults ] = useState<MessagePrompt | null>(null);
  
  // Form Validation Rules
  

  // 1. Define your form.
  /*const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      cpassword: "",
    },
  })*/
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(UserSchema), // Apply the zodResolver
  });
  
  useEffect(() => {
    if(data) {
      if(typeof data === 'object') {
        setResults({
          message: 'Registration Successful',
          messageType: 'success'
        } as MessagePrompt);
        form.reset({
          fullname: "",
          email: "",
          password: "",
          cpassword: "",
        });
      } else {
        setResults({
          message: data,
          messageType: 'error'
        } as MessagePrompt);
      }
    }
      
  }, [data]);
  // 2. Define a submit handler.
  //async function onSubmit(values: z.infer<typeof formSchema>) {
  const onSubmit = async (data: FormData) => {/*values: z.infer<typeof formSchema>*/
    console.log("SUCCESS", data);  
    // console.log('ONSUBMIT: ', data);
    //const parseData = formSchema.parse(formSchema);
    //console.log('ONSUBMIT: ', parseData);    
    /*postRequest({
      name: values.fullname, 
      email: values.email, 
      password: values.password,
      cpassword: values.cpassword, 
      type: 'member'
    });*/
    console.log('onSubmit');
    return false;
  }

  return (
    <>
      <main className="flex w-full min-h-screen flex-col items-center p-24">
        <div className="relative flex flex-col place-items-center custom-form p-10 rounded-md bg-slate-900 shadow-xl shadow-slate-950">
          <h2>Register Form</h2>
          {results 
            && <p className={`w-full text-center m-2 p-2 rounded-md ${results.messageType === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {results.message}</p>}
             {/** form.handleSubmit(onSubmit) */}        
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full space-y-4">
            
            <FormField2
              type="text"
              placeholder="name"
              name="name"
              register={register}
              error={errors.name}
            />

            <FormField2
              type="email"
              placeholder="Email"
              name="email"
              register={register}
              error={errors.email}
            />            

           
            <FormField2
              type="password"
              placeholder="Password"
              name="password"
              register={register}
              error={errors.password}
            />

            <FormField2
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              register={register}
              error={errors.confirmPassword}
            />
            <button type="submit" className="submit-button">
              Submit
            </button>
              <div className="flex items-center justify-between">
                <Button type="submit" className="rounded-md mt-2 bg-teal-800 hover:bg-teal-700 hover:text-white">
                  {loading 
                    ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="animate-spin mr-2 w-4 h-4">
                        <path fillRule="evenodd" d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.932.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-1.242l.842.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.241l-.84-.84v1.371a.75.75 0 0 1-1.5 0V9.591a.75.75 0 0 1 .75-.75H5.35a.75.75 0 0 1 0 1.5H3.98l.841.841a4.5 4.5 0 0 0 7.08-.932.75.75 0 0 1 1.025-.273Z" clipRule="evenodd" />
                      </svg>                  
                    : ''} Register</Button>
                <a href="/user/login" className="register-link hover:text-white">Login</a>
              </div>
            </form>
          
        </div>
      </main>
    </>
  );
}

export const FormField2: React.FC<FormFieldProps> = ({
  type,
  placeholder,
  name,
  register,
  error,
  valueAsNumber,
}) => (
  <>
    <input
      type={type}
      placeholder={placeholder}
      {...register(name, { valueAsNumber })}
    />
    {error && <span className="error-message">{error.message}</span>}
  </>
);
