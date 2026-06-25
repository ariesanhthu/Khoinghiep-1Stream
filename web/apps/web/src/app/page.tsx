'use client'

import { useState, useEffect, useRef } from 'react'

interface ChatMessage {
  id: string
  user: string
  avatar: string
  message: string
  timestamp: string
  platform: 'tiktok' | 'shopee' | 'youtube' | 'facebook'
  isAI?: boolean
  link?: { label: string; href: string }
}

export default function HomePage() {
  // Platform & Stats State
  const [activePlatform, setActivePlatform] = useState<'tiktok' | 'shopee' | 'youtube' | 'facebook'>('tiktok')
  const [aiAutopilot, setAiAutopilot] = useState(true)
  const [viewers, setViewers] = useState(1420)
  const [revenue, setRevenue] = useState(12840)
  const [showStreamKey, setShowStreamKey] = useState(false)

  // Interactive Live Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: 'Vicky K.',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Vicky',
      message: 'Is the Premium Hoodie still available in size L?',
      timestamp: '18:32',
      platform: 'tiktok',
    },
    {
      id: '2',
      user: 'AI Copilot',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=copilot',
      message: 'Yes, Vicky! We have 4 units left of the Premium Hoodie (L) in Navy Blue. Use voucher SEAFIRST10 for 10% off! [Buy Now - $54.00]',
      timestamp: '18:32',
      platform: 'tiktok',
      isAI: true,
      link: { label: 'Buy Now - $54.00', href: '#' },
    },
  ])
  const [userInputMessage, setUserInputMessage] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Login Form States
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginStep, setLoginStep] = useState<'form' | 'handshake' | 'redirect'>('form')

  // Audio level animation mock
  const [audioLevels, setAudioLevels] = useState([40, 20, 60, 80, 50])

  // Platform specific configurations
  const platformConfigs = {
    tiktok: {
      name: 'TikTok Shop',
      color: 'from-pink-500 to-cyan-500',
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      baseViewers: 1820,
      baseRevenue: 14240,
      conversionRate: '89.4%',
    },
    shopee: {
      name: 'Shopee Live',
      color: 'from-orange-500 to-red-500',
      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      baseViewers: 2480,
      baseRevenue: 19810,
      conversionRate: '94.2%',
    },
    youtube: {
      name: 'YouTube Live',
      color: 'from-red-600 to-rose-700',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      baseViewers: 950,
      baseRevenue: 8450,
      conversionRate: '76.8%',
    },
    facebook: {
      name: 'Facebook Live',
      color: 'from-blue-600 to-indigo-600',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      baseViewers: 1140,
      baseRevenue: 10120,
      conversionRate: '81.5%',
    },
  }

  // Handle active platform switch & recalculate mock values
  useEffect(() => {
    const config = platformConfigs[activePlatform]
    setViewers(config.baseViewers)
    setRevenue(config.baseRevenue)

    // Append greeting message for newly switched platform
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      user: 'System Bot',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=system',
      message: `Switched stream feed to ${config.name}. Connection healthy.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      platform: activePlatform,
    }
    setChatMessages((prev) => [...prev.slice(-8), newMsg])
  }, [activePlatform])

  // Periodic viewers fluctuations & audio levels changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Viewer fluctuation +/- 10
      setViewers((prev) => prev + Math.floor(Math.random() * 21) - 10)
      // Audio level simulation
      setAudioLevels(Array.from({ length: 5 }, () => Math.floor(Math.random() * 85) + 15))
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  // Auto-scrolling chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // Simulated AI autopilot automated chat incoming
  useEffect(() => {
    if (!aiAutopilot) return

    const simulatedBuyerQuestions = [
      { user: 'Dan Carter', message: 'Do you ship to Malaysia? And what is the shipping time?' },
      { user: 'Sophie Rose', message: 'Is there a bundle discount for the camera gear?' },
      { user: 'Kevin_X', message: 'How long does the battery last on the wireless mic set?' },
    ]

    const triggerSimulatedChat = () => {
      const index = Math.floor(Math.random() * simulatedBuyerQuestions.length)
      const selectedQuestion = simulatedBuyerQuestions[index]

      // Post Customer question
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const customerMsg: ChatMessage = {
        id: Date.now().toString() + '-cust',
        user: selectedQuestion.user,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${selectedQuestion.user}`,
        message: selectedQuestion.message,
        timestamp: timeStr,
        platform: activePlatform,
      }

      setChatMessages((prev) => [...prev.slice(-8), customerMsg])

      // Post AI response after 1.5s delay
      setTimeout(() => {
        let aiReply = ''
        let linkObj = undefined

        if (selectedQuestion.user.includes('Dan')) {
          aiReply = 'Yes, Dan! We support shipping across SE Asia. Shipping to Malaysia takes 3-5 business days. Use coupon SEASHIP for free shipping today!'
        } else if (selectedQuestion.user.includes('Sophie')) {
          aiReply = 'Hey Sophie! Yes, we have a Premium Studio Bundle which saves you 15% overall. Click below to add it directly to your cart!'
          linkObj = { label: 'Claim Bundle - 15% Off', href: '#' }
        } else {
          aiReply = 'Excellent question Kevin! The wireless mic battery lasts up to 10 hours of continuous recording. It also supports USB-C fast charging (2 hours full charge).'
        }

        const aiMsg: ChatMessage = {
          id: Date.now().toString() + '-ai',
          user: 'AI Copilot',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=copilot',
          message: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          platform: activePlatform,
          isAI: true,
          link: linkObj,
        }

        setChatMessages((prev) => [...prev.slice(-8), aiMsg])
        setRevenue((prev) => prev + Math.floor(Math.random() * 120) + 40)
      }, 1800)
    }

    // Trigger every 12 seconds
    const chatInterval = setInterval(triggerSimulatedChat, 12000)
    return () => clearInterval(chatInterval)
  }, [aiAutopilot, activePlatform])

  // Custom User Input Message Submission
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInputMessage.trim()) return

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg: ChatMessage = {
      id: Date.now().toString() + '-user',
      user: 'You (Streamer)',
      avatar: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=you',
      message: userInputMessage,
      timestamp: timeStr,
      platform: activePlatform,
    }

    setChatMessages((prev) => [...prev.slice(-8), userMsg])
    const savedMsg = userInputMessage
    setUserInputMessage('')

    // If AI Autopilot is active, trigger an automated AI response to the custom query
    if (aiAutopilot) {
      setTimeout(() => {
        let aiReply = `Received your message: "${savedMsg}". I am currently analyzing your stream metrics to optimize live sales. Ready for automated checkout!`
        let linkObj = undefined

        const lowerMsg = savedMsg.toLowerCase()
        if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('how much')) {
          aiReply = 'Our exclusive livestream pricing today offers the best rates globally! Premium bundles start at just $49.00 with flash discount code LIVESALE.'
          linkObj = { label: 'Unlock Livestream Deal', href: '#' }
        } else if (lowerMsg.includes('discount') || lowerMsg.includes('code') || lowerMsg.includes('voucher') || lowerMsg.includes('coupon')) {
          aiReply = 'Active code detected! Use coupon code LIVESPRING at checkout to save an extra 15% on any selected item. Code expires at the end of this stream.'
          linkObj = { label: 'Apply Coupon', href: '#' }
        } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
          aiReply = 'Hello there! Welcome to Sea Livestream! I am your AI sales agent. Ask me anything about our products, and I will help you with instant transactions!'
        }

        const aiMsg: ChatMessage = {
          id: Date.now().toString() + '-ai-resp',
          user: 'AI Copilot',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=copilot',
          message: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          platform: activePlatform,
          isAI: true,
          link: linkObj,
        }

        setChatMessages((prev) => [...prev.slice(-8), aiMsg])
        setRevenue((prev) => prev + Math.floor(Math.random() * 80) + 20)
      }, 1500)
    }
  }

  // Handle Form Submission
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput || !passwordInput) return

    setIsSubmitting(true)
    setLoginStep('handshake')

    // Simulate standard OIDC handshake or backend forwarding
    setTimeout(() => {
      setLoginStep('redirect')
      setTimeout(() => {
        // Redirect directly to backend bypass endpoint to log in
        window.location.href = '/api/auth/bypass'
      }, 800)
    }, 1800)
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden font-sans flex flex-col md:flex-row">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none animate-pulse" />
      
      {/* Background grid overlay */}
      <div 
        className="absolute inset-0 bg-repeat pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* LEFT SIDE: Interactive Product Mockup & Livestream Monitor (60% Width on desktop) */}
      <div className="flex-1 md:w-[60%] flex flex-col justify-center p-6 md:p-12 lg:p-16 relative z-10">
        
        {/* Quote / Highlight header */}
        <div className="mb-6 hidden lg:block">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-950/40 border border-blue-800/30 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />
            Active Sales Hub
          </span>
        </div>

        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400 bg-clip-text text-transparent mb-3 leading-tight max-w-xl">
          Broadcast Globally, Convert Instantly.
        </h2>
        <p className="text-slate-400 text-sm lg:text-base font-normal max-w-lg mb-8 leading-relaxed">
          Sea Livestream connects TikTok, Shopee, and social storefronts into a single dashboard. 
          Supercharge your checkouts using real-time AI sales autopilot.
        </p>

        {/* --- INTERACTIVE MONITOR CONTAINER --- */}
        <div className="w-full max-w-2xl bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl ring-1 ring-white/5 overflow-hidden">
          
          {/* Header of the Monitor */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Stream Status: Live</span>
              <span className="text-slate-500 text-xs px-2 border-l border-white/10">{platformConfigs[activePlatform].name}</span>
            </div>

            {/* Platform Selector buttons */}
            <div className="flex items-center gap-1 bg-slate-950/60 p-1 border border-white/5 rounded-xl">
              {(['tiktok', 'shopee', 'youtube', 'facebook'] as const).map((platform) => (
                <button
                  key={platform}
                  onClick={() => setActivePlatform(platform)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 ${
                    activePlatform === platform 
                      ? 'bg-slate-800 text-white shadow-md ring-1 ring-white/10' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  <span className="capitalize">{platform === 'facebook' ? 'FB' : platform === 'youtube' ? 'YT' : platform}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid layout inside monitor */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Left Box: Video Player Mockup & Key (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              
              {/* Fake Video Player Screen */}
              <div className="relative aspect-video rounded-2xl bg-slate-950 overflow-hidden border border-white/5 group shadow-inner">
                {/* Simulated Stream Stream Background Image / Pattern */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-950/80 via-slate-950 to-purple-950/80">
                  <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px]" />
                  <div className="z-10 flex flex-col items-center gap-2">
                    {/* Glowing Mic/Streaming SVG */}
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-4 ring-indigo-500/10">
                      <svg className="h-6 w-6 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Video Capture Active</span>
                  </div>
                </div>

                {/* Video Overlays */}
                <div className="absolute inset-x-0 top-0 p-3 flex justify-between items-start z-10">
                  <span className="px-2 py-1 bg-red-600/90 text-white rounded text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 shadow-md shadow-red-900/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                    REC 00:42:15
                  </span>
                  
                  <span className="px-2 py-1 bg-slate-900/80 backdrop-blur-md text-[10px] font-semibold text-slate-300 rounded flex items-center gap-1 border border-white/5">
                    <svg className="h-3 w-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                    {viewers.toLocaleString()} Viewers
                  </span>
                </div>

                {/* Bottom Video Overlays */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between z-10">
                  <div className="flex items-center gap-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase border ${platformConfigs[activePlatform].badgeColor}`}>
                      {platformConfigs[activePlatform].name}
                    </span>
                  </div>
                  {/* Fake Audio EQ meters */}
                  <div className="flex items-end gap-0.5 h-3">
                    {audioLevels.map((lvl, i) => (
                      <div 
                        key={i} 
                        style={{ height: `${lvl}%` }} 
                        className="w-0.5 bg-gradient-to-t from-indigo-400 to-emerald-400 rounded-t transition-all duration-300"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Stream Key Setup */}
              <div className="bg-slate-950/70 border border-white/5 rounded-2xl p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">RTMP Stream Settings</span>
                  <button 
                    onClick={() => setShowStreamKey(!showStreamKey)}
                    className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                  >
                    {showStreamKey ? 'Hide Key' : 'Reveal Key'}
                  </button>
                </div>
                <div className="grid grid-cols-12 gap-1.5 items-center">
                  <input
                    type="text"
                    readOnly
                    value="rtmp://live.sea.io/app/sales"
                    className="col-span-7 bg-slate-900 border border-white/5 rounded-lg px-2 py-1 text-[10px] text-slate-400 font-mono outline-none"
                  />
                  <input
                    type="text"
                    readOnly
                    value={showStreamKey ? 'live_13998_sea_key_k82y9w' : '•••••••••••••••••••••'}
                    className="col-span-5 bg-slate-900 border border-white/5 rounded-lg px-2 py-1 text-[10px] text-slate-400 font-mono outline-none"
                  />
                </div>
              </div>

              {/* Real-time Sales Graph Mockup */}
              <div className="bg-slate-950/70 border border-white/5 rounded-2xl p-3 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Conversion Analytics</span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    AI Auto-Sales: ON
                  </span>
                </div>
                
                {/* SVG Area chart */}
                <div className="w-full h-12 relative overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Shimmer line */}
                    <path
                      d="M 0 50 Q 30 20 60 40 T 120 15 T 160 30 T 200 10 L 200 60 L 0 60 Z"
                      fill="url(#chartGlow)"
                    />
                    <path
                      d="M 0 50 Q 30 20 60 40 T 120 15 T 160 30 T 200 10"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="2"
                    />
                  </svg>
                  {/* Floating neon dot */}
                  <div className="absolute top-[8px] right-[2px] h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
                  <div className="absolute top-[10px] right-[4px] h-1.5 w-1.5 rounded-full bg-indigo-500" />
                </div>
              </div>

            </div>

            {/* Right Box: Chat & AI Copilot Panel (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              
              {/* Autopilot toggle control card */}
              <div className="bg-slate-950/70 border border-white/5 rounded-2xl p-3.5 flex flex-col gap-2 shadow-sm ring-1 ring-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center shadow">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-bold text-slate-200">AI Sales Agent</span>
                  </div>
                  
                  {/* Switch */}
                  <button 
                    onClick={() => setAiAutopilot(!aiAutopilot)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                      aiAutopilot ? 'bg-indigo-600' : 'bg-slate-800'
                    }`}
                  >
                    <span 
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        aiAutopilot ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between text-[9px] text-slate-500">
                  <span>Status:</span>
                  <span className={`font-bold transition-colors ${aiAutopilot ? 'text-indigo-400' : 'text-amber-500'}`}>
                    {aiAutopilot ? '• AUTO-PILOT RUNNING' : '• STANDBY (MANUAL)'}
                  </span>
                </div>
              </div>

              {/* Chat Monitor Board */}
              <div className="flex-1 min-h-[220px] bg-slate-950/90 border border-white/5 rounded-2xl p-3 flex flex-col justify-between">
                
                {/* Chat Header */}
                <div className="pb-2 border-b border-white/5 flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Live Customer Feed</span>
                  <div className="flex items-center gap-1 text-[9px] text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    AI Analyzing
                  </div>
                </div>

                {/* Chat Message Scrollable Container */}
                <div className="flex-1 overflow-y-auto py-2 pr-1 space-y-2.5 max-h-[200px] scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  {chatMessages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col gap-1 text-[11px] leading-relaxed transition-all duration-300 ${
                        msg.isAI ? 'bg-indigo-950/40 border border-indigo-500/20 rounded-xl p-2 animate-fadeIn' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <img 
                            src={msg.avatar} 
                            alt={msg.user} 
                            className="h-4.5 w-4.5 rounded-full bg-slate-800 border border-white/10" 
                          />
                          <span className={`font-semibold ${msg.isAI ? 'text-indigo-300 font-bold' : 'text-slate-300'}`}>
                            {msg.user}
                          </span>
                          {msg.isAI && (
                            <span className="text-[8px] uppercase font-black bg-indigo-500/20 text-indigo-400 px-1 rounded border border-indigo-500/30">
                              AI
                            </span>
                          )}
                        </div>
                        <span className="text-[8px] text-slate-500 font-mono">{msg.timestamp}</span>
                      </div>
                      <p className="text-slate-400 font-normal pl-0.5">{msg.message}</p>
                      
                      {/* Fake Interactive button within simulated chat */}
                      {msg.link && (
                        <div className="mt-1 pl-0.5">
                          <a 
                            href={msg.link.href} 
                            onClick={(e) => { e.preventDefault(); setRevenue(prev => prev + 54) }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded text-[9px] transition shadow-md shadow-indigo-950"
                          >
                            {msg.link.label}
                            <svg className="h-2 w-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Feed Input Form */}
                <form onSubmit={handleSendMessage} className="pt-2 border-t border-white/5 flex gap-1">
                  <input
                    type="text"
                    value={userInputMessage}
                    onChange={(e) => setUserInputMessage(e.target.value)}
                    placeholder="Type buyer query to test AI..."
                    className="flex-1 bg-slate-900 border border-white/5 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 placeholder-slate-600 outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all font-normal"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 transition px-2.5 rounded-lg text-white text-[11px] font-bold shadow-md shadow-indigo-950 flex items-center justify-center shrink-0"
                  >
                    Send
                  </button>
                </form>

              </div>

            </div>

          </div>

          {/* Quick Metrics Footer grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/5">
            <div className="bg-slate-950/50 p-2.5 border border-white/5 rounded-xl">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Estimated Revenue</span>
              <span className="text-sm font-black text-slate-200 tracking-tight transition-all duration-300">
                ${revenue.toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-950/50 p-2.5 border border-white/5 rounded-xl">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Active Viewers</span>
              <span className="text-sm font-black text-slate-200 tracking-tight transition-all duration-300">
                {viewers.toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-950/50 p-2.5 border border-white/5 rounded-xl">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Conversion Rate</span>
              <span className="text-sm font-black text-indigo-400 tracking-tight">
                {platformConfigs[activePlatform].conversionRate}
              </span>
            </div>
            <div className="bg-slate-950/50 p-2.5 border border-white/5 rounded-xl">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Connected Storefront</span>
              <span className="text-xs font-bold text-slate-300 truncate tracking-wide flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Linked
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* RIGHT SIDE: Dedicated Access Portal / Glassmorphic Authentication (40% Width on desktop) */}
      <div className="flex-1 md:w-[40%] flex flex-col items-center justify-center p-6 md:p-12 lg:p-16 border-t md:border-t-0 md:border-l border-white/5 bg-slate-950/80 backdrop-blur-3xl relative z-10">
        
        <div className="w-full max-w-sm flex flex-col gap-8">
          
          {/* Brand Logo & Header */}
          <div className="flex flex-col items-center text-center">
            {/* Animated pulsing Logo */}
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 shadow-xl shadow-indigo-500/20 ring-1 ring-white/15 animate-pulse duration-[4000ms]">
              <svg
                className="h-7 w-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-center bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400 bg-clip-text text-transparent leading-none">
              Sea Livestream
            </h1>
            <p className="mt-2 text-xs text-slate-500 font-medium uppercase tracking-widest">
              Professional Stream Workspace
            </p>
          </div>

          {/* MAIN GLASSMORPHIC CARD */}
          <div className="w-full bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 shadow-2xl ring-1 ring-white/10 relative overflow-hidden">
            
            {/* Ambient border gradient lights */}
            <div className="absolute top-0 right-0 h-[1px] w-24 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
            <div className="absolute bottom-0 left-0 h-[1px] w-24 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

            {/* STEP 1: Main interactive Auth Form */}
            {loginStep === 'form' && (
              <div className="flex flex-col gap-5">
                <div className="text-center">
                  <h3 className="text-base font-bold text-slate-200 tracking-wide">
                    Access Workspace
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Sign in to your streaming profile.
                  </p>
                </div>

                {/* Mock inputs with high visual specs */}
                <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="streamer@sea.com"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-normal"
                      />
                      {emailInput.includes('@') && emailInput.includes('.') && (
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 flex text-emerald-400">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Security Password</label>
                    </div>
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-normal"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-950/30 hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Authenticate Session
                  </button>
                </form>

                {/* Separator OR */}
                <div className="flex items-center my-1.5">
                  <div className="flex-1 border-t border-white/5" />
                  <span className="px-3 text-[9px] text-slate-500 font-bold uppercase tracking-widest">or integrate</span>
                  <div className="flex-1 border-t border-white/5" />
                </div>

                <div className="flex flex-col gap-2.5">
                  {/* Google OAuth Button */}
                  <a
                    href="/api/auth/google"
                    className="group relative flex items-center justify-center gap-2.5 px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-50 border border-white/10 rounded-xl font-bold text-xs transition-all duration-300 shadow-md shadow-white/5 hover:shadow-white/10 transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                      <g transform="matrix(1, 0, 0, 1, 0, 0)">
                        <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.48C21.68,11.75 21.56,11.4 21.35,11.1z" fill="#4285F4" />
                        <path d="M12,20.85c2.4,0 4.4,-0.8 5.88,-2.16l-3.3,-2.58c-0.9,0.6 -2.07,0.97 -3.58,0.97c-2.75,0 -5.08,-1.86 -5.92,-4.36H1.67v2.67C3.14,18.3 7.3,20.85 12,20.85z" fill="#34A853" />
                        <path d="M6.08,12.72c-0.21,-0.64 -0.33,-1.32 -0.33,-2.02s0.12,-1.38 0.33,-2.02V6.01H1.67c-0.72,1.44 -1.13,3.07 -1.13,4.79s0.41,3.35 1.13,4.79L6.08,12.72z" fill="#FBBC05" />
                        <path d="M12,5.2c1.3,0 2.47,0.45 3.39,1.33l2.54,-2.54C16.4,2.6 14.4,1.8 12,1.8C7.3,1.8 3.14,4.35 1.67,7.02l4.41,2.67c0.84,-2.5 3.17,-4.36 5.92,-4.36z" fill="#EA4335" />
                      </g>
                    </svg>
                    <span>Sign in with Google</span>
                  </a>

                  {/* Developer Sandbox Bypass Button */}
                  <a
                    href="/api/auth/bypass"
                    className="group relative flex items-center justify-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:from-blue-600/20 hover:to-purple-600/20 border border-blue-500/20 hover:border-blue-500/40 rounded-xl font-bold text-blue-400 hover:text-blue-300 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-blue-900/5"
                  >
                    <svg
                      className="h-4.5 w-4.5 text-blue-400 group-hover:text-blue-300 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                    <span>Developer Sandbox Bypass</span>
                    
                    {/* Pulsing indicator */}
                    <span className="absolute right-4.5 top-1/2 -translate-y-1/2 flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                    </span>
                  </a>
                </div>
              </div>
            )}

            {/* STEP 2: Loading State and Handshake Animation */}
            {loginStep === 'handshake' && (
              <div className="flex flex-col items-center justify-center py-10 gap-5 text-center animate-fadeIn">
                <div className="relative flex items-center justify-center">
                  <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-indigo-500" />
                  <svg className="absolute h-6 w-6 text-indigo-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-sm font-bold text-slate-200">Securing Remote Handshake</h4>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Generating bypass token for {emailInput}...
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: Complete & Redirection */}
            {loginStep === 'redirect' && (
              <div className="flex flex-col items-center justify-center py-10 gap-5 text-center animate-scaleUp">
                <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-bold text-slate-200">Sandbox Access Granted</h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Redirecting to Sea Studio Workspace...
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Bottom regulatory / footer information */}
          <div className="text-center flex flex-col gap-2">
            <p className="text-[10px] text-slate-600 font-semibold tracking-wide">
              Sea Hackathon © 2026 • Local Sandbox
            </p>
            <div className="flex justify-center gap-3 text-[9px] text-slate-500 font-medium">
              <a href="#" className="hover:text-slate-400 transition">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-400 transition">Privacy Standard</a>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
