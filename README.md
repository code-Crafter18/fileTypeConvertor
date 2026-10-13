# File & Form Transformer

A full-stack MERN application for file and form transformation.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **File Uploads:** Multer
- **PDF Generation:** PDFKit

## Project Structure

```
fileTypeConvertor/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── App.jsx         # Main app with routing
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/                # Express backend
│   ├── config/             # Database config
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware (file upload)
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── services/           # Business logic (PDF generation)
│   ├── uploads/            # Temporary upload directory
│   ├── generated/          # Generated PDF files
│   ├── server.js           # Entry point
│   ├── package.json
│   └── .env
└── package.json            # Root package.json
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

1. Install all dependencies:
   ```bash
   npm run install:all
   ```

2. Make sure MongoDB is running on `localhost:27017`

3. Start the backend server:
   ```bash
   npm run dev:server
   ```

4. Start the frontend dev server:
   ```bash
   npm run dev:client
   ```

5. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/transform/upload` | Upload TXT and convert to PDF |
| POST | `/api/transform/form-to-pdf` | Generate PDF from form data |
| GET | `/api/history` | Get transformation history |
| DELETE | `/api/history/:id` | Delete a history entry |

## Features

- Upload .txt files and convert to PDF
- Fill out forms and generate PDFs
- View transformation history
- Download generated PDFs
- File validation (type and size)
- Error handling and loading states
- Responsive design
