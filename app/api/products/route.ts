// PATH: /admin/product (add new product)
// by default, it will be posted to the database but unpublished
// this is to give way to image upload which needed form submission

import { NextResponse, NextRequest } from 'next/server'
// import { create, update, deleteCategory, getCategories, Category } from '@/lib/category'
import { create, queryProductsRelationship } from "@/lib/product"
import { createProductCategory } from "@/lib/productCategory";
import { safeBooleanData, safeData } from '@/utils/helpers';
import { Product, StockStatuses } from '@/types/product';
import { FieldValidation, JSONResult, MessagePrompt } from '@/types/common';

interface OrderBy {
  [key: string]: string;
}

export async function GET(request: NextRequest) {
  console.log('SERVER GET');
  let { searchParams } = new URL(request.url);  
  let take = searchParams.get('take');
  let itemsPerPage = take ? parseInt(take) : 5;
  let skipRaw = searchParams.get('skip');  
  let skip = (skipRaw) ? parseInt(skipRaw) : 0;
  let sortBy: string | null = searchParams.get('sortBy') ? searchParams.get('sortBy') : null;
  let order = searchParams.get('order');
  let keyword = searchParams.get('search');
  let category = searchParams.get('category');
  let currentPage = searchParams.get('currentPage');  

  console.log('SortBy: ', sortBy);
  console.log('order: ', order);

  let productIdRaw = searchParams.get('id');
  
  let whereObjects = {};

  
  // check if productId is a valid number or undefined
  if(productIdRaw) {
    let productId = parseInt(productIdRaw);
    // GET SINGLE PRODUCT
    whereObjects = {    
      where: {
        id: productId,
      }
    }
  } else {
    // GET MULTIPLE PRODUCTS
  


    // BUILD THE QUERY AND USE THE API Data collected
    
    // Starts with where
    //  if search is present, then it's keyword search
    /*const where = {    
      OR: [
        { name: { contains: keyword } },
        { description: { contains: keyword } },
      ],
      AND: { category: categoryid},
      AND: { isPublished = isPublished }
    }*/

    let keywordWhere = {};
    if(keyword && keyword.trim() !== '') {
      keywordWhere = {
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
        ]
      }
    }

    let categoryWhere = {};
    if(category && parseInt(category) > 0) {
      categoryWhere = {
        productcategory: {
          some: {
            category_id: parseInt(category)
          }
        }
      }
    }

    let sortByObject = { 
      orderBy: {
        id: 'asc',
      } as OrderBy
    };
    if(sortBy && sortBy !== 'category') {
      sortByObject = {
        orderBy: {
          [sortBy]: order,
        } as OrderBy
      }
    } else if(sortBy === 'category') {
      sortByObject = {
        orderBy: {
          id: 'asc',
        } as OrderBy
      }
      // retrieve all and we'll manage the filtering afterwards
      itemsPerPage = 0;
      skip = 0;
    }

    whereObjects = {    
      where: {
        ...keywordWhere,
        ...categoryWhere,
      },
      ...sortByObject,  
    }
    
    if(searchParams.get('take') !== 'all'){
      if(itemsPerPage) {
        whereObjects = {
          ...whereObjects,
          take: itemsPerPage, 
        }
      }
      if(skip) {
        whereObjects = {
          ...whereObjects,
          skip: (skip) ? skip : itemsPerPage * ((currentPage?parseInt(currentPage):1) - 1),  
        }
      }

      
    }
    
    /*

    const queryObjects = { 
      where: {
        OR: [
          { name: { contains: searchParams.filters.search } },
          { description: { contains: searchParams.filters.search } },
        ],
      },
      take: searchParams.pagination.itemsPerPage, 
      skip: searchParams.pagination.itemsPerPage * (productList.pagination.currentPage - 1), 
      orderBy: {
        [searchParams.sorting.field]: searchParams.sorting.direction
      }
    }
    */
    /*
    const pagination: Pagination = {
      totals: 0,
      itemsPerPage: itemsPerPage,
      pageCount: 0,
      currentPage: skip ? ((parseInt(skip) + 1) / itemsPerPage ) : 1, // skip = 10, (10 + 1) / 5 =  mean we are currently at page 2 where the page displays 5 items at a time.
    };
    const sorting: Sorting = {
      field: sortBy ? sortBy : 'id',
      direction: order ? order : 'asc',
    }; 
    const filters: ProductFilter  = {
      search: (keyword && keyword.trim() !== '') ? keyword : '',
      category: category ? parseInt(category) : 0,
      publicationType: '',
    };
    */
    // const productResults = await executeProductFilter(whereObjects);

    // const results = await queryProducts(whereObjects);
    //const results = await queryProductsRelationship(whereObjects);
    // const result = await queryProductsTest(whereObjects);
    
    /*const queryParams = {

    }
    const result = await queryProducts({ 
      where: {
        OR: [
          { name: { contains: searchParams.filters.search } },
          { description: { contains: searchParams.filters.search } },
        ],
      },
      take: searchParams.pagination.itemsPerPage, 
      skip: searchParams.pagination.itemsPerPage * (productList.pagination.currentPage - 1), 
      orderBy: {
        [searchParams.sorting.field]: searchParams.sorting.direction
      }
    });
    */
    //console.log('results:', results);
    
    //if(results)  {
      // console.log('executeProductFilter', result);
      //return NextResponse.json(results);
      // productList.originalItems = result.products;
      // productList.pagination.totals = result.totalRecords;
      // productList.pagination.pageCount = Math.ceil(result.totalRecords/productList.pagination.itemsPerPage);

    //}
    //return null;

    //return NextResponse.json(productResults);

    /*
    console.log('GET function')
    const categories = {}; //await getCategories();
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
    }*/
  }
  console.log('whereObjects: ', whereObjects);
  const results = await queryProductsRelationship(whereObjects);
  console.log('results:', results);
  if(sortBy === 'category' && results?.data) {
    if(order === 'desc') {
      results.data.sort((a, b) => b.category.localeCompare(a.category));
    } else {
      results.data.sort((a, b) => a.category.localeCompare(b.category));
    }
    
    
    itemsPerPage = take ? parseInt(take) : 5;    
    skip = (skipRaw) ? parseInt(skipRaw) : 0;
    let skipTo = (skip) ? skip : itemsPerPage * ((currentPage?parseInt(currentPage):1) - 1);
    
    const newResultData: Product[] = results.data.slice(skipTo, skipTo + itemsPerPage);
    
    return NextResponse.json({data: newResultData, count: results.count});
  }
  return NextResponse.json(results);
}

// INSERT Product
export async function POST(request: NextRequest) {
  let postResult: JSONResult<Product>;
  let validations: FieldValidation[] = [];

  const body = await request.json();

  console.log('SERVER POST');
  console.log(body);
  
  // Server Validations
  if(body.name === '') {
    validations.push({field: 'name', message: 'Product Name cannot be empty!'});
  }
  if(body.slug === '') {
    validations.push({field: 'slug', message: 'Slug cannot be empty!'});
  }
  if(body.price === '' && parseFloat(body.price) > 0) {
    validations.push({field: 'price', message: 'Price is Invalid!'});
  }
  if(body.summary === '') {
    validations.push({field: 'summary', message: 'Summary cannot be empty!'});
  }

  //let responseData = { messageType: 'success', message: 'Product successfully Created.' };
  // expect this structure body = {product:{name: '', description: '', price: 0, isPublished: true, ...}, category: '0'}
  // build the product structure
  //const productData: Product = generateTypeSafeProductData(body.product);
  if(validations.length === 0) {
    const productData: Product = {
      name: safeData(body.name),
      slug: safeData(body.slug),
      sku: safeData(body.sku),
      summary: safeData(body.summary, 250),
      description: safeData(body.description, 1000),
      imageUrl: safeData(body.imageUrl),
      thumbUrl: body.thumbUrl,
      price: parseFloat(body.price),
      inStock:  body.inStock as keyof typeof StockStatuses,
      // inStock: safeData<keyof typeof StockStatuses>(data.inStock) as StockStatuses || StockStatuses.INSTOCK,
      published: safeBooleanData(body.published),
    };

    // TODO: Add simple Validation  
    console.log(productData);

    // Find which Action to take
    console.log('Calling Create LIB');
    // two steps process
    // step 1: create the product (table)
    const { product, error } = await create(productData);
    // step 2: create new product category entry (table)
    // use the newly create product id
    let categoryId = 0;
    if(product) {
      const { productCategory, error: productCategoryError } = await createProductCategory(product.id, parseInt(body.category));
      //console.log('productCategory: ', productCategory);
      //console.log('productCategoryError: ', productCategoryError);
      if(productCategory) {
        categoryId = productCategory?.category_id;
        product.category = categoryId.toString();
      }

      postResult = { 
        data: { ...product, ...{ category: categoryId.toString() }}, 
        status: 'success'
      };
      return new Response(JSON.stringify(postResult));
    } else {
      if(error) {
        postResult = {
          status: 'failed',
          prompt: {messageType: 'error', message: 'Create Product Failed! Please try again. (' + error.message + ')'}
        }
        return new Response(JSON.stringify(postResult));
      }
    }    
  } else {
    postResult = {
      status: 'validationError', 
      fields: validations
    }
    return new Response(JSON.stringify(postResult));
  }
  
  
}

//export async function POST(request: NextRequest) {
  /**
   * The product can be saved into the database as 'draft', unless the admin checked the published checkbox
   * that being said, two reasons why the form was submitted
   * 1. The product Form has been filled and user submit the form
   * 2. Image is being uploaded
   *    - image upload needed form post hence it's designed this way and we need to do something about it.
   * 
   * So if the product is being submitted because of image upload, no need to trigger form validation and simply process the file upload and return the uploaded file source
   * Since the product is still draft, we need to save the file into a draft dir or temp dir, this way we can delete the images in this dir after a certain period of time.
   * OR we could also just save the draft info into the database without validation
   * Using the latter, the admin can always return back to where he left off even if the browser was closed unintentionally.
   * We will just have to use a discard button in order for the user to delete it.
   */
  


  // TWO STEPS NEEDED
  //let hasFile = false;
  //let filename = '';

  // 1. do file upload first
  /*const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (file) {
    // return NextResponse.json({ success: false })    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // With the file data in the buffer, you can do whatever you want with it.
    // For this, we'll just write it to the filesystem in a new location
    filename = file.name;
    const path = `/tmp/${file.name}`;
    await writeFile(path, buffer);
    console.log(`open ${path} to see the uploaded file`);
  }
  */
  //const body = await request.json();
  //let responseData = {};

  //console.log('POSTED TO THE SERVER');
  //console.log(body);
  /*
  const categoryData: Category = {
    name: body.name,
    slug: body.slug,
    description: body.description,
    parent: body.parent,
    count: 0
  }
  if(body.id > 0) {
    console.log('Calling Update LIB');
    console.log(categoryData);
    const updatedCategory = await update(body.id, categoryData);
    console.log('Update DONE');
    console.log(updatedCategory);
    if(updatedCategory.error) {
      console.log(updatedCategory.error);
      responseData = {status: 'NOK', action: 'UPDATE', message: 'Category Update Failed!', errorDetails: updatedCategory.error}
    } else 
      responseData = {status: 'OK', action: 'UPDATE', message: 'Category successfully Updated.', category: updatedCategory}
    
  } else {
    console.log('Calling CREATE LIB');
    const newCategory = await create(categoryData);
    console.log('CREATE DONE');
    console.log(newCategory);
    if(newCategory.error) {
      console.log(newCategory.error);
      responseData = {status: 'NOK', action: 'CREATE', message: 'Category creation Failed!', errorDetails: newCategory.error}
    } else 
      responseData = {status: 'OK', action: 'CREATE', message: 'Category successfully created.', category: newCategory}
  }
  */ 
  
  //return new Response(JSON.stringify(responseData));
//}





/*export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.formData();
  const file: File | null = data.get('image') as unknown as File;

  if (file) { 
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const path = `./uploads/${file.name}`;
    await writeFile(path, buffer);
    console.log(`open ${path} to see the uploaded file`);
    
    // Return a response to indicate the file has been received and saved
    // res.status(200).json({ path })
    return NextResponse.json({ success: path })   
  } else {
    return NextResponse.json({ success: false, error: 'Upload Failed.' })
  }
 
}*/
function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}