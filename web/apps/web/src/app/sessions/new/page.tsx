'use client'

import { useState, type ChangeEvent } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import type { Platform } from '@sea/contracts'

interface PlatformOption {
  platformConnectionId: string
  platform: Platform
  rtmpUrl: string
  streamKey: string
}

export default function NewSessionPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [platforms, setPlatforms] = useState<PlatformOption[]>([])
  const [loading, setLoading] = useState(false)

  const addPlatform = () => {
    setPlatforms([
      ...platforms,
      {
        platformConnectionId: '',
        platform: 'youtube',
        rtmpUrl: '',
        streamKey: '',
      },
    ])
  }

  const updatePlatform = (index: number, field: keyof PlatformOption, value: string) => {
    const updated = [...platforms]
    updated[index] = { ...updated[index], [field]: value }
    setPlatforms(updated)
  }

  const removePlatform = (index: number) => {
    setPlatforms(platforms.filter((_, i) => i !== index))
  }

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => setTitle((e.target as any).value)

  const create = async () => {
    setLoading(true)
    try {
      const session = await api.post('/sessions', {
        title,
        platforms: platforms.map((p) => ({
          platformConnectionId: p.platformConnectionId || crypto.randomUUID(),
          rtmpUrl: p.rtmpUrl,
          streamKey: p.streamKey,
        })),
      })
      router.push(`/studio/${session.id}`)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">New Session</h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={onTitleChange}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="My livestream session"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-300">Platforms</label>
            <button
              onClick={addPlatform}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              + Add platform
            </button>
          </div>
          {platforms.map((p, i) => (
            <div key={i} className="p-4 bg-gray-900 rounded-lg border border-gray-800 mb-3">
              <div className="flex justify-between items-center mb-3">
                <select
                  value={p.platform}
                  onChange={(e) => updatePlatform(i, 'platform', (e.target as any).value)}
                  className="px-3 py-1 bg-gray-800 border border-gray-700 rounded"
                >
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="facebook">Facebook</option>
                  <option value="shopee">Shopee</option>
                </select>
                <button
                  onClick={() => removePlatform(i)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                value={p.rtmpUrl}
                onChange={(e) => updatePlatform(i, 'rtmpUrl', (e.target as any).value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded mb-2 text-sm"
                placeholder="RTMP URL (e.g. rtmp://a.rtmp.youtube.com/live2)"
              />
              <input
                type="text"
                value={p.streamKey}
                onChange={(e) => updatePlatform(i, 'streamKey', (e.target as any).value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm"
                placeholder="Stream key"
              />
            </div>
          ))}
        </div>

        <button
          onClick={create}
          disabled={!title || loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
        >
          {loading ? 'Creating...' : 'Create Session'}
        </button>
      </div>
    </div>
  )
}
