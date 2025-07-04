# 🧹 Throw Out My Junk — AI-Powered Junk Removal Site

This is a modern fullstack web application built with **Next.js (App Router)** and deployed using **AWS Amplify**. It enables customers to chat with an AI assistant about junk removal services, request quotes, and validate serviceable addresses — all via a smooth user experience.

---

## 🚀 Tech Stack

- **Frontend**: React (Next.js App Router)
- **Styling**: Tailwind CSS
- **AI Chatbot**: Google Vertex AI (Gemini 2.5 Pro)
- **Address Validation**: Google Maps Address Validation API
- **Backend Hosting**: AWS Amplify Hosting (Fullstack)
- **Secrets Management**: AWS Secrets Manager (via Amplify Sandbox)
- **CI/CD**: GitHub → Amplify

---

## 💬 Features

- **AI Chatbot**: Conversational assistant to collect address info and respond to customer questions.
- **Address Verification**: Validates user-provided addresses in real-time using Google Maps API.
- **Responsive Design**: Works beautifully across desktop and mobile.
- **Secrets & Env Management**: Secure use of Google API keys and cloud project ID via AWS Secrets Manager (not exposed to client).

---

## 🛠️ Running Locally

> Requires Node.js `18+` and NPM `9+`

### 1. Clone the repo

```bash
git clone git@github.com:JFernandez0524/throw-out-junk-nextjs.git
cd throw-out-junk-nextjs
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up local environment variables

Create a `.env.local` file in the root of the project:

```ini
GOOGLE_CLOUD_PROJECT=your-google-project-id
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

These are only used during local development. In AWS Amplify, secrets are loaded securely via **AWS Secrets Manager**.

### 4. Start the development server

```bash
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## ☁️ Deploying to AWS Amplify

This app is deployed using **Amplify Fullstack Hosting (Gen 2)**.

### AWS Secrets Manager Setup

Use Amplify Sandbox to set your secrets:

```bash
npx ampx sandbox secret set throw-out-junk-env   '{"GOOGLE_CLOUD_PROJECT": "your-project-id", "GOOGLE_MAPS_API_KEY": "your-api-key"}'
```

Update `route.ts` uses `@aws-sdk/client-secrets-manager` to securely retrieve them at runtime.

---

## 📦 Amplify Build Settings (`amplify.yml`)

Make sure your `.env.production` is created during the build (if using client-accessible envs):

```yaml
frontend:
  phases:
    build:
      commands:
        - env | grep -e NEXT_PUBLIC_ >> .env.production
        - npm run build
```

---

## 🔐 Security Notes

- API keys are never exposed to the frontend.
- All secrets are accessed securely via AWS Secrets Manager.
- The chatbot runs in a secure API route using Vertex AI.

---

## 📄 License

MIT-0 — Free for personal and commercial use.
