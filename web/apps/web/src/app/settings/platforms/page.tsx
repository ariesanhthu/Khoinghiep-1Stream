'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import type { Platform } from '@sea/contracts'

interface Connection {
  id: string
  platform: Platform
  platformUsername: string | null
  createdAt: string
}

const PLATFORMS: Platform[] = ['youtube', 'tiktok', 'facebook', 'shopee']

export default function PlatformsPage() {
  const router = useRouter()
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api
      .get('/platform')
      .then(setConnections)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const connect = (platform: Platform) => {
    router.push(`/api/platform/connect/${platform}`)
  }

  const disconnect = async (id: string) => {
    await api.delete(`/platform/${id}`)
    load()
  }

  const connectedPlatforms = new Set(connections.map((c) => c.platform))

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Platform Connections</h1>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="space-y-4">
          {PLATFORMS.map((platform) => {
            const conn = connections.find((c) => c.platform === platform)
            return (
              <div
                key={platform}
                className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-800"
              >
                <div>
                  <h3 className="font-semibold capitalize">{platform}</h3>
                  {conn && (
                    <p className="text-sm text-gray-400">
                      Connected as {conn.platformUsername ?? 'Unknown'}
                    </p>
                  )}
                </div>
                {conn ? (
                  <button
                    onClick={() => disconnect(conn.id)}
                    className="px-4 py-2 text-sm bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => connect(platform)}
                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
