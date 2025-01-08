import React from 'react'
import axiosInstance from '../axiosConfig'
export default function Anonymous() {
  const anonymousData = Math.floor(Math.random * 1000000)
  axiosInstance.post("/api/anonymous",anonymousData )
  return (
    <div>
     Anonymous id = {}
    </div>
  )
}
