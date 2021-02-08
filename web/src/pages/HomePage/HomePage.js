import { Link, routes } from '@redwoodjs/router'
import CoreLayout from 'src/layouts/CoreLayout'
import { useAuth } from '@redwoodjs/auth'
import PageHeader from 'src/components/PageHeader/PageHeader'
import { useFlash } from '@redwoodjs/web'
import { useEffect, useState } from 'react'

const HomePage = ({ workspace }) => {
  const { isAuthenticated, currentUser } = useAuth()
  const { addMessage } = useFlash()

  return (
    <CoreLayout title={`Hello, ${currentUser.name}!`}>
      <div class="px-4 mt-6 sm:px-6 lg:px-8">Your dashboard</div>
    </CoreLayout>
  )
}

export default HomePage
