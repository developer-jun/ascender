import ProductForm from "@/admin/products/[id]/form/product-form";
import LatestUpdates from "@/admin/products/[id]/form/latest-updates";
import { Provider } from "@/admin/contexts/product";
import { ProductContextType } from "@/types/product";
import { emptyProduct, getProduct, queryProductsRelationship } from "@/lib/product";
// import { useRouter, useSearchParams } from "next/navigation";
import { type NextRequest } from 'next/server'
import { useRouter, useSearchParams } from 'next/navigation';

interface OrderBy {
  [key: string]: string;
}

async function getProducts(): Promise<any> {  
  let sortByObject = { 
    orderBy: {
      updatedAt: 'desc',
    } as OrderBy,
    take: 5,
  };
  let whereObjects = {...sortByObject};  
  const results = await queryProductsRelationship(whereObjects);
 
  return results;
}

export default async function ProductFormPage({
  params,
  searchParams,
  }: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
  }) {  
  
  let initialValue: ProductContextType = {
    items: [],
    selectedItem: null,
    refreshCounter: 0,
    categories: [],
  }
  // comment out below to let React take over, but it will be slower
  //const { data } = await getProducts();  
  //initialValue['items'] = data;

  console.log('urlParams: ', params.id);

  if(params.id && params.id !== '0') {
    const product = await getProduct(parseInt(params.id));
    if(product) {
      let categoryInfo = {};
      if(product.productcategory && product.productcategory.length > 0) {
        categoryInfo = {
          productcategoryid: product.productcategory[0]?.product_category_id,
          categoryId: product.productcategory[0]?.category.id,
          category: product.productcategory[0]?.category.name,
        }
      }
      initialValue['selectedItem'] = {
        ...product,
        ...categoryInfo        
      }
    }    
    //console.log('Product Info: ', product);
    console.log('Default context value: ', initialValue);
  }
  
  return (    
    <Provider initialValue={initialValue}>
      <div className="flex gap-3">
        <section className="form-content w-3/4">
          <a className="custom-btn sm-btn inline-flex items-center gap-2" href="/admin/products"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg> Back</a>
          <h1 className="title px-5">Product</h1>
          <div className="p-4">
            <ProductForm />
          </div>        
        </section>
        <section className="latest-updates w-1/4 p-4 pt-3">
          <h2 className="font-semibold text-lg">Latest Activities</h2>
          <div className=" mt-8 p-5 rounded-md bg-slate-200 h-screen relative overflow-x-auto">
            <LatestUpdates />
          </div>
        </section>
      </div>
    </Provider>
  );
}