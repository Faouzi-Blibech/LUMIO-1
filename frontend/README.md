# Lumio Frontend

ADHD Learning Support Platform - React Frontend

## Project Structure

```
src/
├── components/        # Reusable React components
├── hooks/            # Custom React hooks
├── context/          # React context providers
├── types/            # TypeScript interfaces and types
├── pages/
│   ├── student/      # Student dashboard and features
│   ├── teacher/      # Teacher dashboard and features
│   └── parent/       # Parent dashboard and features
├── App.tsx           # Root component
├── main.tsx          # Entry point
└── index.css         # Global styles with Tailwind CSS
```

## Setup

### Prerequisites

- Node.js 16+ or npm/yarn/pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts the development server at `http://localhost:5173`

### Build

```bash
npm run build
```

Builds the project for production.

### Preview

```bash
npm run preview
```

Preview production build locally.

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - React charting library

## Type Definitions

Core types are defined in `src/types/index.ts`:

- `User` - Platform user (student, teacher, parent)
- `FocusPayload` - Eye tracking and attention data
- `FocusSession` - Analytics session data
- `StudentProfile`, `TeacherProfile`, `ParentProfile` - Role-specific profiles
- `LearningTask` - Educational tasks
- `ApiResponse` - API response wrapper
- `TokenPayload` - JWT token payload

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
```

## License

All rights reserved © Lumio Platform
