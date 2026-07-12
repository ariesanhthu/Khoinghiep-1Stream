import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Bot,
  CalendarClock,
  Check,
  ChevronDown,
  CirclePlay,
  Clock3,
  FileCheck2,
  FileText,
  GraduationCap,
  Headphones,
  MessageCircleMore,
  Radio,
  Share2,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  UserRoundCheck,
  UsersRound,
  Video,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SERVICES = [
  {
    icon: Video,
    number: '01',
    title: 'Tạo video livestream AI',
    description:
      'Chuẩn hóa dữ liệu khóa học, tạo kịch bản, giọng đọc hoặc avatar, video nền và phụ đề để trung tâm duyệt trước.',
    deliverables: ['Video theo từng chiến dịch', 'Bản xem trước để góp ý', 'Số lượt chỉnh sửa rõ ràng'],
    accent: 'bg-blue-600',
  },
  {
    icon: CalendarClock,
    number: '02',
    title: 'Vận hành giờ phát',
    description:
      'Lên lịch, phát trên kênh đủ điều kiện, giám sát trạng thái và tổng hợp thời lượng theo đơn vị giờ-kênh.',
    deliverables: ['Facebook & TikTok', 'Theo dõi giờ-kênh', 'Báo cáo trạng thái phiên'],
    accent: 'bg-amber-500',
  },
  {
    icon: MessageCircleMore,
    number: '03',
    title: 'FAQ & thu lead',
    description:
      'AI trả lời trong phạm vi dữ liệu đã duyệt, ghi nhận nhu cầu học thử và chuyển câu hỏi chuyên sâu cho tư vấn viên.',
    deliverables: ['FAQ nhất quán', 'Phân loại nhu cầu', 'Human-in-the-loop'],
    accent: 'bg-emerald-500',
  },
]

const WORKFLOW = [
  {
    icon: FileText,
    title: 'Gửi dữ liệu khóa học',
    description: 'Học phí, lịch khai giảng, đầu vào, giáo trình, ưu đãi, hình ảnh và FAQ.',
  },
  {
    icon: Sparkles,
    title: '1Stream tạo nội dung',
    description: 'Đội ngũ chuẩn hóa dữ liệu, tạo kịch bản, giọng đọc, avatar và bản video nháp.',
  },
  {
    icon: FileCheck2,
    title: 'Trung tâm duyệt',
    description: 'Chỉ phiên bản đã xác nhận mới được đưa vào lịch phát và cơ sở tri thức.',
  },
  {
    icon: Radio,
    title: 'Phát, hỗ trợ và báo cáo',
    description: 'Theo dõi phiên, hỗ trợ FAQ, thu lead và bàn giao báo cáo sau đợt.',
  },
]

const SCENARIOS = [
  {
    id: 'opening',
    tab: 'Mở lớp mới',
    title: 'Livestream tuyển sinh trước ngày khai giảng',
    subtitle: 'IELTS Foundation 5.5 · Khai giảng 28/07',
    script:
      'Bạn đang muốn bắt đầu IELTS nhưng chưa biết trình độ hiện tại? Lớp Foundation 5.5 giúp bạn củng cố ngữ pháp, từ vựng và làm quen đủ 4 kỹ năng trong 12 tuần.',
    comment: 'Em mất gốc thì có học lớp này được không ạ?',
    answer:
      'Lớp phù hợp với đầu vào khoảng 3.0–3.5. Bạn có thể đăng ký kiểm tra đầu vào miễn phí; tư vấn viên sẽ xác nhận lớp phù hợp sau khi có kết quả.',
    intent: 'Kiểm tra đầu vào',
  },
  {
    id: 'trial',
    tab: 'Thu lead học thử',
    title: 'Giới thiệu buổi học trải nghiệm',
    subtitle: 'Giao tiếp tiếng Anh · Học thử tối thứ 5',
    script:
      'Buổi học thử 60 phút tập trung phản xạ giao tiếp theo tình huống thật. Học viên được giáo viên đánh giá phát âm và gợi ý lộ trình sau buổi học.',
    comment: 'Mình muốn đăng ký học thử thì làm sao?',
    answer:
      'Bạn để lại từ khóa HỌC THỬ, 1Stream sẽ gửi biểu mẫu đăng ký. Trung tâm chỉ liên hệ khi bạn đồng ý cung cấp thông tin.',
    intent: 'Lead học thử',
  },
  {
    id: 'faq',
    tab: 'FAQ ngoài giờ',
    title: 'Giải đáp câu hỏi lặp lại ngoài khung live thật',
    subtitle: 'Tiếng Hàn TOPIK I · Cơ sở Quận 3',
    script:
      'Khóa TOPIK I dành cho người mới bắt đầu, gồm 36 buổi. Học viên được cung cấp giáo trình và tham gia nhóm chữa bài xuyên suốt khóa.',
    comment: 'Học phí bao nhiêu và có lớp cuối tuần không?',
    answer:
      'Học phí đang được duyệt là 2.800.000đ/khóa. Hiện có lớp sáng thứ 7 và chủ nhật; câu hỏi về bảo lưu sẽ được chuyển cho tư vấn viên.',
    intent: 'Học phí & lịch học',
  },
]

const PACKAGES = [
  {
    name: 'AI Agent Basic',
    price: '399.000đ',
    unit: '/ tháng',
    description: 'Bắt đầu với một kênh và bộ FAQ đã duyệt.',
    features: ['1 kênh kết nối', 'Tối đa 200 phản hồi AI/tháng', 'Ghi nhận và chuyển lead', 'Báo cáo lượt tương tác'],
  },
  {
    name: 'Tạo Video Livestream AI',
    price: '800K–1,5tr',
    unit: '/ video',
    description: 'Đầu ra trọn vẹn cho một nội dung tuyển sinh.',
    features: ['Chuẩn hóa dữ liệu & kịch bản', 'Giọng đọc hoặc avatar', 'Video nền và phụ đề', 'Bản xem trước & lượt sửa theo gói'],
    featured: true,
  },
  {
    name: 'Livestream AI Trọn Gói',
    price: 'Từ 3.000.000đ',
    unit: '/ tháng',
    description: '1Stream cùng vận hành từ dữ liệu đến báo cáo.',
    features: ['Tạo hoặc tiếp nhận video', 'Lịch phát & giám sát phiên', 'FAQ, thu và chuyển lead', 'Hạn mức giờ-kênh theo hợp đồng'],
  },
]

const FAQS = [
  {
    question: '1Stream có phải phần mềm tự phục vụ hoàn toàn không?',
    answer:
      'Chưa. Trong giai đoạn đầu, 1Stream là nền tảng có dịch vụ vận hành theo gói. Khách hàng mua đầu ra cụ thể; đội ngũ 1Stream thực hiện, kiểm soát chất lượng và bàn giao kết quả.',
  },
  {
    question: 'Một giờ-kênh được tính như thế nào?',
    answer:
      'Phát một giờ trên một kênh được tính là một giờ-kênh. Nếu phát đồng thời một giờ trên Facebook và TikTok, tổng mức sử dụng là hai giờ-kênh.',
  },
  {
    question: 'AI có tự tư vấn chuyên môn hoặc chốt thanh toán không?',
    answer:
      'Không. AI chỉ phản hồi trong phạm vi dữ liệu đã duyệt, ghi nhận nhu cầu và chuyển các câu hỏi chuyên sâu hoặc trường hợp cần cam kết cho nhân viên của trung tâm.',
  },
  {
    question: 'Cần chuẩn bị gì để tạo một phiên mẫu?',
    answer:
      'Tối thiểu gồm mô tả khóa học, học phí, lịch khai giảng, yêu cầu đầu vào, ưu đãi, quy trình đăng ký, FAQ và tài sản hình ảnh có quyền sử dụng.',
  },
]

export function LandingPage() {
  const navigate = useNavigate()
  const [activeScenario, setActiveScenario] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const scenario = SCENARIOS[activeScenario]

  return (
    <div className="overflow-hidden bg-[#f7f8fb] text-slate-950">
      <section id="hero" className="relative scroll-mt-20 border-b border-slate-200 bg-[#07172f] pt-28 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,.18)_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-blue-600/25 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-6 pb-20 lg:grid-cols-[1.03fr_.97fr] lg:items-center lg:px-8 lg:pb-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-semibold text-blue-100 backdrop-blur">
              <GraduationCap className="h-4 w-4 text-amber-400" />
              AI livestream cho trung tâm ngoại ngữ
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-6xl lg:text-[68px]">
              Biến dữ liệu khóa học thành{' '}
              <span className="text-amber-400">phiên live tuyển sinh.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              1Stream giúp trung tâm tạo video AI, vận hành giờ phát và hỗ trợ FAQ — thu lead trên cùng một quy trình có kiểm duyệt.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 bg-amber-400 px-6 font-bold text-slate-950 shadow-lg shadow-amber-400/15 hover:bg-amber-300"
                onClick={() => navigate('/login')}
              >
                <CirclePlay className="mr-2 h-5 w-5" /> Xem AI demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-white/20 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Đăng ký phiên mẫu <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
              {['Duyệt trước khi phát', 'Bắt đầu theo từng gói', 'Có người vận hành cùng'].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-emerald-400" /> {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[590px] lg:mx-0">
            <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-blue-500/25 to-amber-400/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[26px] border border-white/15 bg-white/10 p-2 shadow-2xl backdrop-blur">
              <div className="relative aspect-[4/4.1] overflow-hidden rounded-[20px] bg-slate-900 sm:aspect-[4/3.25]">
                <img
                  src="/images/education/teacher-laptop.webp"
                  alt="Giáo viên chuẩn bị nội dung tuyển sinh trực tuyến"
                  className="h-full w-full object-cover"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061429] via-transparent to-transparent" />
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-500 px-3 py-1.5 text-[11px] font-extrabold tracking-wide text-white shadow-lg">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> LIVE
                </div>
                <div className="absolute right-4 top-4 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium backdrop-blur">
                  482 đang xem
                </div>

                <div className="absolute inset-x-4 bottom-4 grid gap-3 sm:grid-cols-[1fr_170px]">
                  <div className="rounded-2xl border border-white/15 bg-[#07172f]/85 p-4 backdrop-blur-md">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-[.16em] text-amber-300">AI đang trả lời</span>
                      <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">Trong dữ liệu</span>
                    </div>
                    <p className="text-sm font-semibold">“Mất gốc có học lớp này được không?”</p>
                    <p className="mt-2 text-xs leading-5 text-slate-300">Lớp phù hợp với đầu vào 3.0–3.5. Bạn có thể đăng ký kiểm tra miễn phí trước khi xếp lớp.</p>
                  </div>
                  <div className="hidden rounded-2xl bg-amber-400 p-4 text-slate-950 sm:block">
                    <Target className="h-5 w-5" />
                    <p className="mt-3 text-2xl font-black">12</p>
                    <p className="text-xs font-semibold">lead muốn học thử</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-7 -left-5 hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 pr-5 text-slate-950 shadow-xl sm:flex">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700"><Share2 className="h-5 w-5" /></div>
              <div><p className="text-xs text-slate-500">Phiên hôm nay</p><p className="text-sm font-bold">2,5 giờ-kênh đã dùng</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-slate-200 px-6 sm:grid-cols-4 sm:divide-y-0 lg:px-8">
          {[
            ['Ngành ưu tiên', 'Anh ngữ & Hàn ngữ'],
            ['Kênh triển khai', 'Facebook · TikTok'],
            ['Đơn vị vận hành', 'Theo giờ-kênh'],
            ['Mô hình ban đầu', 'Dịch vụ theo gói'],
          ].map(([label, value]) => (
            <div key={label} className="px-4 py-6 first:pl-0 sm:py-7 sm:text-center">
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-slate-400">{label}</p>
              <p className="mt-1.5 text-sm font-bold text-slate-800">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="solutions" className="scroll-mt-20 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Một đầu mối, ba đầu ra"
            title="Không chỉ tạo avatar. 1Stream cùng bạn vận hành cả đợt tuyển sinh."
            description="Bắt đầu từ một video, bổ sung giờ phát hoặc chọn gói trọn bộ tùy mức độ sẵn sàng của trung tâm."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {SERVICES.map((service) => {
              const Icon = service.icon
              return (
                <article key={service.title} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className={cn('absolute inset-x-0 top-0 h-1', service.accent)} />
                  <div className="flex items-start justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white"><Icon className="h-6 w-6" /></div>
                    <span className="text-4xl font-black text-slate-100">{service.number}</span>
                  </div>
                  <h3 className="mt-7 text-xl font-black tracking-tight">{service.title}</h3>
                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">{service.description}</p>
                  <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                    {service.deliverables.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700"><Check className="h-4 w-4 text-emerald-500" />{item}</li>
                    ))}
                  </ul>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section id="workflow" className="scroll-mt-20 bg-[#07172f] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-amber-400">Quy trình có kiểm duyệt</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-.03em] sm:text-5xl">Từ file học phí đến phiên live, không bỏ qua bước duyệt.</h2>
              <p className="mt-5 max-w-lg leading-7 text-slate-300">Mọi nội dung và câu trả lời đều bắt đầu từ dữ liệu do trung tâm xác nhận. Những trường hợp ngoài phạm vi được chuyển cho con người.</p>
              <a
                href="/samples/1stream-course-input-template.csv"
                download
                className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold transition hover:bg-white/15"
              >
                <FileText className="h-4 w-4 text-amber-400" /> Tải file input mẫu (.csv)
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {WORKFLOW.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.title} className="rounded-2xl border border-white/10 bg-white/[.06] p-6">
                    <div className="flex items-center justify-between">
                      <Icon className="h-6 w-6 text-amber-400" />
                      <span className="font-mono text-xs text-slate-500">0{index + 1}</span>
                    </div>
                    <h3 className="mt-5 font-bold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{step.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="scenarios" className="scroll-mt-20 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Kịch bản thực tế"
            title="Được thiết kế quanh hành trình tuyển sinh, không phải bán hàng đại trà."
            description="Bộ mock hiện tại minh họa ba tình huống phù hợp với trung tâm ngoại ngữ trong giai đoạn pilot."
          />
          <div className="mt-10 flex flex-wrap gap-2">
            {SCENARIOS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveScenario(index)}
                className={cn(
                  'rounded-full px-4 py-2.5 text-sm font-bold transition',
                  activeScenario === index ? 'bg-slate-950 text-white shadow-lg' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-400',
                )}
              >
                {item.tab}
              </button>
            ))}
          </div>

          <div className="mt-6 grid overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl lg:grid-cols-[.9fr_1.1fr]">
            <div className="relative min-h-[440px] overflow-hidden bg-slate-900">
              <img src="/images/education/language-classroom.webp" alt="Lớp học ngoại ngữ" className="absolute inset-0 h-full w-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07172f] via-[#07172f]/45 to-transparent" />
              <div className="relative flex h-full min-h-[440px] flex-col justify-between p-7 sm:p-10">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-500 px-3 py-1.5 text-xs font-black text-white"><span className="h-2 w-2 rounded-full bg-white" /> LIVE PREVIEW</span>
                  <span className="rounded-full bg-black/40 px-3 py-1.5 text-xs text-white backdrop-blur">Facebook</span>
                </div>
                <div className="text-white">
                  <p className="text-sm font-bold text-amber-300">{scenario.subtitle}</p>
                  <h3 className="mt-3 max-w-md text-3xl font-black tracking-tight">{scenario.title}</h3>
                  <p className="mt-4 max-w-lg text-sm leading-6 text-slate-200">“{scenario.script}”</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col bg-[#fbfcfe]">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div className="flex items-center gap-2"><Bot className="h-5 w-5 text-blue-600" /><span className="text-sm font-black">AI Lead Assistant</span></div>
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Đang giám sát</span>
              </div>
              <div className="flex-1 space-y-5 p-6 sm:p-8">
                <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white p-4 shadow-sm ring-1 ring-slate-200">
                  <div className="mb-2 flex items-center justify-between"><span className="text-xs font-bold">Thảo Nguyễn</span><span className="text-[10px] text-slate-400">20:14</span></div>
                  <p className="text-sm leading-6 text-slate-700">{scenario.comment}</p>
                </div>
                <div className="ml-auto max-w-[92%] rounded-2xl rounded-tr-sm bg-blue-600 p-4 text-white shadow-lg shadow-blue-600/15">
                  <div className="mb-2 flex items-center gap-2"><Sparkles className="h-3.5 w-3.5 text-amber-300" /><span className="text-xs font-black">1Stream AI</span></div>
                  <p className="text-sm leading-6 text-blue-50">{scenario.answer}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Ý định</p><p className="mt-1 text-sm font-black">{scenario.intent}</p></div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Hành động</p><p className="mt-1 flex items-center gap-1.5 text-sm font-black text-emerald-600"><UserRoundCheck className="h-4 w-4" /> Ghi nhận / chuyển lead</p></div>
                </div>
              </div>
              <div className="flex items-center gap-3 border-t border-slate-200 bg-white p-4">
                <div className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-400">Nhập bình luận mô phỏng...</div>
                <button type="button" aria-label="Gửi bình luận mẫu" className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-white"><Send className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="audience" className="scroll-mt-20 bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="relative overflow-hidden rounded-[28px]">
              <img src="/images/education/language-classroom.webp" alt="Trung tâm ngoại ngữ tổ chức lớp học" className="aspect-[4/3] h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
              <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur-md">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-amber-300">ICP giai đoạn đầu</p>
                <p className="mt-2 text-lg font-black">Trung tâm tiếng Anh, tiếng Hàn tại TP.HCM</p>
              </div>
            </div>
            <div className="lg:pl-8">
              <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">Phù hợp nhất khi</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-.03em] sm:text-5xl">Đội ngũ nhỏ, dữ liệu sẵn, nhu cầu lặp lại.</h2>
              <div className="mt-8 space-y-5">
                {[
                  [UsersRound, 'Đội marketing – livestream – tư vấn khoảng 3–5 người.'],
                  [Clock3, 'Đang live 2–3 buổi/tuần hoặc muốn mua thêm giờ phát.'],
                  [BookOpen, 'Có bảng học phí, lịch khai giảng, FAQ và tài sản truyền thông.'],
                  [Target, 'Dẫn người xem đến học thử, inbox, biểu mẫu hoặc tư vấn.'],
                ].map(([Icon, text]) => {
                  const ItemIcon = Icon as typeof UsersRound
                  return <div key={text as string} className="flex items-start gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><ItemIcon className="h-5 w-5" /></div><p className="pt-2 text-sm font-semibold leading-6 text-slate-700">{text as string}</p></div>
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-20 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Gói pilot dự kiến"
            title="Mua đúng đầu ra cần thử, chưa cần cam kết hệ thống dài hạn."
            description="Mức giá dưới đây dùng cho giai đoạn pilot và được chốt lại theo số kênh, giờ-kênh, lượt phản hồi, số video và mức hỗ trợ."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {PACKAGES.map((plan) => (
              <article key={plan.name} className={cn('relative flex flex-col rounded-3xl border p-7', plan.featured ? 'border-blue-600 bg-[#07172f] text-white shadow-2xl shadow-blue-950/15' : 'border-slate-200 bg-white')}>
                {plan.featured ? <span className="absolute -top-3 left-7 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-950">Phù hợp để bắt đầu</span> : null}
                <h3 className="text-lg font-black">{plan.name}</h3>
                <p className={cn('mt-2 min-h-12 text-sm leading-6', plan.featured ? 'text-slate-300' : 'text-slate-500')}>{plan.description}</p>
                <div className="mt-6"><span className="text-3xl font-black tracking-tight">{plan.price}</span><span className={cn('ml-1 text-xs', plan.featured ? 'text-slate-400' : 'text-slate-500')}>{plan.unit}</span></div>
                <ul className="mt-7 flex-1 space-y-3 border-t border-current/10 pt-6">
                  {plan.features.map((feature) => <li key={feature} className="flex items-start gap-2.5 text-sm"><Check className={cn('mt-0.5 h-4 w-4 shrink-0', plan.featured ? 'text-amber-400' : 'text-emerald-500')} />{feature}</li>)}
                </ul>
                <Button className={cn('mt-8 w-full', plan.featured ? 'bg-amber-400 text-slate-950 hover:bg-amber-300' : '')} variant={plan.featured ? 'default' : 'outline'} onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Trao đổi gói pilot</Button>
              </article>
            ))}
          </div>
          <p className="mt-5 text-center text-xs text-slate-500">AI Agent Growth: 799.000đ/tháng · tối đa 3 kênh và 1.000 lượt phản hồi AI. Enterprise và dịch vụ bổ sung báo giá theo nhu cầu.</p>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[.85fr_1.15fr] lg:px-8">
          <div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><ShieldCheck className="h-6 w-6" /></div>
            <h2 className="mt-6 text-3xl font-black tracking-tight">Rõ phạm vi AI, rõ trách nhiệm con người.</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">1Stream không cam kết tăng lead hoặc thay thế tư vấn viên. Mục tiêu là giảm phần việc lặp lại, giữ nội dung nhất quán và đo hiệu quả thật trong pilot.</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {['Dữ liệu được duyệt', 'Có cơ chế chuyển người thật', 'Kiểm tra quyền nội dung', 'Theo dõi sự cố phiên'].map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">{tag}</span>)}
            </div>
          </div>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {FAQS.map((faq, index) => (
              <div key={faq.question}>
                <button type="button" className="flex w-full items-center justify-between gap-6 py-5 text-left" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>
                  <span className="font-bold">{faq.question}</span><ChevronDown className={cn('h-5 w-5 shrink-0 text-slate-400 transition-transform', openFaq === index && 'rotate-180')} />
                </button>
                {openFaq === index ? <p className="max-w-2xl pb-5 text-sm leading-7 text-slate-600">{faq.answer}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-20 bg-amber-400 py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-amber-900">Bắt đầu bằng một phiên mẫu</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-.03em] text-slate-950 sm:text-5xl">Gửi một khóa học. Nhận một kịch bản live có thể duyệt.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-amber-950/75">Chuẩn bị file input mẫu và trao đổi với đội ngũ 1Stream về kênh, thời lượng và mục tiêu thu lead.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a href="mailto:hello@1stream.ai?subject=Đăng ký phiên livestream AI mẫu" className="inline-flex h-12 items-center justify-center rounded-xl bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-slate-800"><Headphones className="mr-2 h-4 w-4" /> Đăng ký tư vấn</a>
            <Button className="h-12 border-amber-700/20 bg-white px-6 text-slate-950 hover:bg-amber-50" onClick={() => navigate('/login')}><CirclePlay className="mr-2 h-4 w-4" /> Mở AI demo</Button>
          </div>
        </div>
      </section>

      <footer className="bg-[#07172f] py-10 text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-3"><img src="/images/1stream-mark.png" alt="" className="h-9 w-9 rounded-lg bg-white object-cover" /><div><p className="font-black tracking-wider text-white">1STREAM</p><p className="text-[10px] uppercase tracking-[.16em]">AI livestream for education</p></div></div>
          <div className="flex flex-wrap gap-5 text-xs font-semibold"><button type="button" onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}>Giải pháp</button><button type="button" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>Gói pilot</button><a href="/samples/1stream-course-input-template.csv" download>Input mẫu</a></div>
          <p className="text-xs">© 2026 1Stream. Pilot product.</p>
        </div>
      </footer>
    </div>
  )
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-black uppercase tracking-[.2em] text-blue-700">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-black tracking-[-.035em] sm:text-5xl">{title}</h2>
      <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
    </div>
  )
}
