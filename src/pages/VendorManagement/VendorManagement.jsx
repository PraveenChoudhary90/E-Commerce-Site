import React from 'react'
import VendorManagementForm from './VendorManagementForm'
import Footer1 from '../../components/Footer1'
import VendorList from './VendorList'

const VendorManagement = () => {
  return (
    <div className='space-y-7'>
      <VendorList tittle={"Vendor All List"} />
      <Footer1 />
    </div>
  )
}

export default VendorManagement