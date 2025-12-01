import React from 'react'
import EditBanner from './EditBanner'
import Footer1 from '../../components/Footer1'
import BannerList from './BannerList'

const StaticBanner = () => {
  return (
    <div className='space-y-7'>

      <BannerList/>
      <Footer1/>
    </div>
  )
}

export default StaticBanner