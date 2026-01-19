# Momona Hotel & Spa

## Overview

This is a luxury hotel booking website for Momona Hotel & Spa, located near Bole International Airport in Addis Ababa, Ethiopia. The application allows guests to browse available rooms, view amenities, make booking requests, and contact the hotel. It includes an admin interface for managing bookings.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React SPA** with TypeScript, using Vite as the build tool
- **Wouter** for client-side routing (lightweight alternative to React Router)
- **TanStack Query** for server state management and API data fetching
- **Shadcn/UI** component library built on Radix UI primitives
- **Tailwind CSS** for styling with custom warm earth-tone color palette
- **React Hook Form** with Zod validation for form handling

### Backend Architecture
- **Express.js** (v5) REST API server
- TypeScript throughout with shared types between client and server
- **Storage pattern** abstracting database operations through `IStorage` interface
- API routes defined in `shared/routes.ts` with Zod schemas for type safety
- Static file serving for production builds

### Data Storage
- **PostgreSQL** database via `pg` driver
- **Drizzle ORM** for type-safe database queries and schema management
- Schema defined in `shared/schema.ts` with three main tables:
  - `rooms`: Hotel room listings with name, description, price, amenities
  - `bookings`: Guest reservations with check-in/out dates, guest info
  - `contacts`: Contact form submissions

### Build System
- Vite for frontend development and production builds
- esbuild for server bundling with selective dependency bundling
- Single `dist/` output directory with `public/` for static assets

### Key Design Patterns
- Shared schema and route definitions between client/server in `shared/` directory
- Type inference from Drizzle schemas using `$inferSelect` and `$inferInsert`
- Zod schemas auto-generated from Drizzle tables via `drizzle-zod`
- Custom hooks (`use-rooms.ts`, `use-bookings.ts`, `use-contact.ts`) encapsulate API logic

## External Dependencies

### Database
- PostgreSQL database (connection via `DATABASE_URL` environment variable)
- Drizzle Kit for migrations (`npm run db:push`)

### UI Component Libraries
- Radix UI primitives (dialog, popover, select, tabs, etc.)
- Lucide React for icons
- Embla Carousel for image carousels
- React Day Picker for date selection in booking forms

### Development Tools
- Replit-specific Vite plugins for development (cartographer, dev-banner, error overlay)
- PostCSS with Tailwind CSS and Autoprefixer