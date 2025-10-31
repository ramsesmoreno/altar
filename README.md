# Altar - Día de Muertos

A web application that honors the Mexican tradition of Día de Muertos by allowing users to create digital altars (ofrendas) for their loved ones.

## Tech Stack

- **Vue 3** with Composition API and TypeScript
- **Vite** for fast development and building
- **Pinia** for state management
- **Vue Router** for navigation
- **TailwindCSS** for styling with custom Día de Muertos color palette
- **AWS Amplify** for backend infrastructure

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment

**Quick Start**: See [QUICK-DEPLOY.md](./QUICK-DEPLOY.md) for fast-track deployment.

**Full Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive instructions.

### Quick Deploy

```bash
# Check deployment readiness
npm run deploy:check

# Build production bundle
npm run build

# Verify build
npm run deploy:verify
```

Then deploy via [AWS Amplify Console](https://console.aws.amazon.com/amplify/) or run `npx ampx sandbox` for testing.

## Project Structure

```
src/
├── main.ts              # Application entry point
├── App.vue              # Root component
├── router/              # Vue Router configuration
├── stores/              # Pinia stores
├── views/               # Page components
├── components/          # Reusable components
├── services/            # API and service layers
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Color Palette

The application uses a custom Día de Muertos inspired color palette:

- **Marigold** (#ffc300) - Primary color representing cempasúchil flowers
- **Vibrant Pink** (#ff0066) - Celebratory and vibrant
- **Deep Purple** (#6600ff) - Traditional and spiritual
- **Altar Orange** (#ff9100) - Warm and welcoming

## Development Guidelines

- TypeScript strict mode is enabled
- Use Composition API with `<script setup>` syntax
- Follow Vue 3 best practices
- Maintain cultural sensitivity in all design decisions
