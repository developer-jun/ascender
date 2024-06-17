import { useEffect, useState } from 'react'
import { OptionItem } from '@/types/option';
import { isEmpty } from '@/utils/helpers';
import { Button2 } from '@/components/button';

type OptionListItemFormProps = {
  item: OptionItem;
  handleOnSave: (str: string) => void;
  handleOnCancel: () => void
}
const OptionItemForm = ({item, handleOnSave, handleOnCancel}: OptionListItemFormProps) => {
  const [itemName, setItemName] = useState('');
  const hasItem = !isEmpty(item);
  const action = (item && item.item_id) ? 'Update' : 'Create';
  console.log('selected [itemName]', itemName);

  useEffect(() => {
    console.log('Option Selected Item: ', item);
    if(item && item.item_name) {
      setItemName(item?.item_name);      
    }
  }, [item]);

  const handleCancel = (e) => {
    setItemName(''); // clear the field
    handleOnCancel();
  }

  return (
    <div className="form-fields-single">
      <div className="flex justify-between">
        <label className='pr-2 text-nowrap text-gray-600'>Option Item</label>         
        <div className="grow">
          <input className="input input-sm input-primary w-full max-w-xs bg-slate-200 text-gray-900" type="text" value={itemName} onChange={e=>setItemName(e.target.value)} />       
          { (item && item.item_id) 
              ? <span className='text-red-200 text-xs hover:text-red-400'>To Delete the Item, empty the field and click <strong className='text-blue-400'>Update</strong></span>
              : null
          }
        </div>
      </div>
      
      <div className="field-row mt-3 text-right">
        <Button2 className='btn-info btn-sm text-white' onClick={e=>handleOnSave(itemName)}>{action}</Button2>
        {hasItem &&
          <Button2 className='btn-error ml-1 btn-sm text-white' onClick={handleCancel}>Cancel</Button2>}
      </div>
    </div>
  )
}

export default OptionItemForm;