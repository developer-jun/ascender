import { NextResponse, NextRequest } from 'next/server'
import { create, update, deleteCategory, getCategories } from '@/lib/category'
import { Category } from "@/types/category";
import { FieldValidation, JSONResult, MessagePrompt } from '@/types/common';

export async function GET(request: NextRequest) {
  let fetchResult: JSONResult<Category[]>;
  console.log('GET function')
  const categories = await getCategories(0);
  let responseData;
  console.log(categories);
  if(categories && categories.error) {
    console.log('FOUND AN ERROR');
    console.log(categories.error);
    fetchResult = {
      status: 'failed', 
      prompt: { 
        messageType: 'error', 
        message: categories.error
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
    fetchResult = { status: 'success', data: categories };
    return new NextResponse(JSON.stringify(fetchResult));
  }

}

export async function POST(request: NextRequest) {
  const body = await request.json();
  let postResult: JSONResult<Category>;
  let validations:FieldValidation[] = [];

  console.log('POSTED TO THE SERVER');
  console.log(body);
  
  const categoryData: Category = {
    name: body.name,
    slug: body.slug,
    description: body.description,
    parent: parseInt(body.parent),
    count: 0
  }
  
  // simple validation to avoid empty fields
  if(categoryData.name === '') {
    validations.push({field: 'name', message: 'Category Name cannot be empty!'});
  }
  if(categoryData.slug === '') {
    validations.push({field: 'slug', message: 'Category Slug cannot be empty!'});
  }
  if(categoryData.description === '') {
    validations.push({field: 'description', message: 'Category Description cannot be empty!'});
  }

  if(validations.length === 0) {
    if(body.id > 0) {
      const updatedCategory = await update(body.id, categoryData);
      if(typeof updatedCategory === 'string') {
        postResult = { status: 'failed', prompt: { messageType: 'error', message: updatedCategory } as MessagePrompt }
      } else {
        postResult = { status: 'success', data: updatedCategory}
      }      
    } else {
      const newCategory = await create(categoryData);
      if(typeof newCategory === 'string') {
        postResult = { status: 'failed', prompt: { messageType: 'error', message: newCategory }};
      } else {
        postResult = { status: 'success', data: newCategory}
      }
    }  
  } else {
    postResult = {
      status: 'validationError', 
      fields: validations
    } 
  }
  
  return new Response(JSON.stringify(postResult));
}

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