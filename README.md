# Sakai Nuxt

A Nuxt 3 application template based on the Sakai Vue project, enhanced with PrimeVue UI components and Tailwind CSS styling.

## Features

- Nuxt 3 Framework with SSR/SSG capabilities
- PrimeVue 4 Integration for UI components
- Tailwind CSS for utility-first styling
- Configurable layout and menu
- File-based routing
- Docker-based deployment support

## Getting Started

### Prerequisites

- Node.js (>=20.19.0)
- npm (>=11.0.0)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Generate Static Site

```bash
npm run generate
```

### Preview Static Site

```bash
npx serve dist
```

## Deployment

### Netlify

This project is configured for deployment to Netlify. The configuration is in [netlify.toml](netlify.toml):

```toml
[build]
  command = "npm run generate"
  publish = "dist"
```

To deploy to Netlify:

1. Push your code to a Git repository
2. Connect your repository to Netlify
3. Netlify will automatically use the configuration in [netlify.toml](netlify.toml)

Alternatively, you can deploy manually:

1. Generate the static site:
   ```bash
   npm run generate
   ```
2. Deploy the `dist` folder to Netlify

## Docker Deployment

The project includes Docker support:

```bash
# Build the Docker image
./build.sh <TAG_NAME>

# Run the container
docker-compose up
```

## Project Structure

- `src/pages/`: Application pages with automatic routing
- `src/layouts/`: Layout components
- `src/components/`: Reusable UI components
- `src/composables/`: Shared logic
- `src/assets/`: SCSS styles and assets
- `src/service/`: Mock data services
- `src/plugins/`: Plugin configurations

## Technology Stack

- **Framework**: Nuxt 3
- **UI Library**: PrimeVue 4
- **Styling**: Tailwind CSS, SCSS
- **State Management**: Nuxt built-in (via composables and plugins)
- **Build Tool**: Nuxt CLI
- **Package Manager**: npm