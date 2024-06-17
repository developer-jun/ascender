'use client'

import React from 'react';
import { Tag } from '@/types/tag';
import { Pencil, Trash } from '@/components/svg';
// import { ReducerAction } from '@/types/common';

type ItemProps = {
  handleOnDeleteAttempt: (item: Tag) => void,  
  onItemSelect: (item: Tag) => void,
  item: Tag
}
const Item = ({handleOnDeleteAttempt, onItemSelect, item}: ItemProps) => {
  
  return (
    <tr key={item.tag_id}>
      <th>{item.tag_id}</th>
      <td>{item.name}</td>
      <td>{item.description}</td>
      <td>
        <div className="flex flex-row">
          <div className="tooltip tooltip-left" data-tip="Edit Item">
            <Pencil 
              className="text-gray-400 hover:text-lime-700 cursor-pointer w-5 h-5" 
              onClick={(e) => onItemSelect(item)} />
          </div>
          <div className="tooltip tooltip-right" data-tip="Delete Item">
            <Trash 
              className="text-red-400 hover:text-orange-700 cursor-pointer w-5 h-5" 
              onClick={(e) => handleOnDeleteAttempt(item)} />
          </div>
        </div>
      </td>

    </tr>
  )
}

const TagItem = React.memo(Item);
export default TagItem;