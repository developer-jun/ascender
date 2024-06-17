import React, { memo } from 'react'

const Spinner = ({size = 'md'}: {size?: string}) => {
  return (
    <span className={`loading loading-spinner loading-${size}`}></span>
  )
}

const Loader = ( memo(Spinner) )
export default Loader;
