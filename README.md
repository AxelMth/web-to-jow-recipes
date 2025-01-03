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
- Valid API tokens (see [Configuration](#configuration))

## Installation

```bash
git clone https://github.com/yourusername/web-to-jow-recipes.git
cd web-to-jow-recipes
pnpm install
```

## Configuration

Create a `.env` file in the root directory by copying the `.env.example` file.

Required environment variables:

| Variable            | Description                                                |
| ------------------- | ---------------------------------------------------------- |
| SOURCE_BASE_URL     | Base URL for the source API where recipes are crawled from |
| SOURCE_BEARER_TOKEN | Authentication token for accessing the source API          |
| SOURCE_IMG_BASE_URL | Base URL for accessing images from the source website      |
| JOW_BASE_URL        | Base URL for Jow's API where recipes will be uploaded      |
| JOW_BEARER_TOKEN    | Authentication token for accessing Jow's API               |

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

- `POST /api/recipes/crawl` - Start recipe crawling from source
- `POST /api/recipes/sync` - Get already uploaded recipes and put them into file `already-processed-recipes.txt`
- `DELETE /api/recipes` - Delete recipes uploaded to jow

## API Documentation

### Endpoints

#### 1. Start Recipe Crawling

Initiates the crawling process from the source website.

```http
POST /api/recipes/crawl
```

Query Parameters:
| Parameter | Type | Required | Default | Description |
|-----------|---------|----------|---------|--------------------------------|
| page | integer | No | 1 | Starting page for the crawler |

Response:

```json
{
  "processed": 10, // Number of successfully processed recipes
  "failed": 0, // Number of failed recipes
  "errors": [] // Array of error messages (only present if failed > 0)
}
```

Error Response (500):

```json
{
  "error": "Error message description"
}
```

#### 2. Sync Processed Recipes

Retrieves all recipes that have been uploaded to Jow and saves their names to a file.

```http
POST /api/recipes/sync
```

Response:

```json
{
  "message": "Recipes synced successfully"
}
```

Error Response (500):

```json
{
  "error": "Error message description"
}
```

#### 3. Delete All Recipes

Removes all recipes that were uploaded to Jow.

```http
DELETE /api/recipes
```

Response:

```json
{
  "message": "Recipes deleted successfully"
}
```

Error Response (500):

```json
{
  "error": "Error message description"
}
```

### Example Usage

Using curl:

```bash
# Start crawling from page 2
curl -X POST "http://localhost:3000/api/recipes/crawl?page=2"

# Sync processed recipes
curl -X POST "http://localhost:3000/api/recipes/sync"

# Delete all recipes
curl -X DELETE "http://localhost:3000/api/recipes"
```

Using JavaScript fetch:

```javascript
// Start crawling
const response = await fetch('http://localhost:3000/api/recipes/crawl?page=1', {
  method: 'POST',
});
const data = await response.json();

// Sync recipes
await fetch('http://localhost:3000/api/recipes/sync', {
  method: 'POST',
});

// Delete recipes
await fetch('http://localhost:3000/api/recipes', {
  method: 'DELETE',
});
```
