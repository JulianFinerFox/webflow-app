# Quick Start Guide

## Prerequisites
1. Node.js and npm installed
2. Webflow account with API access
3. A Webflow site where you want to use the extension

## Installation Steps

1. **Install Webflow CLI globally**
```bash
npm install -g @webflow/designer-extension-cli
```

2. **Install project dependencies**
```bash
npm install
```

3. **Configure API Access**
- Go to https://webflow.com/dashboard/account/apps
- Create a new app or use an existing one
- Generate an API token with the following scopes:
  - assets:read
  - assets:write
- Copy the API token
- Open `.env` file and paste your token:
```env
WEBFLOW_API_TOKEN=your_api_token_here
```

4. **Build the Extension**
```bash
npm run build
```

5. **Development Mode**
```bash
npm run dev
```

## Installing in Webflow Designer

1. Open your Webflow project in the Designer
2. Click on the Extensions panel (puzzle piece icon)
3. Click "Load unpacked"
4. Select your project directory
5. The extension should now appear in your Extensions panel

## Usage

1. Select any text element in your Webflow Designer
2. Open the extension from the Extensions panel
3. Choose an emoji or use the asset selector
4. Click to apply the selected emoji or asset to your element

## How it Works

The extension now automatically:
1. Gets your site information from the Webflow Designer API
2. Uses your API token to authenticate with the Webflow API
3. Fetches assets from your site
4. Allows you to insert emojis or assets into your design

## Troubleshooting

If you encounter issues:

1. Check the browser console for error messages
2. Verify your API token has the correct permissions
3. Make sure all dependencies are installed
4. Try rebuilding the extension with `npm run build`
5. Check the [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) file for current limitations 