import { ReactNode } from "react";
import { useHasClickOutside } from "@/hooks/useHasClickOutside";
import { SVG } from '@/components/svg';
import Button from "./button";

type ModalProps = {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode; 
  error?: ReactNode;
}
const Modal = ({ children, header, footer, error }: ModalProps) => {  
  const dialogRef = useHasClickOutside(() => {
    return false;
  });
  return (
    <div className="form-overlay z-100" style={{zIndex: '9999'}}>
      <div className="m-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto" ref={dialogRef}>              
        <div className="m-content py-4 text-left px-6">
          {header}
        </div>
        {children}
        <div className="modal-action gap-1 pb-3 pr-3">
          {footer}
        </div>
      </div>
    </div>                
  );
}

type HeaderType = {
  title: string,
  onClose: () => void,
}
const Header = ({title, onClose}: HeaderType) => {
  return (
    <div className="flex justify-between items-center flex-row-reverse pb-3">      
      <a className="m-close cursor-pointer z-50" onClick={e=>onClose()}>
        <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
          <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
        </svg>
      </a>
      <p className="text-2xl font-bold text-gray-600">{title}</p>
    </div>
  )
}

type FooterType = {
  confirmationText?: string,
  onConfirm: () => void,
  onCancel: () => void,
  buttonLoader?: boolean,
}
const Footer = ({onConfirm, onCancel, buttonLoader}: FooterType) => {
  return (
    <div className="modal-action gap-2">
      <Button 
        className="btn btn-xs text-white" 
        onClick={() => onConfirm()} disabled={buttonLoader}>
        {buttonLoader 
          ? <SVG icon='spinner' className='animate-spin mr-2 w-4 h-4' />                  
          : ''} Confirm</Button> 
      <Button 
        className="btn btn-xs bg-slate-500 text-white" 
        onClick={() => onCancel()}>Cancel</Button>
    </div>
  )
}

Modal.Header = Header;
Modal.Footer = Footer;

export default Modal;
