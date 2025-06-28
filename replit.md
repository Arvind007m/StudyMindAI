# StudyMind AI - Development Guide

## Overview

StudyMind AI is a memory-first learning platform that transforms personal study materials into intelligent, interactive learning experiences. The application uses AI to generate personalized quizzes, provide adaptive tutoring, and optimize knowledge retention through spaced repetition and recall techniques.

## System Architecture

### Overall Architecture
The system follows a modern full-stack architecture with:
- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

### Monorepo Structure
```
├── client/          # Frontend React application
├── server/          # Backend Express.js API
├── shared/          # Shared types and schemas
└── migrations/      # Database migration files
```

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite
- **Styling**: Tailwind CSS with custom dark theme
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **State Management**: TanStack Query for API state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints under `/api` prefix
- **Database**: PostgreSQL with Drizzle ORM for type-safe queries
- **Session Management**: Session storage with PostgreSQL backend

### Database Schema
The application uses a comprehensive schema for learning management:
- **Users**: User profiles with XP tracking and streak management
- **Study Materials**: Content storage with file type classification
- **Quiz Sessions**: Session tracking with performance metrics
- **Questions**: Generated questions with difficulty levels and metadata
- **User Answers**: Answer tracking for performance analysis
- **Achievements**: Gamification system for user engagement

## Data Flow

### Content Upload Flow
1. User uploads study material through the frontend
2. Content is processed and stored in the `study_materials` table
3. AI generates questions based on the content
4. Questions are stored with metadata for future retrieval

### Study Session Flow
1. User selects study session type and preferences
2. Backend retrieves relevant questions based on difficulty and subject
3. Questions are presented to user with interactive UI
4. Answers are tracked and performance metrics are calculated
5. XP and streak data are updated based on performance

### AI Tutor Interaction
1. User selects study material for tutoring session
2. AI tutor provides context-aware assistance based on the content
3. Conversation history is maintained for continuous learning

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React routing
- **zod**: Schema validation and type safety

### UI Dependencies
- **@radix-ui/***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution for development
- **esbuild**: Production build optimization

## Deployment Strategy

### Development Environment
- Uses Vite development server with HMR (Hot Module Replacement)
- Express server runs on port 5000 with API endpoints
- PostgreSQL database


### Production Build
- Client builds to `dist/public` directory using Vite
- Server builds using esbuild with ES modules and external packages
- Static files are served from the Express server
- Database migrations are handled through Drizzle Kit
