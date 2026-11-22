# My Better Health — Mobile Nutrition Tracker

A mobile app (Android) that helps users track daily calories and nutrition.
Users can search food products, scan barcodes, log meals, follow daily goals
and review their eating habits.

> Course project for **Mobile Programming (SOF008AS3AE-3007)**,
> Haaga-Helia University of Applied Sciences. Author: **Minh Doan**

## Tech stack

| Area            | Technology                                      |
| --------------- | ----------------------------------------------- |
| Framework       | React Native + Expo (SDK 58)                    |
| Language        | TypeScript (strict mode)                        |
| Navigation      | Expo Router (file-based, protected routes)      |
| Authentication  | Firebase Authentication (email + password)      |
| Database        | Cloud Firestore + security rules                |
| Food data       | Open Food Facts REST API                        |
| Device features | Expo Camera (barcode), Expo Notifications       |
| Testing         | Jest + jest-expo                                |
| Code quality    | ESLint (eslint-config-expo)                     |

## Features

- App structure: navigation, protected routes, reusable UI components
- Form validation with strong password rules
- User authentication with Firebase: register, log in, log out, reset password
- Daily dashboard: calories, protein, carbs, fat and progress toward goals
- Food search with the Open Food Facts API
- Meal tracking: add, edit and delete food for breakfast, lunch, dinner and snacks
- Barcode scanner
- Meal history and charts
- Settings: nutrition goals and meal reminders

## Project structure

```
src/
├── app/            # Screens (Expo Router: every file is a route)
│   ├── (auth)/     # Sign in, Sign up, Forgot password
│   └── (app)/      # Logged-in area: tabs, food details, scanner
├── components/     # Reusable UI components
├── constants/      # Default goals and labels
├── providers/      # React context (authentication)
├── theme/          # Colors, spacing, font sizes
├── types/          # Shared TypeScript models
└── utils/          # Pure functions + unit tests
```

Screens only show the UI. Logic is in `utils/` (tested) and `services/` (API and database).

## Getting started

Requirements: Node.js 20+ and the **Expo Go** app on your phone
(signed in with an Expo account).

```bash
npm install
npx expo login      # sign in to your Expo account
npx expo start      # scan the QR code with Expo Go
```

```bash
npm test            # unit tests
npm run lint        # ESLint
npm run typecheck   # TypeScript check
```

## Data source

Food data comes from [Open Food Facts](https://world.openfoodfacts.org),
an open database under the Open Database License (ODbL).