import { NextResponse, NextRequest } from 'next/server'
import { update, deleteItem } from '@/lib/tag'
import { JSONResult } from '@/types/common';
import { Tag } from '@/types/tag';

// { params } is needed when we are inside a [id] dynamic path directory, that where we get the dynamic directory 
export async function POST(request: NextRequest, { params }: {params: unknown}) {
  let fetchResult: JSONResult<Tag | null>;
  const body = await request.json();
  const itemId: number = parseInt(params.id) // '1'
  console.log('POSTED TO THE SERVER');
  console.log(body);
  
  const itemData: Tag = {
    name: body.name,
    description: body.description,
  }
  if(itemId > 0) {
    console.log('Calling Update LIB');
    console.log(itemData);
    const updatedItem = await update(itemId, itemData);
    console.log('Update DONE');
    console.log(updatedItem);
    if(updatedItem.error) {
      console.log(updatedItem.error);
      
      fetchResult = {
        status: 'failed', 
        prompt: { 
          messageType: 'error', 
          message: updatedItem.error
        }
      }
      
      return new NextResponse(JSON.stringify(fetchResult), {
        status: 500,
        statusText: 'Database Error',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      fetchResult = { 
        status: 'success', 
        data: updatedItem as Tag 
      };            
    }    
  } else {
    fetchResult = {
      status: 'validationError', 
      fields: [{field: 'id', message: 'ID was not found!'}]
    }
  }

  return new NextResponse(JSON.stringify(fetchResult));
}

export async function DELETE(request: Request, { params }) {
  let deleteResult: JSONResult<any>;
  console.log("ARRIVED AT SERVER API");
  console.log(request);
  const itemId: number = parseInt(params.id) // '1'
  console.log(params);
  
  try {
    // forced the data paring into defined database table fields
    const deletedCategory = await deleteItem(itemId);
    console.log('DELETE DONE');
    console.log(deletedCategory);
    deleteResult = { status: 'success', data: null }
    // return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    deleteResult = { status: 'failed', prompt: { messageType: 'error', message: error?.message}  }
  }

  return new Response(JSON.stringify(deleteResult));
}

export async function GET(request: Request, { params }) {
  //console.log('params: ', params);
  //console.log('GET function of Category ID');  
  //console.log(params);
  //console.log('RETRIEVE CATEGORY from database');

  const categoryId = parseInt(params.id) // '1'
  const categories = await getCategories(categoryId);

  if(categories && 'error' in categories) {
    return new NextResponse(JSON.stringify({message: 'Retrieval of Categories Failed!', errorDetails: categories.error}), {
      status: 500,
      statusText: 'Database Error',
      headers: {
          'Content-Type': 'application/json'
      }
    });
  } 

  return new NextResponse(JSON.stringify(categories));    

  /*const categories = await getCategories();
  let responseData;

  if(categories && categories.error) {
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
    // console.log('NO ERROR FOUND CATEGORIES SUCCESSFULLY RETRIEVED!');
    return new NextResponse(JSON.stringify(categories));
  }*/
}

/*export async function DELETE(request: Request) {
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
}*/