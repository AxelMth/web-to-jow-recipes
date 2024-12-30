# Web to Jow Recipe Converter

A Node.js application that crawls recipes from web sources and converts them to Jow-compatible format.

## Features

- Crawls recipes from supported web sources
- Matches ingredients with Jow's ingredient database
- Converts units and measurements
- Uploads images to Jow's CDN
- Preserves recipe metadata and instructions

## Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- Valid API tokens

## Installation

```bash
git clone https://github.com/yourusername/web-to-jow-recipes.git
cd web-to-jow-recipes
pnpm install
```

## Configuration

Create a `.env` file in the root directory but copying the `.env.example` file.

## Usage

### Build the application

```bash
pnpm build
```

### Start the application

```bash
pnpm start
```

### API Endpoints

- `POST /api/recipes/crawl` - Start recipe crawling
- `DELETE /api/recipes` - Delete all converted recipes
