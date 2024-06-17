'use client'

import React from 'react';
import { Category } from '@/types/category';
import { Pencil, Trash } from '@/components/svg';
// import { ReducerAction } from '@/types/common';

type ItemProps = {
  handleOnDeleteAttempt: (item: Category) => void,  
  onItemSelect: (item: Category) => void,
  item: Category
}
const Item = ({handleOnDeleteAttempt, onItemSelect, item}: ItemProps) => {
  
  return (
    <tr key={item.id}>
      <th>{item.id}</th>
      <th>{item.parent}</th>
      <td>{item.name}</td>
      <td>{item.description}</td>
      <td>
        <div className="flex flex-row">
          <div className="tooltip tooltip-left" data-tip="Edit Category">
            <Pencil 
              className="text-gray-400 hover:text-lime-700 cursor-pointer w-5 h-5" 
              onClick={(e) => onItemSelect(item)} />
          </div>
          <div className="tooltip tooltip-right" data-tip="Delete Category">
            <Trash 
              className="text-red-400 hover:text-orange-700 cursor-pointer w-5 h-5" 
              onClick={(e) => handleOnDeleteAttempt(item)} />
          </div>
        </div>
      </td>

    </tr>
  )
}

const CategoryItem = React.memo(Item);
export default CategoryItem;