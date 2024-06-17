import prisma from './db';
import { ProductCategory } from '@/types/productCategory'
import { MessagePrompt } from '@/types/common';
//import { Product } from "@/types/product";

/**
 * Table Name: productcategory
 * Fields:
 *  product_category_id Int Autoincrement Primary Key
 *  product_id Int
 *  category_id Int
 */


export async function createProductCategory(productId: number, categoryId: number) {
  let resultData = null, error = null;
  console.log('createProductCategory: ', productId, categoryId);
  const data: ProductCategory = {category_id: categoryId, product_id: productId}
  try{
    resultData = await prisma.productcategory.create({data});    
  } catch (error) {
    console.log('createProductCategory QUERY ERROR');
    console.log(error);
  }
  return { productcategory: resultData, error: error };
}

// Note that updating a table (productcategory) requires the primary id which we don't have just yet
// so it's a two way process, first retrieve the primary id using the product id, don't trust the category id since user could have changed it hence there's a need to update it in the first place.
export async function updateProductCategory(id: number, categoryId: number) {
  let productCategoryError = {};
  let productCategoryData = {}
  let action = 'update';
  try{  
    if(categoryId === 0) {
      action = 'delete';
    }
    console.log('UPDATING CATEGORY: ', id, categoryId);
    // Step 1: Retrieve the primary id using the product id
    const productCategory = await prisma.productcategory.findFirst({where: { product_id: id }});
    if(productCategory) {
      // Update or Delete
      if(categoryId === 0) {
        action = 'delete';
        // can only delete here and not outside since we now have the primary id
        deleteProductCategoryItem(productCategory.product_category_id);   
      } else {
        // Update
        console.log('[productCategory]: ', productCategory);

        // Step 1.5: Check the result and compare the returned category id with what we have.
        //  If they are different, update the category id, else do nothing
        if(productCategory.category_id !== categoryId) {
          // Step 2: Update the Table with the new category id
          try {
            productCategoryData = await prisma.productcategory.update({
              where: { product_category_id: productCategory.product_category_id },
              data: { category_id: categoryId }
            });
            console.log('update result: ', productCategoryData);
          } catch (error) {
            throw error;
          }
        }
      }
      
    } else {
      action = 'create';
      // Step 1.5: If no productcategory found, create a new one
      const { productCategory, error } = await createProductCategory(id, categoryId);
      productCategoryData = productCategory;
      productCategoryError = error
    }
    
    // Deleting a productcategory item using product_id will not work, it needs the primary id which is product_category_id
    // The solution is to retrieved all the records using the product_id and then used the primary product_category_id to delete them
    /*
    const productcategories = await prisma.productcategory.findMany({where: { product_id: id }});
    const productCategoryIDs = productcategories.map(item => item.product_category_id);
    const deleteProductCategory = await prisma.productcategory.deleteMany({
      where: {
        product_category_id: {
          in: productCategoryIDs
        }
      }
    });
    
    return createProductCategory(id, categoryId);    
    */
  } catch (error) {
    console.log('QUERY ERROR')
    productCategoryError = error
    return false;
  }

  return { productCategoryData, productCategoryError }
}

export async function getProductCategoriesRaw() {
  try{
    const results = await prisma.$queryRawUnsafe(
      `SELECT p.name, LEFT(p.description, 256),  price,  p.id,  imageUrl,  inStock,  published,  sku,  p.slug, c.id AS categoryid, c.name AS categoryname
      FROM product AS p
      INNER JOIN productcategory AS pc ON p.id=pc.product_id 
      INNER JOIN category AS c ON pc.category_id = c.id
      ORDER BY p.updatedAt desc
      LIMIT 10 OFFSET 0`
    );   
    
    return results;
  } catch (error) {
    console.log('QUERY ERROR')
    console.log(error)
    return { error };
  }

}
/*
'SELECT * FROM users WHERE email = $1',
'emelie@prisma.io'
*/
export async function getProducts(args: any) {
  try{
    const _products = await prisma.product.findMany({ 
      take: 5, 
      skip: 0, 
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        categories: true,
      },
    });

    return _products;
  } catch (error) {
    console.log('QUERY ERROR')
    console.log(error)
    return { error };
  }
}

export async function deleteProductCategoryItem(id: number) {
  try{
    const productcategories = await prisma.productcategory.delete({where: { product_category_id: id }});
    return { message: 'Product category success deleted', messageType: 'success' } as MessagePrompt;
  } catch (error) {
    console.log('QUERY ERROR')
    console.log(error)
    return { message: error.message, messageType: 'error' } as MessagePrompt;
  }
}

export async function deleteProductCategory(id: number) {
  try{

    const productcategories = await prisma.productcategory.findMany({where: { product_id: 1 }});
    const productCategoryIDs = productcategories.map(item => item.product_category_id);
    const deleteProductCategory = await prisma.productcategory.deleteMany({
      where: {
        product_category_id: {
          in: productCategoryIDs
        }
      }
    });


    //await prisma.product.delete({
    //  where: { id }
    //});
    
    return { message: 'Product category success deleted', messageType: 'success' } as MessagePrompt;
  } catch (error) {
    console.log('QUERY ERROR')
    console.log(error)
    return { message: error.message, messageType: 'error' } as MessagePrompt;
  }
}