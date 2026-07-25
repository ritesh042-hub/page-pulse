# Page Pulse

Page Pulse is a small full-stack web application that audits any public webpage URL and returns a clean technical report.

It was built for the Digital Heroes Software Development qualification task.

## Live Demo

Frontend: To be added after deployment  
Backend API: To be added after deployment

## Features

- Accepts any valid HTTP or HTTPS URL
- Returns HTTP status code
- Measures approximate response time
- Extracts the page title
- Extracts the meta description
- Counts H1 headings
- Counts images missing alt text
- Calculates an approximate visible word count
- Handles invalid URLs
- Handles request timeouts
- Handles non-HTML responses
- Displays sensible errors without crashing
- Includes automated tests for the parsing logic

## Tech Stack

### Frontend

- React
- Vite
- Axios
- CSS

### Backend

- Node.js
- Express
- Axios
- Cheerio
- CORS

### Testing

- Vitest

## Project Structure

```text
page-pulse/
├── backend/
│   ├── parser.js
│   ├── parser.test.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── package-lock.json
└── README.md