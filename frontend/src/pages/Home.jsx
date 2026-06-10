import React from 'react'
import Slide from '../component/Slide'
import Product from './Product'
import Category from './Category'

const Home = () => {
  return (
    <div className='bg-orange-300'> 
        <Slide/>
        <Product/>
        <Category/>
        <div>wellcome to this site</div>
      
    </div>
  )
}

export default Home
