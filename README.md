# Print Anywhere Mobile App

A mobile application built with **React Native and Expo** that allows users to submit print jobs remotely using the Print Anywhere platform.

Print Anywhere makes it possible to send documents for printing from a mobile device without needing to connect directly to the printer. Print jobs are processed through the Print Anywhere backend and the Desktop Printer Agent.

## 🚀 Features

- **User Authentication** – Register and log in to your Print Anywhere account.
- **Printer Management** – View registered printers associated with your account.
- **Printer Selection** – Select an available online printer before submitting a print job.
- **Document Upload** – Upload documents for printing.
- **Document Management** – Remove a selected document before uploading.
- **Copy Management** – Choose the number of copies to print.
- **Print Job Submission** – Submit print jobs to the Print Anywhere backend.
- **Cloud Integration** – Upload documents using Cloudinary.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React Native | Mobile application development |
| Expo | Development and build environment |
| TypeScript | Type safety |
| Expo Router | Application navigation |
| Axios | API communication |
| Cloudinary | Document storage |
| Node.js & Express.js | Backend API |
| MongoDB | Database |

## 📁 Project Structure

```text
PrintAnywhereMobile/
│
├── src/
│   ├── app/
│   │   ├── (app)/
│   │   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── print.tsx
│   │
│   ├── components/
│   ├── constants/
│   ├── context/
│   ├── hooks/
│   ├── services/
│   │   ├── api.service.ts
│   │   ├── auth.service.ts
│   │   ├── printer.service.ts
│   │   └── upload.service.ts
│   │
│   └── utils/
│
├── assets/
├── scripts/
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/playwithCODES/print-anywhere-mobile.git
```

### 2. Navigate to the Project Directory

```bash
cd print-anywhere-mobile
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure the Backend API

Configure the backend API base URL in:

```text
src/constants/api.ts
```

Make sure the mobile application can communicate with your deployed Print Anywhere backend or your local development server.

**Important:** When testing on a physical mobile device, use your computer's local network IP address instead of `localhost` when connecting to a locally running backend.

### 5. Start the Development Server

```bash
npx expo start
```

Use the Expo development tools to open the application on a supported device or emulator.

## 🖨️ How It Works

1. Register or log in to your Print Anywhere account.
2. Open the printing screen.
3. Select an available online printer.
4. Choose a document from your mobile device.
5. Select the required number of copies.
6. Submit the print job.
7. The Print Anywhere backend processes the request.
8. The corresponding Desktop Printer Agent receives the job and handles printing.

## 🏗️ Print Anywhere Ecosystem

The mobile application is one component of the larger Print Anywhere platform.

- **Mobile Application:** Sends print requests from mobile devices.
- **Web Application:** Provides browser-based access to printing services.
- **Backend:** Handles authentication, printer registration, document uploads, and print jobs.
- **Desktop Printer Agent:** Connects registered printers to the platform and processes print jobs.

## 🔐 Security

- Authentication is handled through the Print Anywhere backend.
- API communication uses authenticated requests.
- Environment variables and sensitive credentials should never be committed to the public repository.
- Keep production
