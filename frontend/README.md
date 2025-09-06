# Event Management System - Frontend

A modern Next.js frontend for the Event Management System, built with TypeScript, Tailwind CSS, and Shadcn UI components.

## Features

- **Modern UI**: Built with Shadcn UI components
- **Responsive Design**: Mobile-first responsive design
- **Dark/Light Mode**: Theme switching capability
- **Real-time Updates**: Dynamic event and attendee management
- **TypeScript**: Full type safety throughout the application
- **Timezone Support**: Comprehensive timezone handling and conversion
- **Testing**: Jest and React Testing Library setup

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Modern component library
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── create/          # Create event page
│   │   ├── events/          # Event details page
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # React components
│   │   ├── ui/              # Shadcn UI components
│   │   ├── create-event-form.tsx
│   │   ├── event-card.tsx
│   │   └── ...
│   ├── lib/                 # Utility functions
│   │   ├── api.ts           # API client
│   │   ├── timezone-utils.ts # Timezone utilities
│   │   └── utils.ts         # General utilities
│   └── __tests__/           # Test files
├── public/                  # Static assets
├── package.json             # Dependencies
└── next.config.ts           # Next.js configuration
```

## API Integration

The frontend connects to the FastAPI backend running on `http://localhost:8000`. Make sure the backend is running before starting the frontend.

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Deployment

Build for production:

```bash
npm run build
```

The build output in `.next/` can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com/)
- [TypeScript](https://www.typescriptlang.org/docs/)
