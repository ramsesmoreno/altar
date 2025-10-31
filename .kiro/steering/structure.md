# Project Structure

## Frontend Organization

```
src/
├── main.ts              # App entry point, Amplify config, Pinia/Router setup
├── App.vue              # Root component
├── style.css            # Global styles and TailwindCSS imports
├── router/              # Vue Router configuration
├── stores/              # Pinia stores (altarStore.ts)
├── views/               # Page-level components (CreateView, GalleryView, AltarDetailView)
├── components/          # Reusable UI components
├── services/            # API and service layers
│   ├── amplifyService.ts      # AWS Amplify API calls
│   └── localStorageService.ts # Browser storage operations
├── types/               # TypeScript type definitions (altar.ts)
└── utils/               # Utility functions (fileHelpers, validators)
```

## Backend Organization (Amplify)

```
amplify/
├── backend.ts           # Main backend definition, IAM policies, env vars
├── data/                # Data API resources (GraphQL/REST)
├── storage/             # S3 bucket configuration
└── functions/           # Lambda functions
    ├── upload-photo/    # Handles photo uploads to S3
    └── generate-altar/  # AI image generation with Bedrock
```

## Architecture Patterns

### State Management
- **Pinia store** (`altarStore.ts`) manages all altar-related state
- Store actions handle async operations (upload, generate, save)
- Getters provide computed values (sortedAltars, hasAltars)

### Service Layer
- **amplifyService.ts**: Wraps AWS Amplify API calls, handles errors
- **localStorageService.ts**: Manages browser storage with error handling
- Custom error classes: `AmplifyServiceError`, `LocalStorageError`

### Component Patterns
- Use Composition API with `<script setup>` syntax
- Props and emits are type-safe with TypeScript
- Components are single-responsibility and reusable

### Lambda Functions
- Each function has its own `handler.ts`, `resource.ts`, and `package.json`
- CORS headers configured for all responses
- Structured error responses with error codes
- Input validation before processing

## File Naming Conventions

- Vue components: PascalCase (e.g., `AltarCard.vue`)
- TypeScript files: camelCase (e.g., `amplifyService.ts`)
- Type definitions: camelCase (e.g., `altar.ts`)
- Lambda handlers: kebab-case folders (e.g., `generate-altar/`)

## Key Configuration Files

- `amplify_outputs.json`: Generated Amplify backend config (not in git)
- `vite.config.ts`: Vite build configuration
- `tailwind.config.js`: Custom color palette and theme
- `tsconfig.json`: TypeScript compiler options
