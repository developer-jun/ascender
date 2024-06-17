import { NextResponse, NextRequest } from 'next/server'
import { createUser } from '@/lib/user'
import { User } from '@/types/userTypes';
import { JSONResult, FieldValidation, MessagePrompt } from '@/types/common';
import { isEmail } from '@/utils/helpers';
import { saltAndHashPassword } from '@/utils/security';
import bcrypt from 'bcrypt';

export async function GET(request: NextRequest) {
  console.log('GET function')

}

export async function POST(request: NextRequest) {  
  let postResult: JSONResult<User>;
  let validations:FieldValidation[] = [];
  
  const body = await request.json();
  // ADDING SERVER VALIDATION is a must  
  if(!body.user_name) {
    validations.push({
      field: 'user_name',
      message: 'Name is Required!'
    });
  }
  if(!isEmail(body.user_email)) {
    validations.push({
      field: 'user_email', 
      message: 'Email is Invalid' 
    });
  }
  if(!body.user_password || body.user_password.length < 3) {
    validations.push({
      field: 'user_password', 
      message: 'Password is Invalid' 
    });
  } else {
    if(body.user_password != body.user_confirm_password) {
      validations.push({
        field: 'user_confirm_password', 
        message: 'Password confirmation did not match' 
      });
    }
  } 
 
  console.log(validations);
  // passed the validations
  if(validations.length === 0) {
    console.log('body data: ', body);
    
    let hashedPass = '';
    const saltRounds = 10; // Number of salt rounds (higher is more secure)

    try {
      console.log('Hashing password... ', body.user_password);

      const hash = await bcrypt.hash(body.user_password, saltRounds);
      const userData: User = {
        name: body.user_name,
        email: body.user_email,
        type: 'member',
        password: hash,
      }

      const createResult = await createUser(userData);
      console.log('CREATE results: ', createResult);
      if(createResult && typeof createResult === 'object') {
        postResult = {
          status: 'success',
          data: createResult as User
        }           
      } else {
        postResult = {
          status: 'failed', 
          prompt: { messageType: 'error', message: createResult } as MessagePrompt
        } 
      }
      return new Response(JSON.stringify(postResult));
    } catch (error) {
      
    }   
     
  } else {
    postResult = {
      status: 'validationError', 
      fields: validations
    }
    return new Response(JSON.stringify(postResult));
  }
  
}




function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}