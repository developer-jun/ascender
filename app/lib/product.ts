import prisma from './db';
import { MessagePrompt } from '@/types/common';
import { Pagination, Product, ProductFilter, Sorting } from "@/types/product";

export async function getProduct(id: number) {
  try{
    const _product = await prisma.product.findFirst({ 
      where: { id },
      include: {
        productcategory: {
          include: {
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })
    
    return _product;
  } catch (error) {
    console.log('QUERY ERROR')
    console.log(error)
    return { error };
  }

}

export async function getProducts(args: any) {
  console.log('getProducts')
  try{
    const _products = await prisma.product.findMany(args);

    return _products;
  } catch (error) {
    console.log('QUERY ERROR')
    console.log(error)
    return { error };
  }
}

export async function queryProductsTest(args: any) {
  try{
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: 'shirt' } },
          { description: { contains: 'shirt' } }
        ],
      },
      take: 5,
      skip: 0
    });
    
    
    console.log('products: ', products);
    return products;
  } catch (error) {
    console.log('QUERY ERROR')
    console.log(error)
    return null;
  }
}

export async function queryProducts(args: any) {
  console.log('getProducts') 
  try{
    const [count, products] = await prisma.$transaction([
      prisma.product.count({
        where: args.where
        }),
      prisma.product.findMany(
        args        
      ),
    ]);
    
    console.log('totalRecords: ', count);
    console.log('products: ', products);
    return {count, products};
  } catch (error) {
    console.log('QUERY ERROR')
    console.log(error)
    return null;
  }
}

export async function queryProductsAndCount(args: any) {
  console.log('queryProductsAndCount');
  try{
    const [data, count] = await Promise.all([
        prisma.product.findMany(args),
        prisma.product.count({
            where: args.where
        }),
    ]);
    /*
    const [count, products] = await prisma.$transaction([
      prisma.product.count({
        where: args.where
        }),
      prisma.product.findMany(
        args        
      ),
    ]);
    */
    console.log('totalRecords: ', count);
    console.log('products: ', data);
    return {data, count};
  } catch (error) {
    console.log('QUERY ERROR')
    console.log(error)
    return null;
  }
}

export async function queryProductsRelationship(args: any, order?: Sorting) {
  // console.log('PRODUCT LIB: queryProductsRelationship ');
  let categorySort = null;
  if(order && order.field === 'category') {
    categorySort = {
      orderBy: order
    }
  }
  try{
    args['include'] = {
      productcategory: {
        select: {            
          category: {
            select: {
              name: true,
              id: true
            },
          },
        },
      },
    }

    if(order && order.field === 'category') {
      args['include']['productcategory']['select']['category'] = {
        ...args['include']['productcategory']['select']['category'],
        orderBy: {  
          name: order.direction,  
        }
      }      
    }
    console.log('product args: ', args);
    const [data, count] = await Promise.all([        
        prisma.product.findMany(args),
        prisma.product.count({
            where: args.where
        }),
    ]);
    // need to separate the category into it's own field, for easy access and sortability.
    //console.log(data);
    data.forEach(product=>{
      if(product.productcategory && product.productcategory.length > 0) {
        product.category = product.productcategory[0].category.name;
        product.productcategoryid = product.productcategory[0].category.id;
        product.productcategory = product.productcategory[0].category.id;
      } else {
        product.category = '';
        product.productcategoryid = 0;
        product.productcategory = 0;
      }
      
    });
    /*
    const [count, products] = await prisma.$transaction([
      prisma.product.count({
        where: args.where
        }),
      prisma.product.findMany(
        args        
      ),
    ]);
    */
    //console.log('totalRecords: ', count);
    //console.log('queryProductsRelationship: ', data);
    return { data, count };
  } catch (error) {
    console.log('QUERY ERROR')
    console.log(error)
    return null;
  }
}

export async function queryProductsCategory(pagination: Pagination, order?: Sorting, filters?: ProductFilter) {
  // console.log('PRODUCT LIB: queryProductsRelationship ');
  let paginate = '';
  if(pagination.activePage)
    paginate = 'LIMIT ' + pagination.itemsPerPage
  if(pagination.activePage)
    paginate += ' OFFSET ' + ((pagination.activePage > 0) ? pagination.itemsPerPage * (pagination.activePage - 1) : 0)
  
  let orderBy = '';
  if(order) {
    orderBy = 'ORDER BY ' + order.field + ' ' + order.direction
  }

  let where = '';
  if(filters){    
    if(filters.search !== '')
      where += ` product.name LIKE %'${filters.search}' OR product.summary LIKE %'${filters.search}' OR product.description LIKE %'${filters.search}'`;

    if(filters.category)
      where += ` category.id = ${filters.category}`;

    if(where)
      where = 'WHERE' + where;
  }

  try{
    /*
    args['include'] = {
      productcategory: {
        select: {            
          category: {
            select: {
              name: true,
              id: true
            },
          },
        },
      },
    }

    if(order && order.field === 'category') {
      args['include']['productcategory']['select']['category'] = {
        ...args['include']['productcategory']['select']['category'],
        orderBy: {  
          name: order.direction,  
        }
      }      
    }
    console.log('product args: ', args);
    */
    /*
    const productCategories = await prisma.productcategory.findMany({        
          include: {
            category: true,
            product: true,
          },
          orderBy: {
            category: {
              name: 'asc',
            },
          },
        });
    // need to separate the category into it's own field, for easy access and sortability.
    
    const products = productCategories.map(pc => {
      return { ...pc.product, categoryName: pc.category.name}
    });*/
    /*
    const products = await prisma.product.findMany({
      include: {
        productcategory: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        productcategory: {
          category: {
            name: 'asc',
          },
        },
      },
    });

    console.log(products);*/
    const sql = `SELECT product.*, category.name AS 'category' 
      FROM product 
        LEFT JOIN productcategory ON product.id = productcategory.product_id
        LEFT JOIN category ON category.id = productcategory.category_id
        ${where} ${orderBy} ${paginate}`;
    console.log('SQL: ', sql);
    /*const result = await prisma.$queryRawUnsafe(`SELECT count(product.id) as total FROM product
      LEFT JOIN productcategory ON product.id = productcategory.product_id
      LEFT JOIN category ON category.id = productcategory.category_id 
      ${where}`
    );
    console.log(result[0].total);
    */
   
    const [data, count] = await Promise.all([        
      prisma.$queryRawUnsafe(sql),
      prisma.$queryRawUnsafe(`SELECT count(product.id) as total FROM product
        LEFT JOIN productcategory ON product.id = productcategory.product_id
        LEFT JOIN category ON category.id = productcategory.category_id 
        ${where}`
      ),
    ]);
    console.log(count);
    // console.log(productCategories);
    /*
    const [count, products] = await prisma.$transaction([
      prisma.product.count({
        where: args.where
        }),
      prisma.product.findMany(
        args        
      ),
    ]);
    */
    //console.log('totalRecords: ', count);
    //console.log('queryProductsRelationship: ', data);
    return { data, count: Number(count[0].total) };
  } catch (error) {
    console.log('QUERY ERROR')
    console.log(error)
    return null;
  }
}
/*
export async function queryProducts2(args: any) {
  try{
    const [count, products] = await prisma.$transaction([
      prisma.product.count({
        where: {
          OR: [
            { name: { contains: 'shirt' } },
            { description: { contains: 'shirt' } }
          ],
        }
      }),
      prisma.product.findMany(
        {
          where: {
            OR: [
              { name: { contains: 'shirt' } },
              { description: { contains: 'shirt' } }
            ],
          },
          take: 5,
          skip: 0
        }
        
      ),
    ]);
    // const [totalRecords, products] = await prisma.$transaction([
    //   prisma.product.count((args && args.where) ? args.where :{}),
    //   prisma.product.findMany(args),
    // ]);
    // const products = await prisma.product.findMany({
    //   where: {
    //     OR: [
    //       { name: { contains: 'shirt' } },
    //       { description: { contains: 'shirt' } },
    //     ],
    //   },
    // });
    // const products = await prisma.product.findMany({
    //   where: {
    //     OR: [
    //       { name: { search: 'shirt' } },
    //       { description: { search: 'shirt' } },
    //     ],
    //   },
    // });

    console.log('totalRecords: ', count);
    console.log('products: ', products);
    return {count, products};
  } catch (error) {
    console.log('QUERY ERROR')
    console.log(error)
    return null;
  }
}*/
// const usersWithCount = await prisma.user.findMany({ include: { _count: { select: { posts: true }, }, },})

// export async function getProducts({ take = 100, skip = 0, orderByField = 'createdAt', order = 'asc' }: { take?: number, skip?: number, orderByField?: string, order?: string}) {
//   try{
//     const _products = await prisma.product.findMany({
//       take: take,
//       skip: skip,
//       orderBy: [{
//           [orderByField]: [order],
//         },        
//       ]
//     });

//     return _products;
//   } catch (error) {
//     console.log('QUERY ERROR')
//     console.log(error)
//     return { error };
//   }

// }

export async function getAllProducts() {
  console.log('getAllProducts');
  try{
    const _products = await prisma.product.findMany();
    
    return _products;
  } catch (error) {
    console.log('QUERY ERROR')
    console.log(error)
    return { error };
  }

}

export async function create(data: Product) {
  let product = null, error = null;
  try{
    product = await prisma.product.create({data});    
  } catch (_error) {
    console.log('QUERY ERROR');
    console.log(_error);
    error = _error;
  }
  return { product: product, error: error };
}

export async function update(id: number, data: Product) {
  let _product = null, error = null;
  try{
    _product = await prisma.product.update({
      where: { id },
      data   
    });    
  } catch (error) {
    console.log('QUERY ERROR');
    console.log(error);
    error = error;
  }

  return { product: _product, error: error };
}

export async function deleteProduct(id: number) {
  try{
    await prisma.product.delete({
      where: { id }
    });
    
    return {message: 'Product successfully deleted.', messageType: 'success' } as MessagePrompt;
  } catch (error) {
    console.log('[PRODUCT DELETE] QUERY ERROR')
    console.log(error)
    return {message: error.message, messageType: 'error' } as MessagePrompt;
  }
}

export async function deleteProductAndCategory(productId: number) {
  try{  

    // First, delete the associated entries in the 'productcategory' table
    await prisma.productcategory.deleteMany({
      where: {
        product_id: productId
      }
    })

    // Then, delete the product
    await prisma.product.delete({
      where: {
        id: productId
      }
    })
    
    return {message: 'Product successfully deleted.', messageType: 'success' } as MessagePrompt;
  } catch (error) {
    console.log('[PRODUCT DELETE] QUERY ERROR')
    console.log(error)
    return {message: error.message, messageType: 'error' } as MessagePrompt;
  }
}

export function emptyProduct() {
  return {
    id: 0,
    name: '',
    slug: '',
    sku: '',
    summary: '',
    description: '',
    imageUrl: '',
    price: 0,
    category: '',
    thumbUrl: '', 
    inStock: '', 
    published: false
  }
}