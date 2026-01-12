import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import client from "../libs/http"
import { joinProtocol, leaveProtocol, onProtocolUpdated, onProtocolUserCount } from "../libs/socket"
import Layout from "../components/Layout"

export default function Item() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isUpdating, setIsUpdating] = useState(false)
  const [wasUpdated, setWasUpdated] = useState(false)
  const [userCount, setUserCount] = useState(0)

  useEffect(() => {
    if (!id) return

    joinProtocol(id)

    const unsubscribeUpdated = onProtocolUpdated((data) => {
      if (data.protocol_id === Number(id)) {
        setWasUpdated(true)
      }
    })

    const unsubscribeUserCount = onProtocolUserCount((data) => {
      console.log('Received protocol_user_count:', data, 'Current id:', id)
      if (data.protocol_id === Number(id)) {
        console.log('Setting user count to:', data.user_count)
        setUserCount(data.user_count)
      }
    })

    return () => {
      leaveProtocol(id)
      unsubscribeUpdated()
      unsubscribeUserCount()
    }
  }, [id])

  async function updateProcess() {
    setIsUpdating(true)
    try {
      await client.post(`/protocol/${id}`)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <button
          onClick={() => navigate("/")}
          className="mb-16 text-sm hover:text-gray-600 transition-colors cursor-pointer"
        >
          ← Back
        </button>

        <div className="mb-16">
          <div className="flex items-baseline justify-between mb-2">
            <h1 className="text-6xl font-light">{id}</h1>
            <span className="text-sm text-gray-500">
              {userCount} {userCount === 1 ? 'user' : 'users'} watching
            </span>
          </div>
          <div className="w-12 h-px bg-black"></div>
        </div>

        <div className="border border-gray-200 p-8 mb-8">
          <div className="mb-8">
            <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-2">Status</h2>
            <p className="text-lg">{wasUpdated ? "Updated" : "Monitoring"}</p>
          </div>
          
          <p className="text-sm text-gray-600 mb-8">
            {wasUpdated 
              ? "This protocol has been updated. Reload the page to see changes."
              : "You will receive a notification when this protocol is updated."
            }
          </p>

          <button
            onClick={updateProcess}
            disabled={isUpdating || wasUpdated}
            className="w-full bg-black text-white py-4 hover:bg-gray-800 transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Updating..." : wasUpdated ? "Protocol Updated" : "Update Protocol"}
          </button>
        </div>
      </div>
    </Layout>
  )
}
