# Chatbot Application

A modern, interactive chatbot built with React, TypeScript, and modern web technologies. This application provides a seamless chat interface with features like typing indicators, message history, and real-time interactions.

## 🚀 Features

- 💬 Real-time chat interface
- ✨ Typing indicators
- 📱 Responsive design
- 🎨 Modern UI/UX
- 🔒 Type-safe with TypeScript
- ⚡ Fast and efficient state management
- 🎭 Customizable components

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: CSS Modules / Styled Components
- **State Management**: React Hooks
- **Build Tool**: Vite
- **Linting**: ESLint
- **Formatting**: Prettier

## 📦 Prerequisites

- Node.js (v16 or later)
- npm (v8 or later) or yarn

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd Chatbot
   ```

2. **Install dependencies**
   ```bash
   cd chatbot-app
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
chatbot-app/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── ChatInput.tsx  # Chat input component
│   │   ├── Message.tsx    # Message display component
│   │   └── TypingIndicator.tsx  # Typing animation
│   │
│   ├── hooks/          # Custom React hooks
│   │   └── useChat.ts    # Chat logic and state management
│   │
│   ├── pages/          # Page components
│   │   └── Chat.tsx      # Main chat page
│   │
│   ├── App.tsx         # Main application component
│   └── main.tsx         # Application entry point
│
├── public/            # Static files
└── package.json        # Project dependencies and scripts
```

## 📝 Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `preview` - Preview production build
- `lint` - Run ESLint
- `format` - Format code with Prettier

## 🧪 Testing

To run tests:

```bash
npm test
# or
yarn test
```

## 🔧 Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
VITE_API_URL=your_api_url_here
# Add other environment variables as needed
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- And all the amazing open-source libraries used in this project

---

Made with ❤️ by [Your Name]
