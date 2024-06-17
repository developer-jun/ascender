import { MessagePrompt } from '@/types/common';
import { cn } from '@/utils/helpers'
interface DropdownProps extends React.DetailedHTMLProps<React.DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement> {
  label: string;
  items: any[] | null;
}
const Dropdown = ({label, items, className}: DropdownProps) => {
  return (
    <div className={cn("dropdown", className)}>
      <button tabIndex={0} role="button" className="btn btn-sm">{label}</button>
      <ul tabIndex={0} className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
        { items && items.length > 0 
           ? items.map((item, index) => 
              <li key={index}>
                <a href={item.url} onClick={(e) => { e.preventDefault(); item.onClick ? item.onClick() : null }}>
                  {item.icon !== null ? item.icon : null}
                  {item.title}
                </a>
              </li>
            )  
           : <li><a>No items</a></li>
        }
        
      </ul>
    </div>
  )
}


export default Dropdown;