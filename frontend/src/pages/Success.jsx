import React from 'react'
import { useSelector } from 'react-redux';

const Success = () => {
    const items = useSelector(selectCartItems);
  return (
    <div>
      <h1>Success</h1>
    </div>
  )
}

export default Success
