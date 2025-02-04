import React, { useEffect, useState } from 'react'
import { Server } from 'lucide-react'
import axiosInstance from '@/axiosConfig'
import { useNavigate } from 'react-router-dom'

export default function ServerListing() {

  const navigate = useNavigate()
  
  const [servers, setServers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await axiosInstance.get('/api/serverlisting')
        setServers(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Server listing error:', error)
        setLoading(false)
      }
    }
    fetchServers()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-4">
        <div className="animate-spin">
          <Server size={48} />
        </div>
      </div>
    )
  }

  const handleClick = (serverId) => {
    navigate(`/server/${serverId}`)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {servers.map((server) => (
        <div 
          key={server._id} 
          className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 cursor-pointer"
          
        >
          {server.serverImage ? (
            <img 
              src={server.serverImage} 
              alt={server.serverName} 
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
              <Server size={64} className="text-gray-500" />
            </div>
          )}
          
          <div className="p-4">
            <h2 className="text-lg font-bold text-white truncate">{server.serverName}</h2>
            <p className="text-sm text-gray-400 truncate">{server.serverIP}</p>
            <div className="flex items-center mt-2">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">Online</span>
              <button onClick={() => handleClick(server._id)} className='bg-transparent rounded-md border border-blue-500 px-3 py-1 mx-3'>Join Server</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
