'use client';

import TagContents from './ui/tag-contents';
import { Provider, tagData } from "@/admin/contexts/tag";

export default function CategoryPage() {
  // if need be, make this a server component and retrieve category list
  // then use categoryData variable to set the data to be used in the client component
  // but for the sake of Prioritising React over Nextjs, I'm going to keep it as a client component
  // categoryData.items = getCategories(); // IF this is a server side function
  return (      
    <Provider initialValue={tagData}>
      <section className="contents">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            Product TAGS
          </h1>        
          <div className="form-list-container flex p-3 gap-3">
            <TagContents />
          </div>  
      </section>
    </Provider>
  )
}
