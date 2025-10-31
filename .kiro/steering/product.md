# Product Overview

Altar - Día de Muertos is a web application that honors the Mexican tradition of Día de Muertos by allowing users to create digital altars (ofrendas) for their loved ones.

## Core Features

- Upload photos of loved ones
- Describe traditional foods for the altar
- AI-generated altar images using AWS Bedrock (Stable Diffusion XL)
- Gallery view of created altars
- Local storage persistence

## Cultural Context

This application celebrates Día de Muertos, a Mexican holiday honoring deceased loved ones. All design decisions should maintain cultural sensitivity and authenticity:

- Traditional altar elements: marigold flowers (cempasúchil), candles, papel picado
- Authentic color palette: marigold orange (#ffc300), vibrant pink (#ff0066), deep purple (#6600ff), altar orange (#ff9100)
- Respectful and warm tone in all UI text
- Spanish language support for user-facing messages

## User Flow

1. User uploads a photo
2. User describes traditional foods to include on the altar
3. System generates a photorealistic altar image with AI
4. Altar is saved locally and displayed in gallery
5. User can view, share, or delete altars
