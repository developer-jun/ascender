import { MessagePrompt } from '@/types/common';
import { Info, Check, Error, Warning } from '@/components/svg';

type AlertProps = {
  alert: MessagePrompt,
  iconSize: string
}
const Alert = ({alert, iconSize = 'w-6 h-6'}: AlertProps) => {
  let svgIcon = <Info className={iconSize} />;
  console.log(alert);
  switch(alert.messageType) {
    case 'success':
      svgIcon = <Check className={iconSize} />;
      break;
    case 'error':
      svgIcon = <Error className={iconSize} />;
      break;
    case 'warning':
      svgIcon = <Warning className={iconSize} />;
      break;
  }
  let classesNames = 'alert alert-success alert-error alert-warning alert-info'; // needed for daisyui, so that it knows which classes to generate
  return (
    <div role="alert" className={`alert alert-${alert.messageType}`}>
      {svgIcon}
      <span>{alert.message}</span>
    </div>    
  )
}

export default Alert;

/*export const Alert = ({messageType, message}: MessagePrompt) => {
  let alertClass = 'text-gray-800 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'; // default alert styles
  switch(messageType) {
    case 'success':
      alertClass = 'text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-green-800 dark:text-green-300 dark:border-green-600';
      break;
    case 'error':
      alertClass = 'text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-red-800 dark:text-red-300 dark:border-red-600';
      break;
    case 'warning':
      alertClass = 'text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-yellow-800 dark:text-yellow-300 dark:border-yellow-600';
      break;
    case 'info':
      alertClass = 'text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-blue-800 dark:text-blue-300 dark:border-blue-600';
      break;
  }
  return (
    <div className={`flex items-center p-4 text-sm ${alertClass}`} role="alert">
      <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
      </svg>
      <span className="sr-only">Info</span>
      <div>{message}</div>
    </div>
  )
}*/
