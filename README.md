# 🕊️ NayePankh Foundation — Volunteer Registration System

A complete, production-ready Volunteer Registration System built with **React + Firebase** for the NayePankh Foundation internship task.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📝 **Registration Form** | Name, Email, Phone, Skills (multi-select), Area of Interest, Motivation |
| 🔐 **Admin Login** | Secure Firebase Auth (email/password) |
| 📊 **Admin Dashboard** | View all volunteers, stats cards, search & filter |
| 📥 **Export CSV** | Download filtered volunteer data as `.csv` |
| 📱 **Responsive** | Mobile-first design, works on all screen sizes |
| 🌙 **Dark UI** | Premium glassmorphism dark theme |

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── AdminDashboard.jsx    ← Protected admin view
│   ├── AdminLogin.jsx        ← Firebase auth login
│   ├── Navbar.jsx            ← Top navigation
│   ├── ProtectedRoute.jsx    ← Auth guard
│   ├── VolunteerForm.jsx     ← Public registration
│   └── VolunteerTable.jsx    ← Table + filters + CSV export
├── context/
│   └── AuthContext.jsx       ← Auth state & useAuth() hook
├── firebase/
│   └── config.js             ← Firebase init
├── App.jsx                   ← Routes
├── main.jsx                  ← Entry point
└── index.css                 ← Full design system
```

---

## 🚀 Getting Started

### Step 1 — Create a Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → Name it `nayepankh-volunteers` (or anything you like)
3. Enable **Google Analytics** (optional)

### Step 2 — Enable Firebase Services

**Firestore Database:**
1. Firebase Console → **Firestore Database** → **Create database**
2. Choose **Start in test mode** (for development) → Select a region → **Enable**

**Authentication:**
1. Firebase Console → **Authentication** → **Get started**
2. Click **Email/Password** → Enable → **Save**

**Hosting:**
1. Firebase Console → **Hosting** → **Get started**
2. Follow the setup wizard (you don't need to run commands yet)

### Step 3 — Get Your Firebase Config

1. Firebase Console → ⚙️ **Project Settings** → **Your apps** → **Add app** → Web (`</>`)
2. Register the app, copy the `firebaseConfig` object values

### Step 4 — Configure Environment Variables

Open `.env.local` (already created) and replace the placeholders:

```env
VITE_FIREBASE_API_KEY=AIza...your-key...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Step 5 — Create an Admin Account

1. Firebase Console → **Authentication** → **Users** tab → **Add user**
2. Enter your admin email (e.g. `admin@nayepankh.org`) and a strong password
3. Click **Add user**

### Step 6 — Update `.firebaserc`

Open `.firebaserc` and replace `YOUR_FIREBASE_PROJECT_ID` with your actual project ID:

```json
{
  "projects": {
    "default": "nayepankh-volunteers"
  }
}
```

### Step 7 — Set Up Firestore Security Rules

In Firebase Console → **Firestore** → **Rules**, paste this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone can submit a volunteer registration
    match /volunteers/{docId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

Click **Publish**.

---

## 💻 Local Development

```bash
# Install dependencies (already done)
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

| Route | Page |
|---|---|
| `/` | Volunteer Registration Form (public) |
| `/admin/login` | Admin Login |
| `/admin/dashboard` | Admin Dashboard (protected) |

---

## 🏗️ Build & Deploy to Firebase Hosting

```bash
# 1. Install Firebase CLI (one-time)
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Build the production bundle
npm run build

# 4. Deploy to Firebase Hosting
firebase deploy --only hosting
```

Your app will be live at: `https://YOUR_PROJECT_ID.web.app`

---

## 📤 Push to GitHub

```bash
git init
git add .
git commit -m "feat: NayePankh Volunteer Registration System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

> ⚠️ `.env.local` is in `.gitignore` and will NOT be pushed. Keep your Firebase keys safe.

---

## 🛡️ Security Notes

- Firestore rules allow **public writes** (volunteer registration) but only **authenticated reads** (admin only)
- Admin authentication is handled by Firebase Auth — credentials never stored in code
- Never commit `.env.local` to version control

---

## 🧰 Tech Stack

- **React 18** + **Vite**
- **Firebase** (Auth, Firestore, Hosting)
- **React Router v6**
- **Lucide React** (icons)
- **Vanilla CSS** (custom design system)

---

Built with ❤️ for NayePankh Foundation
"# Volunter-Registration-System" 
