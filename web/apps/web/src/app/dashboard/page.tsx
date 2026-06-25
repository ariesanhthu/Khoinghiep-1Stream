'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import Link from 'next/link'

interface Session {
  id: string
  title: string
  status: string
  scheduledAt: string | null
  startedAt: string | null
  rtmpInputKey: string
}

interface UserProfile {
  id: string
  email: string
  name: string
  avatar: string | null
}

interface Connection {
  id: string
  platform: 'youtube' | 'tiktok' | 'facebook' | 'shopee'
  platformUsername: string | null
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Parallel data loading
    Promise.all([
      api.get('/sessions').catch(() => []),
      api.get('/platform').catch(() => []),
      api.get('/auth/me').catch(() => null),
    ])
      .then(([sessionsData, connectionsData, userData]) => {
        setSessions(sessionsData)
        setConnections(connectionsData)
        setUser(userData)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Calculate live sessions count
  const liveSessionsCount = sessions.filter((s) => s.status === 'live').length

  return (
    <div className="relative min-h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Header / Profile Navigation Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 mb-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            {/* Pulsing Studio Icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 shadow-md shadow-blue-500/10 ring-1 ring-white/10">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Workspace</span>
              <h1 className="text-2xl font-bold tracking-tight text-white">Sea Studio</h1>
            </div>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-center">
            {/* Platform Settings Link */}
            <Link
              href="/settings/platforms"
              className="group flex items-center gap-2 px-4 py-2 bg-gray-900/50 hover:bg-gray-900 border border-white/5 hover:border-white/10 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-all duration-300"
            >
              <svg className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Connections</span>
            </Link>

            {/* Profile Avatar Widget */}
            <div className="flex items-center gap-3 pl-4 border-l border-white/5">
              <div className="relative h-9 w-9 rounded-full overflow-hidden border border-white/10 bg-gray-800">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-blue-500/20 to-purple-500/20 text-xs font-semibold text-blue-300 capitalize">
                    {user?.name?.[0] ?? 'D'}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-gray-950" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-white leading-tight">{user?.name ?? 'Developer'}</p>
                <p className="text-xs text-gray-500 leading-none mt-0.5">{user?.email ?? 'dev@sea.com'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Analytics Summary Banner / KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Total Reach */}
          <div className="relative overflow-hidden bg-gray-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-lg shadow-black/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-400">Total Stream Reach</span>
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">142.8K</h3>
            <p className="text-xs text-green-400 font-medium flex items-center gap-1 mt-1">
              <span>+12.4%</span>
              <span className="text-gray-500 font-normal">from last session</span>
            </p>
          </div>

          {/* Card 2: Connected Channels */}
          <div className="relative overflow-hidden bg-gray-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-lg shadow-black/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-400">Integrations</span>
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l-2.084 1.157a1 1 0 000 1.738l2.084 1.157m0-4.052a1 1 0 000 1.738L10.768 12m0 0l2.084 1.157a1 1 0 001.738 0l2.084-1.157m-5.906-4.052a1 1 0 000-1.738L8.684 4.076M12 8.684l2.084-1.157a1 1 0 000-1.738L12 4.076m0 0L9.916 5.234a1 1 0 000 1.738L12 8.684z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {connections.length} <span className="text-sm font-normal text-gray-500">/ 4 connected</span>
            </h3>
            <div className="flex gap-1.5 mt-2">
              {['youtube', 'tiktok', 'facebook', 'shopee'].map((plat) => {
                const isConnected = connections.some((c) => c.platform === plat)
                return (
                  <span
                    key={plat}
                    className={`h-2.5 w-2.5 rounded-full ${
                      isConnected ? 'bg-green-500 ring-2 ring-green-950' : 'bg-gray-800'
                    }`}
                    title={`${plat}: ${isConnected ? 'Connected' : 'Disconnected'}`}
                  />
                )
              })}
            </div>
          </div>

          {/* Card 3: Total Orders */}
          <div className="relative overflow-hidden bg-gray-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-lg shadow-black/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-400">Total Live Orders</span>
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">389</h3>
            <p className="text-xs text-green-400 font-medium flex items-center gap-1 mt-1">
              <span>+8.2%</span>
              <span className="text-gray-500 font-normal">conversion rate</span>
            </p>
          </div>

          {/* Card 4: Est. Revenue */}
          <div className="relative overflow-hidden bg-gray-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-lg shadow-black/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-400">Synchronized Revenue</span>
              <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">$12,450.00</h3>
            <p className="text-xs text-orange-400 font-medium flex items-center gap-1 mt-1">
              <span>★ High</span>
              <span className="text-gray-500 font-normal">sales volume today</span>
            </p>
          </div>
        </section>

        {/* Section Title & Primary Action */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Livestream Sessions</h2>
              <p className="text-sm text-gray-400">Create, schedule, or manage your multi-platform broadcast events.</p>
            </div>
            <Link
              href="/sessions/new"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-md shadow-blue-600/15 hover:shadow-blue-500/20 text-white rounded-xl font-semibold text-sm transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Session</span>
            </Link>
          </div>
        </section>

        {/* Active Streams Alert Notification Banner */}
        {liveSessionsCount > 0 && (
          <div className="relative overflow-hidden mb-6 bg-gradient-to-r from-green-950/40 via-emerald-950/20 to-transparent border border-green-500/30 rounded-2xl p-4 flex items-center justify-between gap-4 animate-pulse duration-[4000ms]">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <p className="text-sm text-green-300 font-medium">
                You have <span className="font-bold underline">{liveSessionsCount}</span> livestream session(s) currently broadcasting live!
              </p>
            </div>
            <span className="text-xs text-green-400 uppercase tracking-widest font-semibold hidden md:block">Active Room</span>
          </div>
        )}

        {/* Sessions Content Loader / Grid List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            {/* Spinning Custom Loader */}
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm animate-pulse">Loading workspace files...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="relative overflow-hidden border border-white/5 rounded-3xl bg-gray-900/20 backdrop-blur-sm p-12 text-center py-20">
            {/* Ambient inner glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-center mb-4 text-gray-600">
              <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white tracking-wide mb-1">No Broadcasts Found</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
              You haven't set up any livestream sessions. Connect your social channels and launch your first multi-platform broadcast event.
            </p>
            <Link
              href="/sessions/new"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>Set up your first session</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((s) => {
              const isLive = s.status === 'live'
              const isEnded = s.status === 'ended'
              
              return (
                <Link
                  key={s.id}
                  href={`/studio/${s.id}`}
                  className={`group relative flex flex-col justify-between overflow-hidden p-6 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 ${
                    isLive
                      ? 'bg-gradient-to-br from-green-950/20 to-gray-900/60 border-green-500/20 hover:border-green-500/40 shadow-lg shadow-green-950/10 hover:shadow-green-500/5'
                      : isEnded
                      ? 'bg-gray-900/20 hover:bg-gray-900/30 border-white/5 hover:border-white/10 opacity-70 hover:opacity-100'
                      : 'bg-gray-900/40 border-white/5 hover:border-white/10 hover:shadow-xl hover:shadow-indigo-500/5'
                  }`}
                >
                  {/* Status Gradient Glow Border (Hover Effect) */}
                  <div className={`absolute inset-x-0 top-0 h-[2px] transition-opacity opacity-0 group-hover:opacity-100 ${
                    isLive ? 'bg-green-500' : isEnded ? 'bg-gray-500' : 'bg-gradient-to-r from-blue-500 to-purple-600'
                  }`} />

                  <div>
                    {/* Status Pill Badge & Title */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full ${
                        isLive
                          ? 'bg-green-900/50 text-green-300 ring-1 ring-green-500/30 animate-pulse'
                          : isEnded
                          ? 'bg-gray-800 text-gray-400'
                          : 'bg-yellow-900/50 text-yellow-300 ring-1 ring-yellow-500/20'
                      }`}>
                        {s.status}
                      </span>
                      
                      {/* Active indicator dot */}
                      {isLive && (
                        <span className="flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-blue-300 tracking-wide transition-colors line-clamp-2">
                      {s.title}
                    </h3>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4,8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h2m4 0h2" />
                      </svg>
                      <code className="text-gray-400 font-mono tracking-wider">{s.rtmpInputKey}</code>
                    </div>
                    
                    {/* Enter Button Indicator */}
                    <span className="flex items-center gap-1 font-semibold text-blue-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                      <span>Studio</span>
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
