import { useHasClickOutside } from "@/hooks/useHasClickOutside";

type DialogProps = {
  callback: (arg: boolean) => void,
  control: boolean,
  title: string,
  children: React.ReactNode
}
const Dialog = ({callback, control, title, children}: DialogProps) => {
  const dialogRef = useHasClickOutside(() => {
    callback(false);
  });
  console.log('Show dialog');

  if(!control)
    return null;

  return (
    <div className="form-overlay z-100" style={{zIndex: '9999'}}>
      <div className="m-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto" ref={dialogRef}>              
        <div className="m-content py-4 text-left px-6">
          <div className="flex justify-between items-center pb-3">
            <p className="text-2xl font-bold text-gray-600">{title}</p>
            <a className="m-close cursor-pointer z-50" onClick={e=>callback(false)}>
              <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </a>
          </div>
          {children}

          <div className="flex justify-end pt-2 gap-2">
            <button className="m-close px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400" onClick={e=>callback(false)}>Close</button>
            <button className="m-close px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400" onClick={e=>callback(true)}>Confirm</button>
          </div>
        </div>      
      </div>
    </div>    
  )
}

export default Dialog;