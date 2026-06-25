import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { AppLayout } from '@/components/layout/AppLayout'
import { LivePreviewLayout } from '@/components/layout/LivePreviewLayout'
import { ProtectedRoute } from './ProtectedRoute'

import { LandingPage } from '@/pages/public/LandingPage'
import { LoginPage } from '@/pages/public/LoginPage'
import { PlatformCallbackPage } from '@/pages/public/PlatformCallbackPage'

import { DashboardPage } from '@/pages/app/DashboardPage'
import { SubscriptionPage } from '@/pages/app/SubscriptionPage'
import { ProductsPage } from '@/pages/app/ProductsPage'
import { VoicesPage } from '@/pages/app/VoicesPage'
import { ModelsPage } from '@/pages/app/ModelsPage'
import { PlatformsPage } from '@/pages/app/PlatformsPage'
import { LivePreviewPage } from '@/pages/app/live/LivePreviewPage'
import { LiveSetupPage } from '@/pages/app/live/LiveSetupPage'
import { LiveDashboardPage } from '@/pages/app/live/LiveDashboardPage'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [{ path: '/', element: <LandingPage /> }],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/connect/:platform/callback', element: <PlatformCallbackPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <LivePreviewLayout />,
        children: [
          { path: '/live/preview', element: <LivePreviewPage /> },
        ],
      },
      {
        element: <AppLayout />,
        children: [
          { path: '/app', element: <Navigate to="/live/preview" replace /> },
          { path: '/live', element: <Navigate to="/live/preview" replace /> },
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/subscription', element: <SubscriptionPage /> },
          { path: '/products', element: <ProductsPage /> },
          { path: '/voices', element: <VoicesPage /> },
          { path: '/models', element: <ModelsPage /> },
          { path: '/platforms', element: <PlatformsPage /> },
          { path: '/live/setup', element: <LiveSetupPage /> },
          { path: '/live/dashboard', element: <LiveDashboardPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
