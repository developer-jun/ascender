import { memo } from 'react';
import { Product } from '@/types/product';
import { SVG } from '@/components/svg';
// import "./product-item.scss";

type ProductItemProps = {
  product: Product,
  isSelected: boolean,
  onCheck(id: number): void,
  onEdit(id: number): void,
  onDelete(product: Product): void
}

const Item = ({product, isSelected, onCheck, onEdit, onDelete}: ProductItemProps) => {
  const { id, name, category, price, summary } = product;
  return (    
    <tr className='product-item' key={id}>
      <th>      
        <input type="checkbox" onChange={(e) => onCheck(id)} checked={isSelected} className="checkbox" />
      </th>        
      <td>{name}</td>
      <td>{category}</td>
      <th>$ {price}</th>
      <td>{summary}</td>
      <td>
        <div className="flex flex-row justify-center align-center">
          <a href="#category-form" onClick={(e) => onEdit(id) }>
            <SVG icon="cog" className="text-gray-400 hover:text-lime-700 cursor-pointer" />
          </a>
          <a onClick={(e) => onDelete(product)}>
            <SVG icon="trash" className="text-red-600 hover:text-orange-700 cursor-pointer" />
          </a>
        </div>
      </td>
    </tr>
  )
}

const ProductItem = ( memo(Item) );
export default ProductItem;

// {/*<a href="#category-form"><ClipboardEdit className="text-gray-400 hover:text-lime-700 cursor-pointer" onClick={(e) => {handleOnEdit(id)} } /></a><Trash2 className="text-red-600 hover:text-orange-700 cursor-pointer" onClick={(e) => handleOnDelete(id)} />*/}
/*
export const ProductItem = memo(Item, (previousProps, nextProps) => {
  return previousProps.product === nextProps.product;
});*/

/*
const arePropsEqual = (prevProps: ProductItemProps, nextProps: ProductItemProps) => {
  // Only re-render if the isSelected prop has changed
  return prevProps.isSelected === nextProps.isSelected;
};

export const ProductItem = memo(Item, arePropsEqual);
*/

/*
export const ProductItem = memo(Item, (previousProps, nextProps) => {
  const prevProduct = previousProps.product;
  const nextProduct = nextProps.product;

  return (
    prevProduct.id === nextProduct.id &&
    prevProduct.sku === nextProduct.sku &&
    prevProduct.name === nextProduct.name &&
    prevProduct.summary === nextProduct.summary &&
    prevProduct.price === nextProduct.price &&
    prevProduct.isSelected === nextProduct.isSelected
  );
});
*/