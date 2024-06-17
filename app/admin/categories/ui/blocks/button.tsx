type ButtonProps = {
  className?: string, 
  type?: string, 
  title?: string, 
  onClick?: () => void, 
  children: React.ReactNode
}
const Button =  ({ 
  className, type, title, onClick, children 
}: ButtonProps) => {
  let buttonType = 'button'; // create safe button type
  if(type === 'submit' 
    || type === 'reset' 
    || type === 'button') {
    buttonType = type;
  }
  return (
    <>
      <button className={className} type={buttonType} title={title} onClick={onClick}>
        {children}
      </button>
    </>
  )
}
export default Button;