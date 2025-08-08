# CashNib 2.0 - AI-Powered Personal Finance Assistant

<div align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.72.6-blue.svg" alt="React Native" />
  <img src="https://img.shields.io/badge/Node.js-18+-green.svg" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-4.8.4-blue.svg" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Firebase-9+-orange.svg" alt="Firebase" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License" />
</div>

## 📱 Overview

CashNib 2.0 is a comprehensive AI-powered personal finance assistant that helps users manage their finances with intelligent insights, automated categorization, and beautiful visualizations. Built with React Native for mobile and Node.js for the backend.

### ✨ Key Features

- 🤖 **AI-Powered Insights** - OpenAI integration for personalized financial advice
- 📊 **Smart Analytics** - Interactive charts and spending analysis
- 💰 **Budget Management** - Create and track budgets with real-time progress
- 🎯 **Financial Goals** - Set and monitor savings goals
- 📈 **Investment Tracking** - Portfolio analysis and recommendations
- 🔐 **Secure Authentication** - Biometric, Google, and Apple sign-in
- 📸 **Receipt Scanning** - Camera integration for expense tracking
- 🌙 **Dark Mode** - Beautiful themes with system preference support

## 🏗️ Architecture

```
CashNib 2.0/
├── src/                    # React Native Frontend
│   ├── screens/           # App screens (Auth, Home, Budget, etc.)
│   ├── navigation/        # Navigation configuration
│   ├── services/          # API services and business logic
│   ├── store/            # Redux store and slices
│   ├── theme/            # Design system (colors, typography)
│   └── types/            # TypeScript type definitions
├── server/               # Node.js Backend
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Authentication, validation
│   │   └── config/       # Database and external service config
│   └── public/           # Static files and API documentation
└── Flutter Flow.../      # Reference Flutter implementation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **React Native CLI** (`npm install -g react-native-cli`)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **Firebase Project** with Firestore enabled
- **OpenAI API Key** (optional, for AI features)

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   PORT=3001
   FIREBASE_PROJECT_ID=your-project-id
   JWT_SECRET=your-jwt-secret
   OPENAI_API_KEY=your-openai-key
   ```

4. **Firebase setup**
   - Download `serviceAccountKey.json` from Firebase Console
   - Place it in `server/config/serviceAccountKey.json`

5. **Start the server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:3001`

### Frontend Setup

1. **Navigate to project root**
   ```bash
   cd ..
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS setup** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Start Metro bundler**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   ```bash
   # Android
   npm run android
   
   # iOS (macOS only)
   npm run ios
   ```

## 🔧 Development

### Available Scripts

**Frontend:**
- `npm start` - Start Metro bundler
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run lint` - Run ESLint
- `npm test` - Run tests

**Backend:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests

### Code Structure

- **TypeScript** throughout for type safety
- **Redux Toolkit** for state management
- **React Navigation** for navigation
- **Firebase** for authentication and database
- **Axios** for API communication
- **React Hook Form** for form handling

## 🔐 Security

- JWT-based authentication with refresh tokens
- Biometric authentication support
- Secure token storage with React Native Keychain
- Input validation with Joi
- Rate limiting and CORS protection
- Firebase security rules

## 📊 API Documentation

Once the backend is running, visit `http://localhost:3001/` for interactive API documentation.

### Key Endpoints

- `POST /api/auth/login` - User authentication
- `GET /api/transactions` - Fetch transactions
- `POST /api/budget` - Create budget
- `GET /api/ai/insights` - Get AI insights
- `GET /api/reports/spending` - Spending analysis

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📱 Deployment

### Backend Deployment

1. **Build the project**
   ```bash
   cd server && npm run build
   ```

2. **Deploy to your preferred platform**
   - Heroku, AWS, Google Cloud, or DigitalOcean
   - Ensure environment variables are configured

### Mobile App Deployment

1. **Android (Google Play)**
   ```bash
   npm run build:android
   ```

2. **iOS (App Store)**
   ```bash
   npm run build:ios
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-username/cashnib-2.0/issues) page
2. Review the API documentation at `http://localhost:3001/`
3. Ensure all environment variables are properly configured
4. Verify Firebase project setup and permissions

## 🔮 Roadmap

- [ ] Web application (React.js)
- [ ] Advanced AI features
- [ ] Cryptocurrency tracking
- [ ] Bank account integration (Plaid)
- [ ] Multi-currency support
- [ ] Expense sharing
- [ ] Investment recommendations

---

<div align="center">
  <p>Built with ❤️ by the CashNib Team</p>
  <p>© 2024 CashNib. All rights reserved.</p>
</div>