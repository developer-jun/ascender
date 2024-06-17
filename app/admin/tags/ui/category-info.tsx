import { Category } from "@/types/category";
import { ReactNode } from "react"

interface CategoryDetails extends Category {
  children?: ReactNode;
}

const CategoryInfo = ({id, name, slug, description, parent, children}: CategoryDetails) => {
  

  return (
    <div className="items-center text-left">
      <h2 className="title font-semibold">{ name }</h2>      
      <p>{description}</p>
      {children}
    </div>
  )
}

export default CategoryInfo;