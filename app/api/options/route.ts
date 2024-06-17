import { NextResponse, NextRequest } from 'next/server'
// import { create, update, deleteCategory, getCategories, Category } from '@/lib/category'
import { create, update } from '@/lib/option'
import { Option } from '@/types/option';
import { FieldValidation, JSONResult, MessagePrompt } from '@/types/common';
import { getOption, getOptions } from '@/lib/option';

export async function GET(request: NextRequest) {
  let fetchResult: JSONResult<Option[]>;
  //const body = await request.json();
  console.log('SERVER OPTION GET');
  //console.log(body);

  const options = await getOptions();

  console.log(options);
  if(options && options.error) {
    console.log('FOUND AN ERROR');
    console.log(options.error);
    fetchResult = {
      status: 'failed', 
      prompt: { 
        messageType: 'error', 
        message: options.error
      }
    }
    
    return new NextResponse(JSON.stringify(fetchResult), {
      status: 500,
      statusText: 'Database Error',
      headers: {
          'Content-Type': 'application/json'
      }});
  } else {
    // console.log('NO ERROR FOUND CATEGORIES SUCCESSFULLY RETRIEVED!');
    console.log('CATEGORIES SUCCESSFULLY RETRIEVED!');
    fetchResult = { status: 'success', data: options };
    return new NextResponse(JSON.stringify(fetchResult));
  }
}
export async function POST(request: NextRequest) {
  const body = await request.json();

  console.log('POSTED TO THE SERVER');
  console.log(body);
  let postResult: JSONResult<Option>;
  let validations: FieldValidation[] = [];
  if(body.option_name === '') {
    validations.push({field: 'option_name', message: 'Option Name cannot be empty!'});
  }
  if(body.option_description === '') {
    validations.push({field: 'option_description', message: 'Option Description cannot be empty!'});
  }
 
  if(validations.length === 0) {
    // manually construct the options object using the parsed data from the body
    let result = {};
    if(body.id) {
      // update
      result = await update({
        option_id: body.id,
        option_name: body.option_name,
        option_description: body.option_description,
      } as Option);
    } else {
      // create
      result = await create({
        option_name: body.option_name,
        option_description: body.option_description,
      } as Option);
    }

    if(typeof result === 'string') {
      postResult = { status: 'failed', message: { messageType: 'error', message: result } as MessagePrompt }
    } else {
      postResult = { status: 'success', data: result}
    }
  } else {
    postResult = {
      status: 'validationError', 
      fields: validations
    }
  }
  console.log('Result from lib ', postResult);
  return new Response(JSON.stringify(postResult));  
}

/*
export asOption
  console.log('GET function')
  const categories = await getCategories();
  let responseData;

  if(categories.error) {
    console.log('FOUND AN ERROR');
    console.log(categories.error);
    responseData = {status: 'NOK', action: 'GETALL', message: 'Retrieval of Categories Failed!', errorDetails: categories.error}
    return new NextResponse(JSON.stringify({message: 'Retrieval of Categories Failed!', errorDetails: categories.error}), {
      status: 500,
      statusText: 'Database Error',
      headers: {
          'Content-Type': 'application/json'
      }});
  } else {
    console.log('NO ERROR FOUND CATEGORIES SUCCESSFULLY RETRIEVED!');
    return new NextResponse(JSON.stringify(categories));
  }

}
*/


/*
export async function DELETE(request: Request) {
  console.log('POSTED TO THE SERVER');
  const reqBody = await request.json();
  let responseData;

  console.log(reqBody);

  if(reqBody.id > 0) {
    console.log('Calling delete LIB');
    const updatedCategory = await deleteCategory(reqBody.id);
    console.log('DELETE DONE');
    console.log(updatedCategory);
    if(updatedCategory.error) {
      console.log(updatedCategory.error);
      responseData = {status: 'NOK', action: 'DELETE', message: 'Category DELETE Failed!', errorDetails: updatedCategory.error}
    } else 
      responseData = {status: 'OK', action: 'DELETE', message: 'Category successfully DELETED.', category: updatedCategory}
    
  }   
  
  return new Response(JSON.stringify(responseData));
}
*/
function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}