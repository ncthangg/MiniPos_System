# POS Frontend App

## Tổng quan

Đây là một ứng dụng Frontend cho hệ thống Point of Sale (POS) được xây dựng bằng **React 19.2.0** với **TypeScript**, hỗ trợ quản lý sản phẩm và đơn hàng theo thời gian thực.

## Kiến trúc dự án

Dự án được tổ chức theo mô hình **Component-Based Architecture** với cấu trúc thư mục rõ ràng:

```
POS.FE/
├── src/
│   ├── components/         # Presentation Layer - Reusable UI Components
│   ├── pages/             # Page Layer - Main application pages
│   ├── services/          # Service Layer - API communication
│   ├── hooks/             # Custom Hooks - Business logic
│   ├── models/            # Data Layer - Types & interfaces
│   ├── layouts/           # Layout Components
│   ├── routers/           # Routing configuration
│   ├── signalr/           # Real-time communication
│   ├── styles/            # Styling & theme system
│   └── config/            # Application configuration
```

### Chi tiết các Layer:

#### 🎯 **Components Layer** (Presentation)
- **Items**: `ProductItem`, `OrderItem` - Component hiển thị từng item
- **Lists**: `ProductList`, `OrderList` - Component hiển thị danh sách
- **Modals**: `ConfirmModal`, `OrderDetail` - Component modal
- **UICustoms**: `Button`, `Spinner` - Custom UI components

#### 📄 **Pages Layer** (Application)
- **MainBoardPage**: Trang chính với 2 side (Product & Order)
- **OrderPage**: Trang quản lý đơn hàng chi tiết
- **Responsive Layout**: Hỗ trợ mobile và desktop

#### 🔗 **Services Layer** (Infrastructure)
- **API Service**: Axios-based HTTP client
- **Axios Instance**: Configured interceptors và error handling
- **Endpoints**: Centralized API endpoint management

#### 🎣 **Hooks Layer** (Business Logic)
- **useSignalRGroup**: Custom hook quản lý SignalR connections
- **State Management**: React hooks cho local state

#### 📦 **Models Layer** (Data)
- **TypeScript Interfaces**: Product, Order, OrderItem types
- **Enums**: OrderStatus, response codes
- **API Types**: Request/Response models

## Tính năng chính

### 🛍️ **Quản lý Sản phẩm**
- Hiển thị danh sách sản phẩm với grid responsive
- Hỗ trợ hình ảnh sản phẩm với placeholder fallback
- Loading states với spinner animation
- Thêm sản phẩm vào giỏ hàng với validation

### 🛒 **Giỏ hàng và Thanh toán**
- Quản lý giỏ hàng: thêm, xóa, tăng/giảm số lượng
- Tính toán tự động tổng tiền và số lượng
- Cart popup với animation smooth
- Modal xác nhận thanh toán với chi tiết đơn hàng
- Validation form và error handling

### 📋 **Quản lý Đơn hàng**
- Danh sách đơn hàng với phân trang
- Tìm kiếm đơn hàng với debounce optimization
- Sắp xếp theo ngày tạo, tổng tiền
- Chi tiết đơn hàng trong modal
- Hiển thị trạng thái đơn hàng với color coding

### 🔔 **Real-time Communication**
- SignalR Hub connection với auto-reconnect
- Real-time notifications cho đơn hàng mới
- Group-based messaging cho từng trang
- Connection status indicator (LIVE/OFFLINE)
- Toast notifications cho events

## Công nghệ sử dụng

- **Framework**: React 19.2.0 với TypeScript
- **Build Tool**: Vite 7.2.4 với HMR
- **Routing**: React Router DOM 7.11.0
- **Styling**: Tailwind CSS + CSS Modules
- **HTTP Client**: Axios 1.13.2 với interceptors
- **Real-time**: Microsoft SignalR 10.0.0
- **Icons**: Lucide React 0.562.0
- **Notifications**: React Toastify 11.0.5
- **State Management**: React Hooks + Custom Hooks

## Cấu trúc thư mục chi tiết

```
src/
├── components/                 # Reusable UI Components
│   ├── Items/                 # Individual item components
│   │   ├── OrderItem.tsx      # Order item display component
│   │   ├── ProductItem.tsx    # Product item display component
│   │   └── ProductItem.module.css
│   ├── Lists/                 # List container components
│   │   ├── OrderList.tsx      # Orders list with pagination
│   │   ├── ProductList.tsx    # Products grid layout
│   │   └── ProductList.module.css
│   ├── Modals/                # Modal dialog components
│   │   ├── ConfirmModal.tsx   # Payment confirmation modal
│   │   └── OrderDetail.tsx    # Order details modal
│   └── UICustoms/             # Custom UI components
│       ├── Button.tsx         # Styled button component
│       └── Snipper.tsx        # Loading spinner component
├── config/                    # Application configuration
│   └── config.ts             # Environment & API config
├── hooks/                     # Custom React hooks
│   └── useSignalRGroup.ts    # SignalR connection management
├── layouts/                   # Layout components
│   └── MainBoardLayout.tsx   # Main application layout
├── models/                    # TypeScript type definitions
│   ├── index.ts              # API response/request types
│   ├── enum.ts               # Application enums
│   └── endpoints.ts          # API endpoint constants
├── pages/                     # Application pages
│   ├── MainBoardPage/        # Main dashboard page
│   │   ├── index.tsx         # Main page component
│   │   ├── OrderSide/        # Order management section
│   │   │   └── index.tsx
│   │   └── ProductSide/      # Product & cart section
│   │       ├── index.tsx
│   │       └── components/
│   │           ├── Cart.tsx      # Shopping cart component
│   │           └── CartPopup.tsx # Cart popup overlay
│   └── OrderPage/            # Order management page
│       └── index.tsx
├── routers/                   # Application routing
│   └── AppRouter.tsx         # Main router configuration
├── services/                  # External service integrations
│   ├── api.ts                # API service class
│   └── axiosIntance.ts       # Axios HTTP client setup
├── signalr/                   # Real-time communication
│   └── connection.ts         # SignalR connection setup
├── styles/                    # Styling & theming
│   ├── index.css             # Global CSS styles
│   ├── theme.ts              # Theme configuration
│   └── tokens/               # Design system tokens
│       ├── colors.ts         # Color palette
│       ├── fronts.ts         # Typography tokens
│       └── sizes.ts          # Spacing & sizing tokens
├── App.tsx                    # Root application component
└── main.tsx                   # Application entry point
```

## API Integration

### Base Configuration
```typescript
// config/config.ts
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  signalRHubUrl: import.meta.env.VITE_SIGNALR_HUB_URL || 'http://localhost:5000/orderHub'
}
```

### Products API Integration
```typescript
// Lấy danh sách sản phẩm
GET /api/products

// Response format
interface ProductResponse {
  data: Product[];
  statusCode: number;
  code: string;
}
```

### Orders API Integration
```typescript
// Lấy danh sách đơn hàng với phân trang
GET /api/orders?pageNumber=1&pageSize=10&sortField=CreatedAt&sortDirection=desc

// Tạo đơn hàng mới
POST /api/orders
{
  "totalAmount": number,
  "totalItem": number,
  "items": OrderItemRequest[]
}

// Lấy chi tiết đơn hàng
GET /api/orders/{orderId}
```

## SignalR Real-time Features

### Connection Management
```typescript
// signalr/connection.ts
- Automatic connection với retry logic
- Connection state management
- Group subscription management
```

### Real-time Events
- **OrderCreated**: Nhận thông báo đơn hàng mới
- **Connection Status**: Hiển thị trạng thái kết nối
- **Group Management**: Join/leave groups theo trang

### Group Names
- `page:order:list` - Notifications cho trang danh sách đơn hàng
- `page:main:board` - Notifications cho trang chính

## Cài đặt và Chạy dự án

### Yêu cầu hệ thống
- **Node.js**: >= 18.0.0
- **Package Manager**: npm hoặc yarn
- **Browser**: Modern browsers với ES2020 support

### Các bước cài đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd POS.FE
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Cấu hình môi trường**
   - Copy file environment template:
```bash
cp env.example .env
```
   - Cập nhật các biến môi trường:
```env
# API Configuration  
VITE_API_BASE_URL=http://localhost:5000/api

# SignalR Configuration
VITE_SIGNALR_HUB_URL=http://localhost:5000/orderHub
```

4. **Chạy development server**
```bash
npm run dev
```
   - Ứng dụng sẽ chạy tại: `http://localhost:5173`
   - Hot Module Replacement (HMR) được kích hoạt

5. **Build cho production**
```bash
npm run build
```
   - Output: `dist/` folder
   - Optimized và minified code

6. **Preview production build**
```bash
npm run preview
```
   - Test production build locally

7. **Linting và Code Quality**
```bash
npm run lint        # ESLint checking
npm run lint:fix    # Auto-fix linting issues
```

### Development Workflow

#### File Structure Convention
- **PascalCase**: Component files (`.tsx`)
- **camelCase**: Utility files (`.ts`)
- **kebab-case**: CSS modules (`.module.css`)
- **UPPER_CASE**: Constants và enums

#### Code Style Guidelines
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured với React hooks rules
- **Prettier**: Code formatting (nếu có)
- **CSS Modules**: Scoped styling cho components


### Build Configuration
```typescript
// vite.config.ts
- TypeScript compilation
- Asset optimization
- Environment variable handling
- Bundle splitting strategy
```

### Environment Variables
```env
# Development
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SIGNALR_HUB_URL=http://localhost:5000/orderHub

# Production
VITE_API_BASE_URL=https://api.yourapp.com/api
VITE_SIGNALR_HUB_URL=https://api.yourapp.com/orderHub
```

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: ES2020, CSS Grid, Flexbox, WebSocket

---

**Phát triển bởi**: Visnam Team  
**Công nghệ**: React + TypeScript + Vite  
**Version**: 1.0.0