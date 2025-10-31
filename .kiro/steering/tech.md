# Technology Stack

## Frontend

- **Vue 3** with Composition API and `<script setup>` syntax
- **TypeScript** with strict mode enabled
- **Vite** for development and building
- **Pinia** for state management
- **Vue Router** for navigation
- **TailwindCSS** for styling

## Backend (AWS Amplify)

- **AWS Amplify Gen 2** for backend infrastructure
- **AWS Lambda** functions for serverless compute
- **AWS S3** for photo and image storage
- **AWS Bedrock** (Stable Diffusion XL v1) for AI image generation
- **AWS CDK** for infrastructure as code

## Key Dependencies

```json
{
  "vue": "^3.4.0",
  "vue-router": "^4.2.5",
  "pinia": "^2.1.7",
  "aws-amplify": "^6.0.0",
  "tailwindcss": "^3.4.0"
}
```

## Common Commands

### Development
```bash
npm run dev              # Start dev server
npm run build            # Build for production (runs vue-tsc + vite build)
npm run preview          # Preview production build
```

### Deployment
```bash
npm run deploy:check     # Pre-deployment validation
npm run deploy:verify    # Verify build output
npx ampx sandbox         # Test Amplify backend locally
```

### Type Checking
```bash
vue-tsc                  # TypeScript type checking for Vue files
```

## Build Configuration

- **Vite config**: Path alias `@` points to `./src`
- **TypeScript**: Strict mode enabled, module resolution set to bundler
- **PostCSS**: Configured with TailwindCSS and Autoprefixer
