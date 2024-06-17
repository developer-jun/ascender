'use server';

import { signIn } from '../../auth';
import { AuthError } from 'next-auth';
 
// ...
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  console.log('THE authenticate() function is called');
  console.log(formData);
  try {
    const response = await signIn('credentials', formData);

    /*if(!!response.error) {
      setModal(true);
      setErrorMessage("Incorrect Username or Password");
      console.log(response.error);
    }*/
   return 'success';   
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}