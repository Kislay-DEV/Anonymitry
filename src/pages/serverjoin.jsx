import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Server, Users, Shield } from 'lucide-react'
import axiosInstance from '@/axiosConfig'

export default function Serverjoin() {
    const { serverId } = useParams()
    const [serverDetails, setServerDetails] = useState(null)
    const [error, setError] = useState(null)
    const [isJoining, setIsJoining] = useState(false)
    const [joined, setJoined] = useState(false)

    useEffect(() => {
        const findServer = async () => {
            try {
                const response = await axiosInstance.get(`/api/server/${serverId}`);
                setServerDetails(response.data.server);
            } catch (error) {
                setError(error.response?.data?.message || 'Error finding server')
            }
        }

        if (serverId) {
            findServer();
        }
    }, [serverId])

    const joinServer = async () => {  
      setIsJoining(true);
      try {
          // Make the PUT request to join the server
          const response = await axiosInstance.put(`/api/server/${serverId}`);
  
          // Update the serverDetails state with the response data
          setServerDetails(response.data.server);
  
          // Optional: Show a success message or redirect
          console.log("Successfully joined the server!");
      } catch (error) {  
          // Log the error for debugging
          console.error("Join Server Error:", error);
  
          // Set the error message for the UI
          setError(error.response?.data?.message || 'Error joining server');
      } finally {
          // Reset the joining state
          setIsJoining(false);
          setJoined(true);
      }
  };
  
    if (error) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
            <div className="text-center">
                <Server size={64} className="mx-auto mb-4 text-red-500" />
                <h1 className="text-2xl font-bold">Error</h1>
                <p className="text-gray-400">{error}</p>
            </div>
        </div>
    )

    if (!serverDetails) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="animate-pulse">
                <Server size={64} className="text-blue-500 mx-auto" />
                <p className="text-white text-center mt-4">Loading server...</p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md text-center">
                {serverDetails.serverImage ? (
                    <img 
                        src={serverDetails.serverImage} 
                        alt={serverDetails.serverName} 
                        className="w-32 h-32 object-cover rounded-full mx-auto mb-6"
                    />
                ) : (
                    <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <Server size={64} className="text-gray-500" />
                    </div>
                )}

                <h1 className="text-3xl font-bold text-white mb-4">{serverDetails.serverName}</h1>
                <p className="text-gray-400 mb-6">{serverDetails.serverIP}</p>

                <div className="flex justify-center space-x-4 mb-6">
                    <div className="flex items-center text-gray-300">
                        <Users size={20} className="mr-2" />
                        <span>{serverDetails.serverMembers.length} Members</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                        <Shield size={20} className="mr-2" />
                        <span>Verified</span>
                    </div>
                </div>

                <button 
                    >
                    {joined ? (
                      <button
                        className="w-full bg-green-600 text-white font-bold py-3 rounded-lg px-3"
                        disabled
                      >
                        Joined
                      </button>
                    ) : (
                      <button
                        onClick={joinServer}
                        disabled={isJoining}
                        className="w-full bg-blue-600 hover:bg-blue-700 px-3 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isJoining ? 'Joining...' : 'Join Server'}
                      </button>
                    )}
                    
                </button>
            </div>
        </div>
    )
}