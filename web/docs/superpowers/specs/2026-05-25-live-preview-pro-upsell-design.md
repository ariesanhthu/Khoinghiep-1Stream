# Live Preview — PRO Upsell Redesign

## Overview

Redesign trang Live Preview để tích hợp hệ thống freemium PRO upsell. User free vẫn sử dụng được các tính năng cơ bản (live, chatbox, camera filters, sentiment, hot leads). Các tính năng nâng cao được gắn badge PRO, khi bấm vào hiện modal upsell có video demo.

## Free vs PRO Features

| Tính năng | Free | PRO |
|---|---|---|
| Camera Filters (Retro, Cool, Glow, B&W) | Yes | Yes |
| Sentiment Analysis (overlay) | Yes | Yes |
| Hot Leads Detection | Yes | Yes |
| Live Chatbox (manual comments) | Yes | Yes |
| Video generation | Lip-sync only | AI generate dynamic |
| AI Copilot commands | No (badge PRO) | Yes |
| Auto-reply AI (bot tự trả lời) | No (badge PRO) | Yes |
| Overlay controls (Watermark, Ticker) | No (badge PRO) | Yes |

## Design Approach: Contextual Teaser

Badge PRO nhỏ gắn cạnh tính năng, tooltip mô tả khi hover, modal upsell với video demo khi bấm. Nút "Xem PRO" trên phone frame có glow pulse để hướng mắt user.

---

## Component 1: PRO Badge

**Vị trí**: cạnh tên tính năng PRO (Copilot section header, Auto-reply toggle, Overlay section header, nút "Tạo Video AI Động").

**Visual**:
- Pill nhỏ, `background: linear-gradient(135deg, #8b5cf6, #6d28d9)`, text white
- Font: 9px, font-weight 800, border-radius 99px, padding 2px 7px
- Letter-spacing 0.5px

**Behavior**:
- Clickable — bấm mở Modal Upsell (Component 3)
- Cursor: pointer

**Disabled state cho controls PRO**:
- Toggle switches: opacity 0.5, không tương tác được
- Copilot command buttons: opacity 0.6, hover vẫn hiện tooltip

---

## Component 2: PRO Tooltip (Hover)

**Trigger**: hover vào badge PRO hoặc tên tính năng PRO.

**Visual**:
- Position: absolute, phía trên element, centered
- Background: #1e1e2e, border: 1px solid #8b5cf6
- Border-radius: 10px, padding: 12px
- Box-shadow: 0 8px 24px rgba(139, 92, 246, 0.25)
- Arrow triangle ở dưới pointing down

**Content**:
- Title: tên tính năng, 11px bold white
- Description: 1-2 dòng mô tả ngắn, 10px #aaa
- CTA link: "Xem demo →", 10px bold #8b5cf6, click → mở Modal

**Tooltip content per feature**:
- AI Copilot: "Copilot ra lệnh bán hàng, đọc bình luận, kể chuyện — tất cả tự động 24/7."
- Auto-reply AI: "AI tự nhận diện câu hỏi và trả lời realtime trong chatbox. Không bỏ lỡ khách hàng."
- Overlay: "Tùy chỉnh watermark thương hiệu, ticker khuyến mãi chạy ngang — chuyên nghiệp hơn."
- Video AI Động: "Video AI generate biểu cảm, cử chỉ tự nhiên — không chỉ nhép miệng."

---

## Component 3: Modal Upsell

**Trigger**: bấm badge PRO, hoặc bấm "Xem demo →" trong tooltip.

**Visual**:
- Overlay: background rgba(0,0,0,0.7), toàn màn hình
- Modal: background #13162a, border 1px solid #2a2d3e, border-radius 16px, width 480px, max-width 90vw (responsive)
- Box-shadow: 0 20px 60px rgba(0,0,0,0.5)

**Structure**:
1. **Video area** (top):
   - Height: 200px, background gradient tím tối
   - Play button circle ở center (click để play video/gif demo)
   - Badge "PRO FEATURE" góc trên phải
   - Video content: placeholder cho lần implement đầu (gradient + play icon + label tên feature). Khi có video thật, thay bằng `<video>` tag autoplay muted loop

2. **Content area** (bottom):
   - Title: tên tính năng, 18px font-weight 800 white
   - Description: 12px #888, line-height 1.6
   - Checklist PRO features: 4 items, icon ✓ tím + text 11px
   - CTA buttons:
     - Primary: "Nâng cấp PRO — 299K/tháng", gradient tím, full-width flex-1, border-radius 10px
     - Secondary: "Để sau", transparent border #333, color #888

**Animation**: fade-in + scale from 0.95 → 1.0, duration 200ms ease-out.

---

## Component 4: Phone PRO Preview Button

**Vị trí**: góc trên phải phone frame, bên dưới Sentiment Card (absolute, top 40px right 12px, z-index 20). Sentiment Card hiện tại ở top-4 right-4, nên nút PRO nằm thấp hơn để tránh đè.

**Visual**:
- Background: linear-gradient(135deg, #8b5cf6, #6d28d9)
- Text: "✨ Xem PRO", white, 8px font-weight 800
- Padding: 5px 10px, border-radius 99px
- Box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4)
- **Glow pulse animation**: ring bao quanh, rgba(139,92,246,0.3), animation pulse 2s ease-in-out infinite

**Behavior**: bấm → mở Mini Phone Panel (Component 5).

---

## Component 5: Mini Phone PRO Panel

**Trigger**: bấm nút "Xem PRO" trên phone frame.

**Position**: bên phải phone frame chính, slide-in animation từ phải (translateX(100%) → translateX(0), 300ms ease-out).

**Visual**:
- Height: 70% chiều cao phone chính (aspect ratio 9:16 giữ nguyên, width tự tính = height × 9/16)
- Background: gradient #1a1040 → #0d1025
- Border: 1.5px solid #8b5cf6, border-radius 14px
- Box-shadow: 0 0 24px rgba(139, 92, 246, 0.25)

**Content**:
- Badge "✨ PRO PREVIEW" top center (gradient tím pill)
- Play button center (circle, border primary, play triangle icon)
- Label: "AI Generate Động" + subtitle "So sánh chất lượng video"
- CTA button bottom: "Nâng cấp PRO", full-width gradient tím, border-radius 8px
- Close button: top right, 20x20 circle, bg rgba(0,0,0,0.4), "✕"

**Close behavior**: bấm ✕ hoặc bấm ngoài panel → slide-out về phải + fade.

---

## Component 6: Asset Card (Redesign)

**Thay đổi**: thêm thumbnail preview area phía trên thông tin text.

**Structure mới**:
```
┌─────────────────────────┐
│   Thumbnail (72px h)    │  ← gradient bg hoặc actual image
│   [Duration badge]      │  ← góc dưới phải "0:15"
│   [Status badge]        │  ← góc trên trái "ĐANG PHÁT" (nếu active)
├─────────────────────────┤
│  Title                  │
│  Subtitle (type · dur)  │
└─────────────────────────┘
```

**Visual**:
- Container: bg #1a1d2e, border 1px solid #2a2d3e (active: border-primary), border-radius 8px, overflow hidden
- Thumbnail area: 72px height, background gradient (hoặc actual frame capture nếu có)
- Duration badge: absolute bottom-right, bg rgba(0,0,0,0.7), padding 2px 6px, border-radius 4px, font 8px white bold
- Status badge (khi active): absolute top-left, bg primary, font 7px white 800, "ĐANG PHÁT"
- Text area: padding 8px 10px
  - Title: 10px white bold
  - Subtitle: 9px #888, format "Lip-sync · {duration}"

---

## Component 7: Tạo Video AI Buttons

**Thay đổi**: tách nút "Tạo Video AI" thành 2 nút riêng biệt.

**Nút 1 — Free**:
- Text: "➕ Tạo Video Lip-sync"
- Style: bg #1a1d2e, border #2a2d3e, color white, height 9 (h-9)
- Behavior: tạo video lip-sync (existing flow)

**Nút 2 — PRO**:
- Text: "✨ Tạo Video AI Động" + badge PRO pill
- Style: bg gradient rgba(139,92,246,0.15), border rgba(139,92,246,0.3), color white
- Behavior: user free → bấm mở Modal Upsell; user PRO → tạo video AI dynamic

---

## State Management

Thêm vào component hoặc store:
- `isPro: boolean` — trạng thái user (mock = false cho demo)
- `proModalOpen: boolean` — modal upsell đang mở
- `proModalFeature: string | null` — tính năng đang hiển thị trong modal
- `proPhoneVisible: boolean` — mini phone panel đang hiện

---

## Files Affected

- `LivePreviewPage.tsx` — thêm state proModalOpen, proPhoneVisible; truyền isPro xuống components
- `LiveControlsPanel.tsx` — thêm badge PRO cho Copilot section, Overlay section; disable toggles khi !isPro
- `LiveChatPanel.tsx` — thêm badge PRO cho Auto-reply AI indicator
- `LivePhoneFrame.tsx` — thêm nút "Xem PRO" + mini phone panel
- `AssetCard.tsx` — redesign thêm thumbnail area
- **Mới**: `components/ProBadge.tsx` — reusable PRO badge pill component
- **Mới**: `components/ProTooltip.tsx` — tooltip hover component
- **Mới**: `components/ProUpsellModal.tsx` — modal upsell với video demo
- **Mới**: `components/MiniProPhone.tsx` — mini phone PRO preview panel

---

## Animations

| Element | Animation | Duration | Easing |
|---|---|---|---|
| PRO badge glow | pulse ring opacity | 2s | ease-in-out, infinite |
| Tooltip | fade-in + translateY(-4px) | 150ms | ease-out |
| Modal | fade-in + scale(0.95→1) | 200ms | ease-out |
| Mini phone panel | slide-in translateX(100%→0) | 300ms | ease-out |
| Mini phone close | slide-out + fade | 250ms | ease-in |

---

## Design Tokens (CSS)

```css
--pro-gradient: linear-gradient(135deg, #8b5cf6, #6d28d9);
--pro-glow: rgba(139, 92, 246, 0.25);
--pro-border: rgba(139, 92, 246, 0.3);
--pro-bg-subtle: rgba(139, 92, 246, 0.15);
```
