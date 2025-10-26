'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'

// This component can be used for testing authentication flows
export default function AuthTest() {
  const { user, loading, signInWithGoogle } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (user) {
    return (
      <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
        <h3 className="font-bold">Authenticated User</h3>
        <p>Email: {user.email}</p>
        <p>Name: {user.full_name || 'Not set'}</p>
        <p>Credits: {user.credits}</p>
        <p>Plan: {user.subscription_plan}</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
      <h3 className="font-bold">Not Authenticated</h3>
      <p>User is not logged in</p>
    </div>
  )
}
