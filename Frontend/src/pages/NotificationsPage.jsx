import React from 'react'
import Header from '../components/Header'

const NotificationsPage = () => {
  return (
    <div className='flex flex-col min-h-screen'>
       <Header
        bgColor="bg-white"
        borderColor="border-gray-200"
        paddingX="px-6"
        paddingY="py-2"
        linksFontSize="text-[0.9rem]"
      />
      <div>Notifications Page!</div>
    </div>
  )
}

export default NotificationsPage