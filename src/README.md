# GT Auto Sales Website

Premium automotive dealership website rebranded from legacy "Yes Motors".
Built with efficient, semantic HTML5, CSS3 (Custom Properties), and Modular JavaScript.

## Features
- **Dynamic Inventory**: Client-side rendering of vehicle inventory with extensive filters (Make, Type, Price, Year).
- **Service Booking**: Dedicated page for services with direct booking integration.
- **Lead Generation**: "Request Info" and "Finance Application" forms pre-filled with vehicle data.
- **Responsive Design**: Mobile-first approach with sidebar filters and touch-friendly navigation.
- **Compliance**: GDPR-ready cookie consent and CSP security headers.

## Development

### Prerequisites
- Python 3 (for local server) or any static file server.

### Local Setup
1. Clone the repository.
   ```bash
   git clone https://github.com/GarnetGrid/gtautosales.git
   ```
2. Navigate to the source directory.
   ```bash
   cd src
   ```
3. Start a local server.
   ```bash
   python3 -m http.server 8080
   ```
4. Visit `http://localhost:8080` in your browser.

## Deployment
This site is designed to be hosted on any static hosting provider.

### GitHub Pages
1. Push the `src` folder to a GitHub repository.
2. Go to **Settings > Pages**.
3. Select the `main` branch and `/src` folder as the source.

### Netlify / Vercel
1. Link your repository.
2. Set the *Publish directory* to `src`.
3. No build command required.

## Structure
- `src/index.html`: Homepage.
- `src/css/`: Stylesheets (variables, layout, components).
- `src/js/`: Logic (main.js handles all shared and page-specific logic).
- `src/assets/`: Images and static resources.
