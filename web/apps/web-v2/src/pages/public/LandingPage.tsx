import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Sparkles,
  Play,
  Package,
  Mic2,
  Video,
  Check,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  ChevronDown,
  Users,
  Award,
  Zap,
  Phone,
  Mail,
  MapPin,
  Laptop,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn, formatVND } from '@/lib/utils'
import { useSubscriptionStore } from '@/store/subscriptionStore'
import { PLATFORM_META } from '@/types'
import type { PlatformId, PlanId } from '@/types'
import { toast } from '@/components/ui/sonner'

interface ChatMessage {
  id: string
  user: string
  avatar: string
  message: string
  timestamp: string
  platform: PlatformId
  isAI?: boolean
  link?: { label: string; href: string }
}

const BRAND_PLATFORMS = [
  { name: 'TikTok Shop', color: '#fe2c55', bg: 'bg-[#fe2c55]/10', text: 'text-[#fe2c55]', id: 'tiktok' as PlatformId },
  { name: 'Shopee Live', color: '#ee4d2d', bg: 'bg-[#ee4d2d]/10', text: 'text-[#ee4d2d]', id: 'shopee' as PlatformId },
  { name: 'Facebook Live', color: '#1877f2', bg: 'bg-[#1877f2]/10', text: 'text-[#1877f2]', id: 'facebook' as PlatformId },
  { name: 'YouTube Live', color: '#ff0000', bg: 'bg-[#ff0000]/10', text: 'text-[#ff0000]', id: 'youtube' as PlatformId },
]

const INTRO_CAPABILITIES = [
  {
    icon: Sparkles,
    title: 'Nói chuyện tự nhiên như người thật',
    desc: 'Hệ thống chuyển đổi kịch bản văn bản thành giọng nói A.I với ngữ điệu sinh động, cảm xúc chân thực và khẩu hình đồng bộ tự nhiên.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: MessageSquare,
    title: 'Tương tác trực tiếp với người xem',
    desc: 'A.I có khả năng tự động đọc và phản hồi bình luận real-time theo kịch bản thiết lập sẵn, tạo tương tác hai chiều nhịp nhàng.',
    color: 'from-sky-500 to-blue-500',
  },
  {
    icon: Clock,
    title: 'Phát sóng 24/7, không gián đoạn',
    desc: 'Duy trì livestream liên tục suốt ngày đêm không mệt mỏi, không lo mất năng lượng, phù hợp với mọi múi giờ và chiến dịch.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Laptop,
    title: 'Đa nền tảng – Một lần thiết lập',
    desc: 'Cấu hình đơn giản một lần, tự động phát luồng song song lên TikTok, Shopee, Facebook, YouTube cùng lúc giúp tiếp cận tối đa khách hàng.',
    color: 'from-emerald-500 to-teal-500',
  },
]

const STEPS_WORKFLOW = [
  {
    step: '01',
    title: 'Nhập kịch bản nội dung',
    desc: 'Người dùng soạn sẵn nội dung hoặc để trợ lý AI (tích hợp ChatGPT) tự động viết kịch bản livestream thu hút từ thông tin, thuộc tính của sản phẩm.',
    visualTitle: 'Trình soạn kịch bản AI',
    visualContent: (
      <div className="space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2 border-b border-border/40 pb-2">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          <span className="text-muted-foreground">Kich_Ban_Ban_Ao_Thun.txt</span>
        </div>
        <div className="space-y-1.5 text-muted-foreground">
          <p><span className="text-primary font-bold">[Mở đầu]</span> Chào mọi người nhé! Hôm nay em mang đến một cực phẩm áo thun cotton 100% cực mát...</p>
          <p className="text-foreground bg-primary/10 p-1.5 rounded border border-primary/20"><span className="text-primary font-bold">[Ưu đãi]</span> Áo thun này hiện đang giảm mạnh 30% duy nhất trên sóng live hôm nay! Chỉ còn 149k thui ạ!</p>
          <p><span className="text-primary font-bold">[Tương tác]</span> Ai muốn tư vấn size thì comment chiều cao cân nặng giúp em nha!</p>
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground bg-muted p-2 rounded">
          <span>✍️ AI đã tạo kịch bản bán hàng tự động</span>
          <span className="text-primary font-semibold">Tối ưu hóa thành công</span>
        </div>
      </div>
    )
  },
  {
    step: '02',
    title: 'Chọn nhân vật ảo (A.I Avatar)',
    desc: 'Lựa chọn từ thư viện hơn 50+ avatar nam/nữ đa dạng quốc tịch, độ tuổi, trang phục hoặc yêu cầu nhân bản độc quyền chính gương mặt của doanh nghiệp bạn.',
    visualTitle: 'Thư viện Người mẫu A.I',
    visualContent: (
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="border border-primary bg-primary/5 rounded-lg p-2 flex flex-col items-center gap-1.5 text-center relative overflow-hidden">
          <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-green-500" />
          <div className="h-10 w-10 rounded-full bg-slate-200 border border-primary/20 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Mai" alt="Mai" />
          </div>
          <span className="font-semibold">Mai Anh</span>
          <span className="text-[9px] text-muted-foreground">Giọng Việt Bắc</span>
        </div>
        <div className="border border-border rounded-lg p-2 flex flex-col items-center gap-1.5 text-center hover:bg-muted/40 transition-colors cursor-pointer">
          <div className="h-10 w-10 rounded-full bg-slate-200 border border-border overflow-hidden">
            <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Quoc" alt="Quoc" />
          </div>
          <span className="font-semibold">Quốc Tuấn</span>
          <span className="text-[9px] text-muted-foreground">Giọng Việt Nam</span>
        </div>
        <div className="border border-border rounded-lg p-2 flex flex-col items-center gap-1.5 text-center hover:bg-muted/40 transition-colors cursor-pointer">
          <div className="h-10 w-10 rounded-full bg-slate-200 border border-border overflow-hidden">
            <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Elena" alt="Elena" />
          </div>
          <span className="font-semibold">Elena</span>
          <span className="text-[9px] text-muted-foreground">Giọng Anh-Mỹ</span>
        </div>
        <div className="col-span-3 border border-dashed border-border rounded-lg p-2 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Tạo Custom Digital Human riêng của bạn</span>
        </div>
      </div>
    )
  },
  {
    step: '03',
    title: 'A.I xử lý & Lên sóng',
    desc: 'Hệ thống tự động đồng bộ khẩu hình môi khớp 99% với kịch bản thoại tiếng Việt, thiết lập luồng phát đa kênh và kích hoạt chế độ tự động tương tác bình luận.',
    visualTitle: 'Bảng điều khiển Live Đa Kênh',
    visualContent: (
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-border/40 pb-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-bold text-red-500">ĐANG PHÁT TRỰC TIẾP</span>
          </div>
          <span className="text-muted-foreground text-[10px]">Thời gian: 03h:42m</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-muted/60 p-2 rounded">
            <span className="font-semibold text-foreground">TikTok Shop Live</span>
            <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] border border-green-500/20 font-bold">KHỎE MẠNH</span>
          </div>
          <div className="flex items-center justify-between bg-muted/60 p-2 rounded">
            <span className="font-semibold text-foreground">Shopee Live Feed</span>
            <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] border border-green-500/20 font-bold">KHỎE MẠNH</span>
          </div>
          <div className="flex items-center justify-between bg-muted/60 p-2 rounded">
            <span className="font-semibold text-foreground">Facebook Page Stream</span>
            <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] border border-green-500/20 font-bold">KHỎE MẠNH</span>
          </div>
        </div>
      </div>
    )
  },
  {
    step: '04',
    title: 'Theo dõi & Tối ưu hóa',
    desc: 'Xem báo cáo doanh thu bán hàng, biểu đồ mắt xem thực tế, số lượng bình luận được AI xử lý và phân tích hành vi mua sắm của khách hàng tức thì.',
    visualTitle: 'Báo cáo & Phân tích thời gian thực',
    visualContent: (
      <div className="space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-muted p-2 rounded border border-border/30">
            <div className="text-[10px] text-muted-foreground">Mắt xem cao nhất</div>
            <div className="text-base font-extrabold text-primary">14.280</div>
          </div>
          <div className="bg-muted p-2 rounded border border-border/30">
            <div className="text-[10px] text-muted-foreground">Bình luận đã trả lời</div>
            <div className="text-base font-extrabold text-sky-500">1.840</div>
          </div>
        </div>
        <div className="border border-border/40 rounded p-2 bg-card space-y-1.5">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-muted-foreground">Tỷ lệ chuyển đổi đơn</span>
            <span className="font-bold text-green-500">+48.2%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded overflow-hidden">
            <div className="h-full w-[78%] bg-gradient-to-r from-primary to-sky-500 rounded" />
          </div>
          <span className="text-[9px] text-muted-foreground block text-right">Tăng trưởng 2.5x so với tuần trước</span>
        </div>
      </div>
    )
  }
]

const FEATURE_GRID = [
  {
    icon: Clock,
    title: 'Phát trực tiếp 24/7 không giới hạn',
    desc: 'Phát sóng liên tục suốt ngày đêm để tiếp cận khách hàng ở mọi khung giờ, tăng tối đa cơ hội tiếp xúc. Hệ thống tự động lặp nội dung linh hoạt theo lịch đặt sẵn.',
  },
  {
    icon: Users,
    title: 'Thư viện 50+ Avatar đa dạng',
    desc: 'Kho tàng hơn 50 nhân vật ảo nam/nữ từ nhiều độ tuổi, sắc tộc, phong cách. Đặc biệt hỗ trợ các avatar nói tiếng Việt chuẩn, phát âm tự nhiên, biểu cảm chân thực.',
  },
  {
    icon: Sparkles,
    title: 'AI tự động viết kịch bản & TTS',
    desc: 'Chỉ cần cung cấp từ khóa sản phẩm, AI sẽ tự tạo kịch bản bán hàng chuẩn SEO, chốt deal tốt. Sau đó, công nghệ Text-to-Speech sẽ tự động chuyển thành giọng nói truyền cảm.',
  },
  {
    icon: Laptop,
    title: 'Đa nền tảng – Phát đồng thời',
    desc: 'Tiết kiệm thời gian với tính năng cấu hình 1 lần, phát song song cùng lúc lên Facebook, Shopee Live, TikTok Shop, Lazada, YouTube... không gây trễ luồng.',
  },
  {
    icon: MessageSquare,
    title: 'Tương tác real-time thông minh',
    desc: 'Avatar AI có khả năng đọc bình luận trực tiếp của người xem và phản hồi trả lời bằng giọng nói theo kịch bản và luật đã định, tự động dẫn link giỏ hàng.',
  },
  {
    icon: Zap,
    title: 'Thiết lập nhanh chóng dưới 10 phút',
    desc: 'Giao diện trực quan được tối ưu hóa cho người không chuyên. Chỉ cần chọn avatar, nhập kịch bản sản phẩm, kết nối luồng và bấm phát ngay tức thì.',
  },
]

const FAQ_LIST = [
  {
    q: '1. A.I Livestream khác gì so với livestream truyền thống?',
    a: 'Hệ thống dùng nhân vật ảo A.I Avatar tự phát sóng, đồng bộ khẩu hình và tương tác tự động — không cần MC, không cần studio. Doanh nghiệp livestream 24/7 với chi phí tối thiểu.'
  },
  {
    q: '2. iLive có thể phát đồng thời trên những nền tảng nào?',
    a: 'Phát đồng thời lên TikTok Shop, Shopee Live, Facebook Live, Lazada và YouTube. Tất cả quản lý tập trung trên một bảng điều khiển duy nhất.'
  },
  {
    q: '3. Tôi có thể tự chọn giọng nói hoặc ngoại hình nhân vật ảo không?',
    a: 'Thư viện 50+ avatar nam/nữ đa dạng phong cách và giọng vùng miền. Doanh nghiệp lớn có thể clone hình ảnh + giọng nói riêng để tạo Digital Human thương hiệu độc quyền.'
  },
  {
    q: '4. Nhân vật ảo A.I có thực sự trả lời bình luận của khách hàng theo thời gian thực không?',
    a: 'Có. AI Auto-Reply phân tích bình luận và điều khiển avatar trả lời bằng giọng nói ngay trên livestream, đồng thời ghim sản phẩm / gửi link mua hàng tự động.'
  },
  {
    q: '5. Hệ thống có dễ sử dụng không? Có cần người kỹ thuật vận hành không?',
    a: 'Không cần lập trình hay thiết bị phức tạp. 3 bước trong 10 phút: chọn nhân vật → nhập kịch bản → bấm phát sóng. Wizard hướng dẫn từng bước.'
  },
  {
    q: '6. Có thể tự tùy chỉnh kịch bản nói và tạo kịch bản bằng AI không?',
    a: 'Tự soạn hoặc dùng AI viết kịch bản tích hợp sẵn. Chỉ cần nhập tên sản phẩm + khuyến mãi, AI tạo kịch bản livestream chuyên nghiệp trong vài giây.'
  },
  {
    q: '7. Chi phí và chính sách dùng thử của iLive như thế nào?',
    a: 'Nhiều gói linh hoạt cho cá nhân đến doanh nghiệp. Dùng thử miễn phí 7 ngày đầy đủ tính năng, hủy bất kỳ lúc nào, không ràng buộc.'
  }
]

const DEMO_VIDEOS = [
  {
    title: 'Video MC Quay Thật',
    badge: 'Nguyên Bản',
    badgeColor: 'border-muted-foreground/30 bg-muted/20 text-muted-foreground',
    desc: 'Video ghi hình thực tế của MC làm tư liệu quét hình ảnh và giọng nói.',
    src: '/videos/video_goc.mp4',
    poster: '/videos/thumbs/goc.jpg',
    duration: '0:22',
    longDesc: 'Đây là video ghi hình thực tế của MC thật trong phòng studio phông xanh. Video này được sử dụng làm nguồn dữ liệu đầu vào (Dataset) chất lượng cao để hệ thống A.I học cử chỉ gương mặt, khẩu hình môi và clone (nhân bản) giọng nói độc quyền.',
    tagName: 'MC Thật (Original)',
    tagColor: 'border-muted-foreground/30 bg-muted/20 text-muted-foreground',
    keySpecs: ['MC thật 100%', 'Độ phân giải Full HD', 'Giọng nói tự nhiên', 'Cần chuẩn bị phòng Studio và thiết bị']
  },
  {
    title: 'Gói Standard (AI Lip-Sync)',
    badge: 'Standard',
    badgeColor: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    desc: 'AI thay đổi khẩu hình môi khớp với kịch bản văn bản mới.',
    src: '/videos/video_free.mp4',
    poster: '/videos/thumbs/free.jpg',
    duration: '0:22',
    longDesc: 'Phiên bản A.I Livestream sử dụng công nghệ Lip-sync tiêu chuẩn. Hệ thống chỉ xử lý và điều chỉnh chuyển động vùng cơ môi của nhân vật để khớp đồng bộ với kịch bản thoại mới được nhập vào, trong khi các cử động cơ thể và nền tảng cũ được giữ nguyên.',
    tagName: 'A.I Standard (Lip-Sync)',
    tagColor: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    keySpecs: ['Khẩu hình khớp cơ bản', 'Độ phân giải 720p', 'Tối đa 2 nền tảng', 'AI hỗ trợ chốt đơn cơ bản']
  },
  {
    title: 'Gói Pro (AI VEO3 Cao Cấp)',
    badge: 'Pro VEO3',
    badgeColor: 'border-primary/30 bg-primary/10 text-primary',
    desc: 'Mô hình VEO3 thế hệ mới tái tạo chuyển động và biểu cảm siêu thực.',
    src: '/videos/video_pro.mp4',
    poster: '/videos/thumbs/pro.jpg',
    duration: '0:22',
    longDesc: 'Giải pháp A.I Livestream cao cấp nhất ứng dụng mô hình AI VEO3 độc quyền. Không chỉ đồng bộ khẩu hình môi đạt độ mượt mà tuyệt đối 99%, VEO3 còn tạo ra các biểu cảm tự nhiên như nháy mắt, nhíu mày, mỉm cười và chuyển động đầu khớp với ngữ điệu nói sinh động.',
    tagName: 'A.I Pro (Mô Hình VEO3)',
    tagColor: 'border-primary/30 bg-primary/10 text-primary',
    keySpecs: ['Công nghệ VEO3 siêu thực', 'Độ phân giải 2K sắc nét', 'Đồng bộ khẩu hình 99%', 'Không watermark', 'Clone giọng nói cảm xúc']
  }
]

export function LandingPage() {
  const navigate = useNavigate()
  const plans = useSubscriptionStore((s) => s.plans)
  const startTrial = useSubscriptionStore((s) => s.startTrial)
  const [activeDemoIndex, setActiveDemoIndex] = useState(0)

  // Interactive UI States
  const [activePlatform, setActivePlatform] = useState<PlatformId>('tiktok')
  const [viewers, setViewers] = useState(2450)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: 'Khánh Vy',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Vy',
      message: 'Son màu cam đất còn hàng không shop ơi? Cho em xem bảng màu với ạ!',
      timestamp: '15:20',
      platform: 'tiktok',
    },
    {
      id: '2',
      user: 'iLive Assistant',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=assistant',
      message: 'Chào Khánh Vy! Son màu cam đất hiện đang có sẵn 5 thỏi trong giỏ hàng. Bạn bấm vào sản phẩm số 3 để nhận ngay mã giảm giá 30k hôm nay nhé!',
      timestamp: '15:20',
      platform: 'tiktok',
      isAI: true,
      link: { label: 'Mua ngay - 189.000đ', href: '#' },
    },
  ])
  const [activeStepTab, setActiveStepTab] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Lead Generation form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    businessType: 'Cá nhân'
  })
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Stream simulation effects
  useEffect(() => {
    const activeMeta = PLATFORM_META[activePlatform]
    // Generate viewer simulation base on active platform
    const baseViewers = activePlatform === 'shopee' ? 3850 : activePlatform === 'tiktok' ? 2450 : activePlatform === 'facebook' ? 1280 : 920
    setViewers(baseViewers)

    // Append welcome message
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const systemMsg: ChatMessage = {
      id: Date.now().toString() + '-sys',
      user: 'Hệ thống iLive',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ilive',
      message: `Đã đồng bộ thành công luồng phát tự động đến kênh ${activePlatform === 'shopee' ? 'Shopee Live' : activePlatform === 'tiktok' ? 'TikTok Shop' : activePlatform === 'facebook' ? 'Facebook Live' : 'YouTube Live'}.`,
      timestamp: timeStr,
      platform: activePlatform,
      isAI: true,
    }
    setChatMessages((prev) => [...prev.slice(-4), systemMsg])
  }, [activePlatform])

  // Periodic simulated user questions & chat scroll
  useEffect(() => {
    const vnQuestions = [
      { user: 'Thế Anh', text: 'Có được kiểm tra hàng trước khi nhận không shop?' },
      { user: 'Minh Hằng', text: 'Ủng hộ shop 2 đơn rồi nha, hàng dùng siêu thích!' },
      { user: 'Hoài Nam', text: 'Sản phẩm này bảo hành bao lâu thế ạ?' },
      { user: 'Bích Phương', text: 'Giao về Hà Nội mất mấy ngày vậy ạ?' },
    ]

    const triggerMessageSim = () => {
      const qIndex = Math.floor(Math.random() * vnQuestions.length)
      const selected = vnQuestions[qIndex]
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      const newCustMsg: ChatMessage = {
        id: Date.now().toString() + '-cust',
        user: selected.user,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${selected.user}`,
        message: selected.text,
        timestamp: timeStr,
        platform: activePlatform,
      }

      setChatMessages((prev) => [...prev.slice(-4), newCustMsg])

      // AI response delay simulation
      setTimeout(() => {
        let responseText: string
        let linkObj = undefined

        if (selected.text.includes('kiểm tra')) {
          responseText = 'Chào Thế Anh nhé! Mọi đơn hàng mua từ live đều được đồng kiểm 100% trước khi thanh toán nên bạn hoàn toàn yên tâm nhé!'
        } else if (selected.text.includes('Ủng hộ')) {
          responseText = 'iLive xin cảm ơn Minh Hằng rất nhiều ạ! Món quà tri ân khách hàng thân thiết đã được gửi kèm đơn hàng của bạn rồi đó.'
        } else if (selected.text.includes('bảo hành')) {
          responseText = 'Sản phẩm này được bảo hành chính hãng 12 tháng lỗi 1 đổi 1 trong vòng 30 ngày đầu tiên nha Hoài Nam!'
          linkObj = { label: 'Xem chi tiết bảo hành', href: '#' }
        } else {
          responseText = 'Chào Bích Phương! Đơn hàng sẽ được đóng gói phát ngay trong ngày, giao về Hà Nội cực nhanh chỉ từ 1 - 2 ngày thôi nhé.'
        }

        const newAIMsg: ChatMessage = {
          id: Date.now().toString() + '-ai',
          user: 'iLive Copilot (AI)',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=assistant',
          message: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          platform: activePlatform,
          isAI: true,
          link: linkObj,
        }

        setChatMessages((prev) => [...prev.slice(-4), newAIMsg])
        setViewers((prev) => prev + Math.floor(Math.random() * 40) - 15)
      }, 2000)
    }

    const interval = setInterval(triggerMessageSim, 10000)
    return () => clearInterval(interval)
  }, [activePlatform])

  // Form submit handler simulation
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) return

    setIsSubmittingForm(true)
    setTimeout(() => {
      setIsSubmittingForm(false)
      setFormSubmitted(true)
    }, 1800)
  }

  const handleTrialStart = (planId: PlanId) => {
    if (planId === 'enterprise') {
      toast.info("Vui lòng liên hệ Hotline: 083 627 1312 hoặc gửi email về ilive@shopnow.vn để đăng ký gói Enterprise!", { duration: 5000 })
      return
    }
    startTrial(planId as 'standard' | 'pro')
    navigate('/login')
  }

  const handleContactPlan = (planName: string) => {
    setFormData((prev) => ({
      ...prev,
      message: `Tôi muốn liên hệ để mua gói dịch vụ ${planName}. Vui lòng tư vấn cho tôi.`
    }))
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative pt-16 overflow-x-hidden">
      {/* BACKGROUND DECORATIONS */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 -left-48 h-[600px] w-[600px] rounded-full bg-primary/10 blur-3xl opacity-60" />
        <div className="absolute top-96 -right-48 h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-3xl opacity-50" />
        <div className="absolute top-[1800px] left-1/3 h-[700px] w-[700px] rounded-full bg-fuchsia-500/5 blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl opacity-50" />
      </div>

      {/* HERO SECTION */}
      <section id="hero" className="relative min-h-[calc(100vh-4rem)] flex items-center py-20 px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-12 w-full">
          {/* Left Hero Texts */}
          <div className="space-y-6 lg:col-span-7 text-left animate-appear">
            <Badge variant="brand" className="px-3.5 py-1.5 rounded-full font-semibold text-xs tracking-wider uppercase animate-bounce">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-white animate-pulse" />
              Kỷ nguyên Digital Human Commerce
            </Badge>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl text-foreground">
              Biến host đạt chuẩn thành <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">tài sản số</span>
            </h1>

            <p className="text-xl font-bold tracking-tight text-primary/95 sm:text-2xl">
              Tối ưu hoá tăng trưởng bằng A.I Livestream & Automation
            </p>

            <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
              Xây dựng <strong>Digital Human A.I</strong> livestream, tư vấn và chốt đơn tự động 24/7 — không cần MC, không cần studio.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                variant="brand"
                size="lg"
                className="font-bold text-white shadow-lg shadow-primary/20 scale-100 hover:scale-105 active:scale-95 transition-all duration-200"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Tư vấn miễn phí
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="font-semibold border-border hover:bg-muted/40 transition-colors"
                onClick={() => document.getElementById('ai-livestream')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Tìm hiểu thêm
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-4.5 w-4.5 text-green-500 shrink-0" /> Dùng thử 7 ngày free
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="h-4.5 w-4.5 text-green-500 shrink-0" /> Không cần thẻ tín dụng
              </span>
            </div>
          </div>

          {/* Right Hero Video/Stream Simulator Mockup */}
          <div className="lg:col-span-5 relative w-full animate-appear animation-delay-200">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-primary to-sky-500 opacity-20 blur-xl" />
            
            <div className="relative rounded-2xl border border-border/80 bg-card p-3 shadow-2xl overflow-hidden glass">
              
              {/* Simulator Header */}
              <div className="flex items-center justify-between mb-3 border-b border-border/50 pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">iLive Live Stream Simulator</span>
                </div>
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                </div>
              </div>

              {/* Video stream box */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-800">
                <img
                  src="/images/ai_streamer_host.png"
                  alt="AI stream host"
                  className="h-full w-full object-cover transition duration-500 scale-100"
                />

                {/* Overlaid UI components */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 pointer-events-none" />

                {/* Live indicators */}
                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <Badge variant="destructive" className="px-2.5 py-0.5 animate-pulseLive flex items-center gap-1 text-[10px] font-extrabold uppercase">
                    ● LIVE
                  </Badge>
                  <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm flex items-center gap-1">
                    👁️ {(viewers / 1000).toFixed(1)}K đang xem
                  </span>
                </div>

                {/* Product Card floating overlay */}
                <div className="absolute right-3 top-3 max-w-[120px] rounded-lg border border-white/10 bg-black/60 p-1.5 text-white backdrop-blur-sm shadow-xl flex flex-col gap-1">
                  <div className="aspect-square w-full rounded bg-white/20 overflow-hidden">
                    <img src="https://picsum.photos/seed/cosmetics/120/120" alt="Son Kem" className="h-full w-full object-cover" />
                  </div>
                  <span className="text-[9px] font-bold truncate">Son Matte Velvet</span>
                  <span className="text-[10px] text-primary-foreground font-extrabold">189.000đ</span>
                  <button className="w-full py-0.5 rounded bg-primary text-[8px] font-bold text-white tracking-wide uppercase hover:bg-primary/90 transition-colors">
                    Mua ngay
                  </button>
                </div>

                {/* Real-time Ticker comments feed */}
                <div className="absolute bottom-3 left-3 right-3 max-h-[140px] overflow-y-auto space-y-1.5 flex flex-col justify-end pointer-events-auto">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "rounded-lg p-2 text-[10px] leading-relaxed max-w-[90%] backdrop-blur-sm shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300",
                        msg.isAI
                          ? "bg-primary/25 border border-primary/30 text-white self-start ml-2"
                          : "bg-black/60 border border-white/5 text-white self-start"
                      )}
                    >
                      <div className="flex items-center gap-1.5 font-bold mb-0.5">
                        <span className="text-white/90">{msg.user}</span>
                        {msg.isAI && (
                          <span className="px-1 rounded bg-primary text-[8px] text-white font-extrabold uppercase shrink-0">AI</span>
                        )}
                        <span className="text-[8px] font-normal text-white/50">{msg.timestamp}</span>
                      </div>
                      <p className="text-white/95 font-medium">{msg.message}</p>
                      {msg.link && (
                        <a
                          href={msg.link.href}
                          className="mt-1.5 inline-flex items-center gap-1 font-bold text-sky-300 hover:text-sky-200 transition-colors bg-white/10 px-2 py-0.5 rounded border border-white/10"
                        >
                          <Package className="h-3 w-3 shrink-0" />
                          {msg.link.label}
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                {/* Audio visualizer bar */}
                <div className="absolute bottom-3 right-3 flex items-end gap-0.5 h-6">
                  {[1, 2, 3, 4, 5].map((bar) => (
                    <span
                      key={bar}
                      className="live-audio-bar w-0.8 bg-primary rounded-full"
                      style={{ height: `${Math.floor(Math.random() * 16) + 8}px` }}
                    />
                  ))}
                </div>
              </div>

              {/* Platform switcher tab buttons */}
              <div className="mt-3">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 text-center">Chọn kênh để kiểm tra thử:</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {BRAND_PLATFORMS.map((p) => {
                    const isActive = activePlatform === p.id
                    return (
                      <button
                        key={p.id}
                        onClick={() => setActivePlatform(p.id)}
                        className={cn(
                          "rounded-lg px-1 py-1.5 text-[9px] font-bold border transition-all text-center flex flex-col items-center justify-center gap-1 active:scale-95",
                          isActive
                            ? `${p.bg} ${p.text} border-primary shadow-sm`
                            : "border-border/60 hover:bg-muted text-muted-foreground"
                        )}
                      >
                        <span className="font-extrabold">{p.name.split(' ')[0]}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* PLATFORMS SUPPORTED / PARTNER BRANDS BAR */}
      <section className="border-y border-border/40 bg-muted/20 py-8 px-6 animate-appear animation-delay-300">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-xs font-bold text-muted-foreground tracking-wider uppercase mb-5">Hỗ trợ phát đồng thời đa nền tảng tốt nhất hiện nay</p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
            {BRAND_PLATFORMS.map((p) => (
              <div key={p.id} className="flex items-center gap-2 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="font-bold text-base sm:text-lg text-foreground tracking-tight">{p.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
              <span className="h-2 w-2 rounded-full bg-[#f15a24]" />
              <span className="font-bold text-base sm:text-lg text-foreground tracking-tight">Lazada Live</span>
            </div>
          </div>
        </div>
      </section>

      {/* REAL DEMO VIDEOS SECTION */}
      <section id="demo-videos" className="py-24 px-6 max-w-6xl mx-auto animate-appear">
        <div className="mb-16 text-center space-y-3">
          <Badge variant="brand" className="px-3 py-1 rounded-full text-xs font-semibold">Demo thực tế</Badge>
          <h2 className="text-3xl font-extrabold sm:text-4xl text-foreground">Xem sức mạnh của A.I Livestream hoạt động</h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            So sánh chất lượng giữa MC thật ban đầu và các phiên bản A.I Livestream tự động hóa đa cấp độ của iLive.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-stretch">
          {/* Left: Main Video Player Showcase */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="relative aspect-video w-full rounded-2xl bg-card border border-border/60 shadow-2xl overflow-hidden glass group">
              {/* Decorative light reflection or glow */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-primary/20 via-sky-500/10 to-fuchsia-500/10 opacity-30 blur-lg -z-10 group-hover:opacity-50 transition-opacity duration-500" />

              <video
                key={DEMO_VIDEOS[activeDemoIndex].src}
                src={DEMO_VIDEOS[activeDemoIndex].src}
                poster={DEMO_VIDEOS[activeDemoIndex].poster}
                controls
                autoPlay={false}
                className="w-full h-full object-contain bg-black"
                playsInline
              />

              {/* Tag indicating what version is playing */}
              <div className="absolute top-4 left-4 z-10">
                <Badge className={cn("px-3 py-1 font-bold text-xs uppercase tracking-wide border", DEMO_VIDEOS[activeDemoIndex].tagColor)}>
                  Đang phát: {DEMO_VIDEOS[activeDemoIndex].tagName}
                </Badge>
              </div>
            </div>

            {/* Video stats/features below the player */}
            <div className="mt-4 p-5 rounded-xl border border-border/40 bg-card/40 glass text-left space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-lg text-foreground">{DEMO_VIDEOS[activeDemoIndex].title}</h4>
                <Badge variant="outline" className="text-[10px] font-semibold text-muted-foreground border-border/80">
                  {DEMO_VIDEOS[activeDemoIndex].duration}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {DEMO_VIDEOS[activeDemoIndex].longDesc}
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                {DEMO_VIDEOS[activeDemoIndex].keySpecs.map((spec, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-[11px] font-semibold text-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border/30">
                    <Check className="h-3 w-3 text-primary shrink-0" /> {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Playlist tabs selector */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="space-y-4 text-left">
              <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" /> Lựa chọn phiên bản demo
              </h3>

              {DEMO_VIDEOS.map((item, idx) => {
                const isActive = activeDemoIndex === idx
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveDemoIndex(idx)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden group",
                      isActive
                        ? "bg-card border-primary/50 shadow-lg shadow-primary/5"
                        : "bg-transparent border-border/40 hover:bg-muted/40"
                    )}
                  >
                    {isActive && (
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                    )}

                    {/* Video thumbnail with small play button overlay */}
                    <div className="relative h-16 w-24 shrink-0 rounded-lg overflow-hidden border border-border/60 bg-muted">
                      <img src={item.poster} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className={cn("h-6 w-6 rounded-full flex items-center justify-center bg-white/90 text-background transition-transform duration-300", isActive ? "scale-110 bg-primary text-primary-foreground" : "group-hover:scale-110")}>
                          <Play className="h-3 w-3 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                          {item.title}
                        </span>
                        <Badge className={cn("text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase shrink-0 border", item.badgeColor)}>
                          {item.badge}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Premium CTA banner to contact for trial/purchase */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-primary/10 to-sky-500/10 border border-primary/20 text-left space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <span className="font-bold text-sm text-foreground">Bạn muốn sở hữu bản sao số cho riêng mình?</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Liên hệ tư vấn gói Pro ngay hôm nay để sở hữu mô hình AI VEO3 cao cấp nhất với mức giá ưu đãi nhất.
              </p>
              <Button size="sm" variant="brand" className="w-full font-bold text-xs" onClick={() => handleContactPlan('Pro')}>
                Liên Hệ Tư Vấn & Mua Ngay <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION / WHAT IS AI LIVESTREAM */}
      <section id="ai-livestream" className="py-24 px-6 max-w-6xl mx-auto animate-appear">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          
          <div className="space-y-6 text-left">
            <Badge variant="brand" className="px-3 py-1 rounded-full text-xs font-semibold">
              Định nghĩa A.I Livestream
            </Badge>
            <h2 className="text-3xl font-extrabold sm:text-4xl leading-tight text-foreground">
              A.I Livestream là gì và hoạt động như thế nào?
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Nhân vật ảo <strong>A.I Avatar</strong> tự phát sóng, tương tác và chốt đơn liên tục — không cần MC, không cần thiết bị chuyên dụng.
            </p>
            <div className="border-l-4 border-primary pl-4 py-1.5 italic text-muted-foreground text-sm">
              "Kỷ nguyên chuyển dịch từ con người sang tài sản số 1STREAM giúp cắt giảm tới 80% chi phí vận hành livestream thông thường."
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {INTRO_CAPABILITIES.map((c, i) => (
              <Card key={i} className="hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 border-border/50 relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${c.color}`} />
                <CardHeader className="pb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-2">
                    <c.icon className="h-5 w-5 text-primary shrink-0" />
                  </div>
                  <CardTitle className="text-base font-bold leading-snug">{c.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* AI DIGITAL HUMAN SECTION */}
      <section id="digital-human" className="py-20 px-6 bg-muted/30 border-y border-border/40 relative overflow-hidden animate-appear">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <Badge variant="outline" className="px-3 py-1 rounded-full text-xs font-semibold text-primary border-primary/30 bg-primary/5">
            Giải pháp Digital Human Cao Cấp
          </Badge>
          <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight text-foreground">
            A.I Digital Human - Bản Sao Số Của Doanh Nghiệp
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Biến hình ảnh thương hiệu thành <strong>tài sản số</strong> vận hành 24/7 — AI quét chuyển động, nhân bản giọng nói, tạo Digital Human livestream bán hàng tự động.
          </p>
          <div className="inline-flex flex-wrap items-center justify-center gap-6 pt-4 text-sm font-semibold text-foreground">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 shrink-0" /> Đồng bộ khẩu hình 99%
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 shrink-0" /> Giọng nói biểu cảm tự nhiên
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 shrink-0" /> Nhân bản chỉ trong 3 ngày
            </span>
          </div>
        </div>
      </section>

      {/* INTERACTIVE WORKFLOW STEPS */}
      <section className="py-24 px-6 max-w-6xl mx-auto animate-appear">
        <div className="mb-16 text-center space-y-3">
          <Badge variant="brand" className="px-3 py-1 rounded-full text-xs font-semibold">Quy trình vận hành</Badge>
          <h2 className="text-3xl font-extrabold sm:text-4xl text-foreground">Cách hoạt động của A.I Livestream</h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">Chỉ với 4 bước đơn giản, bạn đã có một cỗ máy bán hàng tự động phát sóng đa nền tảng.</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Left Step Selectors */}
          <div className="lg:col-span-7 space-y-4">
            {STEPS_WORKFLOW.map((s, idx) => {
              const isActive = activeStepTab === idx
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStepTab(idx)}
                  className={cn(
                    "flex items-start gap-4 p-5 rounded-xl border transition-all duration-300 cursor-pointer text-left relative overflow-hidden group",
                    isActive
                      ? "bg-card border-primary/50 shadow-md shadow-primary/5"
                      : "bg-transparent border-border/40 hover:bg-muted/40"
                  )}
                >
                  {isActive && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                  )}
                  <span className={cn(
                    "text-xl sm:text-2xl font-extrabold shrink-0",
                    isActive ? "text-primary animate-pulse" : "text-muted-foreground/60"
                  )}>
                    {s.step}
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors">{s.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Visual Representation Box */}
          <div className="lg:col-span-5 relative w-full h-full min-h-[300px] flex items-center justify-center">
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-primary/10 to-sky-500/10 blur-xl -z-10" />
            <Card className="w-full h-full border-border/60 shadow-xl overflow-hidden glass">
              <CardHeader className="bg-muted/50 border-b border-border/50 py-3 px-4 flex flex-row items-center gap-2">
                <Laptop className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs font-bold text-foreground uppercase tracking-wide">{STEPS_WORKFLOW[activeStepTab].visualTitle}</span>
              </CardHeader>
              <CardContent className="p-5 flex flex-col justify-center min-h-[220px]">
                {STEPS_WORKFLOW[activeStepTab].visualContent}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="py-24 px-6 bg-muted/20 border-y border-border/40 relative animate-appear">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center space-y-3">
            <Badge variant="brand" className="px-3 py-1 rounded-full text-xs font-semibold">Ưu điểm vượt trội</Badge>
            <h2 className="text-3xl font-extrabold sm:text-4xl text-foreground">Tính năng nổi bật của iLive</h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">Chúng tôi mang lại giải pháp công nghệ dẫn đầu hỗ trợ đắc lực cho công việc kinh doanh.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURE_GRID.map((f, i) => (
              <Card key={i} className="hover:-translate-y-2 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/60 glass">
                <CardHeader className="pb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient shadow-md shadow-primary/10 mb-3">
                    <f.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold">{f.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* BUSINESS BENEFITS / VALUE PROP SECTION */}
      <section id="benefits" className="py-24 px-6 max-w-6xl mx-auto animate-appear">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          
          {/* Left statistics grid */}
          <div className="grid gap-6 sm:grid-cols-3 text-center">
            
            <div className="p-6 rounded-2xl border border-border/40 bg-card hover:border-primary/50 transition-colors shadow-sm flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
              <span className="text-3xl sm:text-4xl font-extrabold text-primary mb-2">+100%</span>
              <span className="text-xs font-bold text-foreground mb-1 uppercase tracking-wide">Phủ Sóng</span>
              <p className="text-[10px] text-muted-foreground">Livestream liên tục 24/7 không giới hạn khung giờ tiếp cận khách hàng.</p>
            </div>

            <div className="p-6 rounded-2xl border border-border/40 bg-card hover:border-primary/50 transition-colors shadow-sm flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-sky-500" />
              <span className="text-3xl sm:text-4xl font-extrabold text-sky-500 mb-2">+150%</span>
              <span className="text-xs font-bold text-foreground mb-1 uppercase tracking-wide">Tương Tác</span>
              <p className="text-[10px] text-muted-foreground">Phản hồi bình luận cực nhanh giữ chân khách xem ở lại live lâu hơn.</p>
            </div>

            <div className="p-6 rounded-2xl border border-border/40 bg-card hover:border-primary/50 transition-colors shadow-sm flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-500 mb-2">+40%</span>
              <span className="text-xs font-bold text-foreground mb-1 uppercase tracking-wide">Đơn Hàng</span>
              <p className="text-[10px] text-muted-foreground">Tự động đẩy link, ghim bình luận chốt sale nhanh chóng.</p>
            </div>

            <div className="sm:col-span-3 p-5 rounded-xl border border-dashed border-border/80 bg-muted/30 text-xs sm:text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2">
              🔥 Cắt giảm tối đa chi phí thuê Studio, thiết bị và nhân sự livestream!
            </div>
          </div>

          {/* Right value description text */}
          <div className="space-y-6 text-left lg:pl-6">
            <Badge variant="brand" className="px-3 py-1 rounded-full text-xs font-semibold">Lợi ích thực tế</Badge>
            <h2 className="text-3xl font-extrabold sm:text-4xl leading-tight text-foreground">Tại sao nên chuyển đổi sang A.I Livestream?</h2>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500 mt-1">
                  <Check className="h-3 w-3" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-foreground">Tiết kiệm 80% chi phí nhân sự</h4>
                  <p className="text-sm text-muted-foreground">Không cần lo lắng chi phí thuê KOL, MC hay các vấn đề nghỉ phép, giảm hiệu suất làm việc. Máy ảo tự vận hành với chi phí chỉ bằng 1/5 MC thật.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500 mt-1">
                  <Check className="h-3 w-3" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-foreground">Nội dung nhất quán và chuẩn chỉ</h4>
                  <p className="text-sm text-muted-foreground">Nhân vật ảo luôn bám sát theo kịch bản quy chuẩn 100%, không nói sai thông tin sản phẩm, giữ hình ảnh thương hiệu luôn an toàn và ổn định tuyệt đối.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500 mt-1">
                  <Check className="h-3 w-3" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-foreground">Mở rộng quy mô kinh doanh không giới hạn</h4>
                  <p className="text-sm text-muted-foreground">Dễ dàng nhân bản cấu hình ra hàng chục luồng livestream khác nhau phát cùng lúc để phủ sóng thị trường đa kênh nhanh chóng mà sức người không bao giờ làm được.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* AI LIVESTREAM TRAINING COURSE */}
      <section id="course" className="py-20 px-6 bg-muted/40 border-y border-border/40 relative overflow-hidden animate-appear">
        <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <Badge variant="brand" className="px-3.5 py-1.5 rounded-full font-semibold text-xs tracking-wider uppercase">
              Chương trình đào tạo thực chiến
            </Badge>
            <h2 className="text-3xl font-extrabold sm:text-4xl text-foreground">
              Khóa Học Đón Đầu Xu Hướng AI Livestream
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Giáo trình đào tạo thực chiến giúp doanh nghiệp <strong>làm chủ AI Livestream</strong> và tối ưu doanh số nhanh nhất:
            </p>
            <ul className="space-y-3.5 text-sm sm:text-base">
              {[
                'Kỹ thuật xây dựng phòng lab AI Livestream tinh gọn cho doanh nghiệp.',
                'Tối ưu hóa viết kịch bản livestream giữ chân khách bằng ChatGPT & Claude.',
                'Kỹ năng thiết lập phần mềm và lách luật bypass các thuật toán kiểm duyệt khắt khe.',
                'Quản lý, phân tích chỉ số phễu chuyển đổi dữ liệu và tối ưu vận hành tự động hóa.'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Award className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 relative w-full flex justify-center">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-primary to-sky-500 opacity-20 blur-xl" />
            <Card className="w-full max-w-md border-border/60 shadow-xl overflow-hidden glass p-6 space-y-5 text-center relative">
              <div className="absolute top-0 right-0 rounded-bl-xl bg-primary px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                Ưu đãi học viên
              </div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient shadow-lg shadow-primary/20">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-extrabold text-foreground">Đăng ký khóa đào tạo A.I</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Hướng dẫn 1-1 bởi chuyên gia, tặng 50+ kịch bản mẫu và tài khoản VIP 1 tháng.
              </p>
              <div className="border-t border-border/40 pt-4 flex flex-col gap-2.5">
                <Button 
                  variant="brand" 
                  className="w-full font-bold shadow-md hover:shadow-lg transition-all"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Nhận tư vấn khóa học
                </Button>
              </div>
            </Card>
          </div>

        </div>
      </section>

      {/* PRICING PLANS */}
      <section id="pricing" className="py-24 px-6 max-w-6xl mx-auto animate-appear">
        <div className="mb-16 text-center space-y-3">
          <Badge variant="brand" className="px-3 py-1 rounded-full text-xs font-semibold">Bảng giá dịch vụ</Badge>
          <h2 className="text-3xl font-extrabold sm:text-4xl text-foreground">Chọn gói phù hợp với quy mô bán hàng</h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">Giá cước siêu ưu đãi hỗ trợ tối đa doanh nghiệp bứt phá doanh số. Liên hệ ngay để đăng ký cài đặt.</p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isPro = plan.id === 'pro'
            const isEnterprise = plan.id === 'enterprise'
            return (
              <Card
                key={plan.id}
                className={cn(
                  'relative flex flex-col border transition-all duration-300',
                  isPro 
                    ? 'border-primary shadow-xl shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-1.5' 
                    : isEnterprise
                    ? 'border-violet-500/40 shadow-md shadow-violet-500/5 hover:shadow-violet-500/10 hover:-translate-y-1.5'
                    : 'border-border/60 hover:shadow-md hover:-translate-y-1'
                )}
              >
                {isPro && (
                  <Badge
                    variant="brand"
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider text-[9px]"
                  >
                    Được khuyên dùng nhiều nhất
                  </Badge>
                )}
                {isEnterprise && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider text-[9px] border-violet-500/30 text-violet-400 bg-violet-950/20"
                  >
                    Độc quyền doanh nghiệp
                  </Badge>
                )}
                
                <CardHeader className="text-left">
                  <CardTitle className="text-2xl font-extrabold">{plan.name}</CardTitle>
                  <CardDescription className="text-xs pt-1">
                    {isEnterprise
                      ? 'Dành cho các doanh nghiệp quy mô lớn, thương hiệu độc quyền'
                      : plan.model === 'veo3'
                      ? 'Áp dụng mô hình người ảo VEO3 Lip-sync mượt mà, cao cấp nhất'
                      : 'Đồng bộ khẩu hình môi tiêu chuẩn lip-sync cơ bản'}
                  </CardDescription>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-foreground tracking-tight">
                      {isEnterprise ? 'Liên hệ' : formatVND(plan.priceMonthly)}
                    </span>
                    {!isEnterprise && (
                      <span className="text-xs font-semibold text-muted-foreground">/tháng</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-1 text-left">
                  <Separator className="my-5" />
                  <ul className="space-y-3.5 text-xs sm:text-sm text-muted-foreground font-medium">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />
                        <span className="text-foreground/90">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-4 border-t border-border/20 bg-muted/10 p-6">
                  <Button
                    variant={isPro ? 'brand' : isEnterprise ? 'secondary' : 'outline'}
                    className={cn(
                      "w-full font-bold py-5 hover:shadow-md transition-all duration-200 active:scale-98",
                      isEnterprise && "border-violet-500/30 hover:bg-violet-950/10 text-violet-400"
                    )}
                    onClick={() => {
                      if (isEnterprise) {
                        handleContactPlan(plan.name)
                      } else {
                        handleTrialStart(plan.id as PlanId)
                      }
                    }}
                  >
                    {isEnterprise ? 'Liên hệ đăng ký' : 'Bắt đầu dùng thử 7 ngày miễn phí'}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION) */}
      <section className="py-24 px-6 bg-muted/20 border-t border-border/40 animate-appear">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16 text-center space-y-3">
            <Badge variant="brand" className="px-3 py-1 rounded-full text-xs font-semibold">Giải đáp thắc mắc</Badge>
            <h2 className="text-3xl font-extrabold sm:text-4xl text-foreground">Câu hỏi thường gặp</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Mọi thắc mắc của bạn về giải pháp AI Livestream sẽ được trả lời tại đây.</p>
          </div>

          <div className="space-y-4">
            {FAQ_LIST.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <div
                  key={i}
                  className="rounded-xl border border-border/50 bg-card overflow-hidden transition-all duration-300 shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-foreground hover:bg-muted/40 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={cn(
                      "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300",
                      isOpen ? "rotate-180 text-primary" : ""
                    )} />
                  </button>
                  
                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-border/20 bg-muted/10 animate-in slide-in-from-top-2 duration-200 text-left">
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION & CONSULTATION LEAD CAPTURE FORM */}
      <section id="contact" className="py-24 px-6 max-w-4xl mx-auto animate-appear">
        <div className="relative rounded-3xl overflow-hidden bg-brand-gradient p-8 sm:p-12 text-white shadow-2xl text-center space-y-8">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 h-44 w-44 rounded-full bg-white/10 blur-xl" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-44 w-44 rounded-full bg-white/10 blur-xl" />

          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Sẵn sàng đột phá doanh thu livestream?</h2>
            <p className="text-sm text-white/90 leading-relaxed">
              Để lại thông tin để nhận tư vấn 1-1 miễn phí và tài khoản VIP dùng thử.
            </p>
          </div>

          {formSubmitted ? (
            <Card className="max-w-md mx-auto bg-white text-slate-900 border-none p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-4 animate-in zoom-in-95 duration-300">
              <CheckCircle className="h-16 w-16 text-green-500 animate-pulse" />
              <h3 className="text-xl font-bold text-foreground">Đăng ký thành công!</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Cảm ơn <strong>{formData.name}</strong>! Chuyên gia sẽ gọi lại số <strong>{formData.phone}</strong> trong vòng 10 phút.
              </p>
              <Button 
                variant="brand" 
                onClick={() => setFormSubmitted(false)}
                className="font-semibold text-white px-6 mt-2"
              >
                Gửi lại yêu cầu khác
              </Button>
            </Card>
          ) : (
            <Card className="max-w-lg mx-auto bg-white/95 text-slate-900 border-none p-6 sm:p-8 rounded-2xl shadow-2xl glass">
              <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Họ & Tên *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      placeholder="09xxxxxxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Địa chỉ Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 items-center">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-slate-700">Mô hình kinh doanh</label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
                    >
                      <option value="Cá nhân">Cá nhân bán lẻ</option>
                      <option value="Doanh nghiệp">Doanh nghiệp / Brand</option>
                      <option value="Agency">Agency truyền thông / Ads</option>
                    </select>
                  </div>
                  <div className="text-[10px] text-muted-foreground pt-4 leading-relaxed">
                    * Thông tin của bạn được bảo mật tuyệt đối theo tiêu chuẩn chính sách bảo mật khách hàng của iLive.
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Mô tả nhu cầu sản phẩm cần bán</label>
                  <textarea
                    rows={2}
                    placeholder="Sản phẩm mỹ phẩm chăm sóc da, thời trang..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="brand"
                  disabled={isSubmittingForm}
                  className="w-full font-bold py-6 text-white shadow-lg hover:shadow-xl active:scale-98 transition-all duration-200 mt-2 flex items-center justify-center gap-2"
                >
                  {isSubmittingForm ? (
                    <>
                      <span className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Đang xử lý dữ liệu đăng ký...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4.5 w-4.5 animate-pulse" />
                      Đăng Ký Tư Vấn Chiến Lược Miễn Phí
                    </>
                  )}
                </Button>
              </form>
            </Card>
          )}

        </div>
      </section>

      {/* FOOTER & CONTACT DETAILS */}
      <footer className="border-t border-border/40 bg-muted/10 py-16 px-6">
        <div className="mx-auto max-w-6xl grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-left">
          
          {/* Logo & Slogan Column */}
          <div className="space-y-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9.5 w-9.5 items-center justify-center rounded-xl bg-brand-gradient shadow-md shadow-primary/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">1STREAM</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Giải pháp AI Livestream Platform & Digital Human đột phá hỗ trợ đắc lực doanh nghiệp cắt giảm chi phí và nâng tầm tăng trưởng doanh thu đa kênh 24/7.
            </p>
            <p className="text-[10px] text-muted-foreground pt-2">
              © {new Date().getFullYear()} iLive by 1STREAM. Bảo lưu mọi quyền.
            </p>
          </div>

          {/* Solutions Column */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Các Giải Pháp</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-semibold">
              <li><button onClick={() => document.getElementById('ai-livestream')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-primary transition-colors">A.I Livestream tự động</button></li>
              <li><button onClick={() => document.getElementById('digital-human')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-primary transition-colors">Digital Human A.I</button></li>
              <li><button onClick={() => document.getElementById('course')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-primary transition-colors">Đào tạo Thực chiến</button></li>
            </ul>
          </div>

          {/* Quick Access Column */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Truy Cập Nhanh</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-semibold">
              <li><button onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-primary transition-colors">Trang chủ</button></li>
              <li><button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-primary transition-colors">Bảng giá gói cước</button></li>
              <li><button onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-primary transition-colors">Lợi ích thực tế</button></li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Liên Hệ</h4>
            <ul className="space-y-3 text-xs text-muted-foreground font-semibold">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>Hotline: 083 627 1312</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:ilive@shopnow.vn" className="hover:text-primary transition-colors">ilive@shopnow.vn</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4.5 w-4.5 text-primary shrink-0" />
                <span>Trụ sở chính: Hà Nội, Việt Nam</span>
              </li>
            </ul>
          </div>

        </div>
      </footer>
    </div>
  )
}
