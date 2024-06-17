import { NextResponse, NextRequest } from 'next/server'
import { create, update, deleteItem, getItems } from '@/lib/tag'
import { Tag } from "@/types/tag";
import { FieldValidation, JSONResult, MessagePrompt } from '@/types/common';

export async function GET(request: NextRequest) {
  let fetchResult: JSONResult<Tag | null>;
  console.log('GET function')
  const items = await getItems<Tag>();
  console.log(items);
  if(items && items.error) {
    console.log('FOUND AN ERROR');
    console.log(items.error);
    fetchResult = {
      status: 'failed', 
      prompt: { 
        messageType: 'error', 
        message: items.error
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
    console.log('Tags SUCCESSFULLY RETRIEVED!');
    fetchResult = { status: 'success', data: (items ? items as Tag[]:null) };
    return new NextResponse(JSON.stringify(fetchResult));
  }

}

export async function POST(request: NextRequest) {
  const body = await request.json();
  let postResult: JSONResult<Tag>;
  let validations:FieldValidation[] = [];

  console.log('POSTED TO THE SERVER');
  console.log(body);
  
  const itemData: Tag = {
    name: body.name,
    description: body.description
  }
  
  // simple validation to avoid empty fields
  if(itemData.name === '') {
    validations.push({field: 'name', message: 'Tag Name cannot be empty!'});
  }
  if(itemData.description === '') {
    validations.push({field: 'description', message: 'Tag Description cannot be empty!'});
  }

  if(validations.length === 0) {
    if(body.id > 0) {
      const updatedItem = await update(body.id, itemData);
      if(typeof updatedItem === 'string') {
        postResult = { status: 'failed', prompt: { messageType: 'error', message: updatedItem } as MessagePrompt }
      } else {
        postResult = { status: 'success', data: updatedItem}
      }      
    } else {
      const newCategory = await create(itemData);
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

function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}