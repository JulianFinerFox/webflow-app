# Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- A Webflow account with API access

## Environment Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
WEBFLOW_API_TOKEN=your_api_token_here
WEBFLOW_SITE_ID=your_site_id_here
```

4. Get your Webflow API credentials:
   - Log in to your Webflow account
   - Go to Account Settings > API Access
   - Generate a new API token
   - Copy your site ID from the site settings

5. Replace the placeholder values in `.env` with your actual credentials

## Development

To start the development server:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

## Project Structure
```
.
├── docs/               # Documentation
├── public/            # Static files
│   ├── index.html    # Main HTML file
│   ├── styles.css    # Styles
│   └── index.js      # Compiled JavaScript
├── src/              # Source files
│   ├── index.ts      # Main TypeScript file
│   └��─ webflowApi.ts # Webflow API client
└── package.json      # Project configuration
``` 