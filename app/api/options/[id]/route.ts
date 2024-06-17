import { NextResponse, NextRequest } from 'next/server'
import { deleteOption, update } from '@/lib/option'
import { FieldValidation, JSONResult, MessagePrompt } from '@/types/common';
import { OptionItem, Option } from "@/types/option";

// { params } is needed when we are inside a [id] dynamic path directory, that where we get the dynamic directory 
export async function POST(request: NextRequest) {
  const body = await request.json();

  console.log('POSTED TO THE SERVER');
  console.log(body);
  let postResult: JSONResult<OptionItem>;
  let validations:FieldValidation[] = [];
  if(body.option_name === '') {
    validations.push({field: 'option_name', message: 'Option Name cannot be empty!'});
  }
  if(body.option_description === '') {
    validations.push({field: 'option_description', message: 'Option Description cannot be empty!'});
  }
 
  if(validations.length === 0) {
    // manually construct the options object using the parsed data from the body
    let result = {};
    if(body.item_id > 0) {
      console.log('UPDATING');
      // update
      result = await update(body.item_id, {
        item_name: body.item_name,
        option_id: body.option_id,
      } as OptionItem);
    } else {
      console.log('CREATING NEW ITEM');
      // create
      result = await create({
        item_name: body.item_name,
        option_id: body.option_id,
      } as OptionItem);
    }

    if(typeof result === 'string') {
      postResult = { status: 'failed', prompt: { messageType: 'error', message: result } as MessagePrompt }
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

export async function DELETE(request: Request, { params }) {
  let deleteResult: JSONResult<Option>;
  console.log("DELETE SERVER API");
  console.log(request);
  const optionId: number = parseInt(params.id) // '1'
  console.log(params);
  
  try {
    // forced the data paring into defined database table fields
    const deletedOption = await deleteOption(optionId);
    console.log('DELETE DONE');
    console.log(deletedOption);
    deleteResult = { status: 'success', data: deletedOption }
    // return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    deleteResult = { status: 'failed', prompt: { messageType: 'error', message: error?.message } as MessagePrompt }
  }

  return new Response(JSON.stringify(deleteResult));
}

/*
export async function GET(request: Request, { params }) {
  //console.log('params: ', params);
  //console.log('GET function of Category ID');  
  //console.log(params);
  //console.log('RETRIEVE CATEGORY from database');

  const optionItemId = parseInt(params.id) // '1'
  const optionItems = await getCategories(optionItemId);

  if(optionItems && 'error' in categories) {
    return new NextResponse(JSON.stringify({message: 'Retrieval of Categories Failed!', errorDetails: categories.error}), {
      status: 500,
      statusText: 'Database Error',
      headers: {
          'Content-Type': 'application/json'
      }
    });
  } 

  return new NextResponse(JSON.stringify(categories));
}
*/