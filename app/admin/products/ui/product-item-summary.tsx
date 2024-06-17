import Link from "next/link";
import { memo } from "react";
import { Product } from "@/types/product";


const ProductItem = ({item} : {item: Product}) => {
  const {id, imageUrl, name, updatedAt, summary} = item;  
  return (
    <>
      <img className="w-40" src={imageUrl?imageUrl:'https://placehold.co/400x300'} alt={name} />
      <Link className="font-bold" href={`/admin/product/${id}`}>{name}</Link><br />
      <p>
        <FormatLastUpdated lastDateModified={updatedAt?.toLocaleString()} />
        {summary}
      </p>
    </>
  )
}

type FormatLastUpdatedProps = {
  lastDateModified: string | undefined
}
const FormatLastUpdated = ({lastDateModified = new Date().toLocaleDateString()}: FormatLastUpdatedProps) => {
  const updateDate = new Date(lastDateModified);
  return (
    <>
      <em>Updated On:</em><br /> 
      <span>{
        (new Date().toLocaleDateString() === updateDate.toLocaleDateString()) 
          ? 'Today, ' + updateDate.toLocaleTimeString() 
          : updateDate?.toLocaleString()
        }
      </span><br />
    </>
  )
}

const ProductSummary = ( memo(ProductItem) );
export default ProductSummary;