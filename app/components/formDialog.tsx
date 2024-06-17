import { useEffect, useRef, useState } from "react";
import { useHasClickOutside } from "@/hooks/useHasClickOutside";

type FormDialogProps = { 
  callback: (arg: boolean) => void,
  control: boolean,
  title: string,
  noClose?: boolean,
  children: React.ReactNode
}
const FormDialog = ({callback, control, title,noClose,children}: FormDialogProps) => {
  const dialogRef = useHasClickOutside(() => {
    callback(false);
  });

  if(!control)
    return null;

  return (
    <>
      {control && 
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
            </div>
            {!noClose &&
              <div className="flex justify-end pt-2">
                <button className="m-close px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400">Close</button>
              </div>                
            }
          </div>
        </div>
      }
    </>
  )
}

export default FormDialog;


/*

<div className="form-overlay z-100" style={{zIndex: '9999'}}>
        <input type="checkbox" id="dialog-modal" checked={control} onChange={() => console.log('clicked')} className="modal-toggle" />
        <dialog id="dialog-modal" className="modal" ref={ref}>
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-3 pb-2 border-b-2 border-slate-300">{title}</h3>
            <div>{children}</div>
          </div>
          {!noClose && (<form method="dialog" className="modal-backdrop">
              <button>Close</button>
            </form>)        
          }      
        </dialog>
      </div>



      <dialog id="my_modal_2" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Hello!</h3>
              <p className="py-4">Press ESC key or click outside to close</p>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>




          <dialog className="m pointer-events-none fixed w-full h-full top-0 left-0 flex items-center justify-center" ref={dialogRef}>
              <div className="m-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

              <div className="m-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">

                <div className="m-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50">
                  <svg className="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                    <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                  </svg>
                  <span className="text-sm">(Esc)</span>
                </div>

                <div className="m-content py-4 text-left px-6">

                  <div className="flex justify-between items-center pb-3">
                    <p className="text-2xl font-bold">{title}</p>
                    <div className="m-close cursor-pointer z-50">
                      <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                        <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                      </svg>
                    </div>
                  </div>

                  <div>{children}</div>
                </div>
                  {!noClose && (
                    <div className="flex justify-end pt-2">
                      <button className="px-4 bg-transparent p-3 rounded-lg text-indigo-500 hover:bg-gray-100 hover:text-indigo-400 mr-2">Action</button>
                      <button className="m-close px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400">Close</button>
                    </div>)        
                  }
              </div>
            </dialog>  

*/