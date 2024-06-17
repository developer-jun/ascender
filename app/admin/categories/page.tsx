'use client';

import CategoryContents from './ui/category-contents';
import { Provider, categoryData } from "@/admin/contexts/category";

export default function CategoryPage() {
  // if need be, make this a server component and retrieve category list
  // then use categoryData variable to set the data to be used in the client component
  // but for the sake of Prioritising React over Nextjs, I'm going to keep it as a client component
  // categoryData.items = getCategories(); // IF this is a server side function
  return (      
    <Provider initialValue={categoryData}>
      <section className="contents">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            CATEGORIES
          </h1>        
          <div className="form-list-container flex p-3 gap-3">
            <CategoryContents />
          </div>  
      </section>
    </Provider>
  )
}
