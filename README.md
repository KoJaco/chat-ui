# Chat UI

A modern, feature-rich chat interface application built with React Router, Assistant UI, and shadcn/ui components.

## Features

- 🤖 AI-powered chat interface using OpenAI's GPT models
- 🎨 Beautiful, modern UI built with shadcn/ui and Tailwind CSS
- 📱 Multiple view modes (Card and Modal)
- ⚡ Built with React Router v7 for optimal performance
- 🔄 Real-time streaming responses
- 💬 Full chat state management with Assistant UI

## Tech Stack

- **Framework**: React Router v7
- **UI Library**: React 19
- **Chat Framework**: [Assistant UI](https://www.assistant-ui.com/docs/)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **AI SDK**: Vercel AI SDK with OpenAI

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd chat-ui
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables:

```bash
# Create a .env file in the root directory
OPENAI_API_KEY=your_openai_api_key_here
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port specified by React Router).

## Building

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Type Checking

Run TypeScript type checking:

```bash
npm run typecheck
```

## Assistant UI Runtime

This project uses **LocalRuntime** from Assistant UI, chosen for its simplicity and flexibility. It:

- Manages all chat state internally
- Provides a clean adapter interface to connect with any REST API, OpenAI, or custom language model
- Handles message streaming and UI updates automatically
- Simplifies integration with backend services

## Project Structure

```
chat-ui/
├── app/
│   ├── components/          # React components
│   │   ├── assistant-ui/    # Assistant UI components
│   │   └── ui/              # shadcn/ui components
│   ├── routes/              # React Router routes
│   │   ├── api/             # API routes
│   │   └── home.tsx         # Main chat interface
│   └── app.css              # Global styles
├── public/                  # Static assets
└── package.json
```

## License

[Add your license here]
