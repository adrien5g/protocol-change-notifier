import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import client from "../libs/http"
import { joinProtocol, leaveProtocol, onProtocolUpdated } from "../libs/socket"
import Layout from "../components/Layout"

export default function Item() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isUpdating, setIsUpdating] = useState(false)
  const [wasUpdated, setWasUpdated] = useState(false)

  useEffect(() => {
    if (!id) return

    joinProtocol(id)

    const unsubscribe = onProtocolUpdated((data) => {
      if (data.protocol_id === Number(id)) {
        setWasUpdated(true)
      }
    })

    return () => {
      leaveProtocol(id)
      unsubscribe()
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
          className="mb-16 text-sm hover:text-gray-600 transition-colors"
        >
          ← Voltar
        </button>

        <div className="mb-16">
          <h1 className="text-6xl font-light mb-2">{id}</h1>
          <div className="w-12 h-px bg-black"></div>
        </div>

        <div className="border border-gray-200 p-8 mb-8">
          <div className="mb-8">
            <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-2">Status</h2>
            <p className="text-lg">{wasUpdated ? "Atualizado" : "Monitorando"}</p>
          </div>
          
          <p className="text-sm text-gray-600 mb-8">
            {wasUpdated 
              ? "Este protocolo foi atualizado. Recarregue a página para ver as alterações."
              : "Você receberá uma notificação quando este protocolo for atualizado."
            }
          </p>

          <button
            onClick={updateProcess}
            disabled={isUpdating || wasUpdated}
            className="w-full bg-black text-white py-4 hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Atualizando..." : wasUpdated ? "Protocolo Atualizado" : "Atualizar Protocolo"}
          </button>
        </div>
      </div>
    </Layout>
  )
}
