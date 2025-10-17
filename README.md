# 🚗 Garage Platform - Frontend

Modern, scalable frontend application for the Garage Reservation Platform built with **Next.js 15**, **TypeScript**, **Zustand**, and **TanStack Query**.

## 🏗️ Architecture Overview

### Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand (global state)
- **Data Fetching**: TanStack Query v5 (server state)
- **Form Management**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom component library
- **Notifications**: Sonner

### Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── auth/                    # Authentication pages
│   │   ├── signin/
│   │   └── signup/
│   ├── reservation/             # Reservation flow
│   │   └── new/                # New reservation wizard
│   ├── reservations/            # User reservations
│   │   ├── [id]/               # Reservation detail
│   │   └── page.tsx
│   ├── layout.tsx              # Root layout with providers
│   └── page.tsx                # Landing page
│
├── components/                  # React components
│   ├── ui/                     # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── textarea.tsx
│   └── features/               # Feature-specific components
│       ├── auth/               # Authentication components
│       │   ├── SignInForm.tsx
│       │   └── SignUpForm.tsx
│       └── reservation/        # Reservation components
│           ├── ReservationWizard.tsx
│           ├── GarageSelector.tsx
│           ├── ServiceSelector.tsx
│           ├── TimeSlotSelector.tsx
│           ├── ReservationConfirmation.tsx
│           └── ReservationCard.tsx
│
├── lib/                        # Core application logic
│   ├── api/                   # API client and endpoints
│   │   ├── client.ts          # Axios instance with interceptors
│   │   ├── auth.ts            # Authentication API
│   │   ├── garages.ts         # Garages API
│   │   ├── reservations.ts    # Reservations API
│   │   └── services.ts        # Services & Categories API
│   │
│   ├── hooks/                 # TanStack Query hooks
│   │   ├── useAuth.ts         # Auth mutations
│   │   ├── useGarages.ts      # Garage queries
│   │   ├── useReservations.ts # Reservation queries & mutations
│   │   └── useServices.ts     # Service queries
│   │
│   ├── store/                 # Zustand stores
│   │   ├── authStore.ts       # Authentication state
│   │   └── reservationStore.ts # Reservation form state
│   │
│   ├── types/                 # TypeScript types
│   │   └── index.ts           # All type definitions
│   │
│   ├── utils/                 # Utility functions
│   │   ├── cn.ts              # Class name merger
│   │   ├── date.ts            # Date formatting utilities
│   │   └── formatting.ts      # Data formatting utilities
│   │
│   └── validations/           # Zod schemas
│       ├── auth.ts            # Auth validation
│       └── reservation.ts     # Reservation validation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- Backend API running on `http://localhost:3001`

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment**:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_NAME=Garage Platform
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Run development server**:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📚 Key Features

### 1. Authentication System
- **Sign Up**: User registration with validation
- **Sign In**: JWT-based authentication
- **Persistent Sessions**: Zustand persist middleware
- **Protected Routes**: Auth guards for private pages

### 2. Reservation System

#### Multi-Step Wizard
1. **Garage Selection**: Browse and filter garages by city
2. **Service Selection**: Choose service by category
3. **Time Slot Selection**: Pick date and available time
4. **Confirmation**: Review and submit reservation

#### Features:
- Real-time availability checking
- Optimistic UI updates
- Form state persistence
- Validation at each step

### 3. Reservation Management
- View all user reservations
- Reservation details with actions
- Accept quotes from garages
- Cancel reservations with reason
- Status tracking and updates

## 🔧 State Management Architecture

### Zustand (Client State)

#### Auth Store
```typescript
useAuthStore()
  ├── user: User | null
  ├── accessToken: string | null
  ├── isAuthenticated: boolean
  ├── setAuth(user, token)
  ├── clearAuth()
  └── updateUser(data)
```

#### Reservation Store
```typescript
useReservationStore()
  ├── currentStep: number
  ├── selectedGarageId: number | null
  ├── selectedServiceId: number | null
  ├── selectedTimeSlot: string | null
  ├── formData: Partial<CreateReservationData>
  ├── setGarage(id)
  ├── setService(id)
  ├── setTimeSlot(slot)
  ├── nextStep()
  ├── previousStep()
  └── reset()
```

### TanStack Query (Server State)

#### Query Keys Structure
```typescript
['auth', 'profile']
['garages']
['garages', filters]
['garages', id]
['services']
['services', id]
['categories']
['reservations']
['reservations', filters]
['reservations', id]
['availability', data]
['available-slots', garageId, serviceId, date]
```

#### Caching Strategy
- **Garages**: 5 minutes stale time
- **Services**: 10 minutes stale time
- **Reservations**: 30 seconds stale time
- **Availability**: 10 seconds stale time

## 🎨 UI Components

### Base Components (`components/ui/`)
- **Button**: Variants (default, outline, ghost, destructive)
- **Input**: With error handling
- **Textarea**: Multi-line input with validation
- **Card**: Container with header, content, footer
- **Badge**: Status indicators with variants

### Feature Components (`components/features/`)
- **Authentication**: SignInForm, SignUpForm
- **Reservation**: Full wizard flow with 5+ components
- **Reusable**: ReservationCard for list views

## 🔒 API Integration

### Axios Client Configuration
```typescript
// Automatic token injection
// Error handling and retry logic
// 401 redirect to login
// Response/Request interceptors
```

### API Endpoints

#### Authentication
```typescript
POST /auth/signup
POST /auth/signin
POST /auth/signout
GET  /auth/profile
```

#### Garages
```typescript
GET  /garages
GET  /garages/:id
POST /garages
```

#### Reservations
```typescript
POST /reservations/check-availability
GET  /reservations/available-slots
POST /reservations
GET  /reservations
GET  /reservations/:id
PATCH /reservations/:id/confirm
PATCH /reservations/:id/provide-quote
PATCH /reservations/:id/accept-quote
PATCH /reservations/:id/start
PATCH /reservations/:id/complete
PATCH /reservations/:id/cancel
```

#### Services
```typescript
GET /services
GET /services/:id
GET /categories
GET /categories/:id
```

## 📝 Form Validation

### Zod Schemas

#### Sign Up
```typescript
{
  email: string().email()
  password: string().min(8).regex(...)
  confirmPassword: string()
  firstName: string().min(2)
  lastName: string().min(2)
  phone: string().optional()
}
```

#### Reservation
```typescript
{
  garageId: number().positive()
  serviceId: number().positive()
  timeSlot: string().datetime()
  clientNotes: string().max(500).optional()
}
```

## 🎯 Best Practices Implemented

### Code Organization
✅ Feature-based folder structure
✅ Separation of concerns (API, hooks, stores, components)
✅ Reusable UI components
✅ Type-safe throughout

### Performance
✅ Query caching and deduplication
✅ Optimistic updates
✅ Code splitting with dynamic imports
✅ Lazy loading components

### User Experience
✅ Loading states
✅ Error boundaries
✅ Toast notifications
✅ Form validation feedback
✅ Responsive design

### Developer Experience
✅ TypeScript strict mode
✅ ESLint configuration
✅ Consistent code style
✅ Clear file naming conventions

## 🔄 Data Flow

### Reservation Creation Flow
```
1. User selects garage
   └─> Zustand stores garageId
   └─> Navigate to step 2

2. User selects service
   └─> Zustand stores serviceId
   └─> Navigate to step 3

3. User selects time slot
   └─> TanStack Query checks availability
   └─> Zustand stores timeSlot
   └─> Navigate to step 4

4. User confirms
   └─> React Hook Form validates
   └─> TanStack Query mutates
   └─> Success: Navigate to detail page
   └─> Zustand resets form state
```

## 🧪 Testing Strategy (Recommended)

```bash
# Unit tests
- Test utility functions
- Test validation schemas
- Test store logic

# Integration tests
- Test API client
- Test hooks with mock server
- Test form submissions

# E2E tests
- Test complete reservation flow
- Test authentication flow
- Test error scenarios
```

## 📦 Build & Deploy

### Production Build
```bash
npm run build
npm start
```

### Docker (Optional)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### Common Issues

**API Connection Error**
- Verify backend is running on port 3001
- Check CORS configuration in backend
- Verify API URL in `.env.local`

**Authentication Issues**
- Clear localStorage
- Check token expiration
- Verify JWT secret matches backend

**Build Errors**
- Run `npm install` to update dependencies
- Delete `.next` folder and rebuild
- Check TypeScript errors

## 🔮 Future Enhancements

### Planned Features
- [ ] Dashboard for garage owners
- [ ] Real-time notifications (WebSocket)
- [ ] Payment integration
- [ ] Review and rating system
- [ ] Admin panel
- [ ] Multi-language support (i18n)
- [ ] PWA support
- [ ] Advanced search and filters
- [ ] Vehicle management
- [ ] Service history

### Architecture Improvements
- [ ] Add Redux DevTools integration
- [ ] Implement error boundary components
- [ ] Add analytics tracking
- [ ] Implement A/B testing framework
- [ ] Add comprehensive test coverage
- [ ] Performance monitoring (Sentry)

## 📄 License

This project is proprietary software.

## 🤝 Contributing

1. Follow the established folder structure
2. Use TypeScript strict mode
3. Write meaningful commit messages
4. Test thoroughly before PR
5. Update documentation

## 📧 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ using Next.js, TypeScript, and modern React patterns**
