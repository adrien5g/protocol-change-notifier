import { Link } from "react-router-dom"
import Layout from "../components/Layout"
import client from "../libs/http"
import { useEffect, useState } from "react"

export default function ListItems() {
  const [data, setData] = useState<string[]>([])

  async function fetchData() {
    const response = await client.get("/protocols")
    setData(response.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-16">
          <h1 className="text-5xl font-light mb-2">Protocolos</h1>
          <div className="w-12 h-px bg-black"></div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-px bg-gray-200">
          {data.map((e) => (
            <Link key={e} to={`/item/${e}`}>
              <div className="bg-white hover:bg-black hover:text-white transition-colors aspect-square flex items-center justify-center cursor-pointer">
                <span className="text-2xl font-light">{e}</span>
              </div>
            </Link>
          ))}
        </div>

        {data.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400">Nenhum protocolo disponível</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
