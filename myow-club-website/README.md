# MYOW DIY Club Website

This is a React + Vite + Tailwind CSS project for the MYOW DIY Club website.

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start the development server**:
    ```bash
    npm run dev
    ```

## Features

-   **Home Page**: Displays announcements, upcoming activities, and a Google Calendar.
-   **Admin Dashboard**: Allows staff to add new activities (mock functionality currently).
-   **Responsive Design**: Works on desktop and mobile.

## Configuration

### Firebase Setup (Optional for Backend)

To enable real-time updates for activities:

1.  Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
2.  Add a Web App to your project.
3.  Copy the Firebase configuration object.
4.  Paste it into `src/firebase.ts`, replacing the placeholder values.
5.  In `src/pages/Home.tsx` and `src/pages/Admin.tsx`, uncomment the Firebase code blocks to enable database interaction.

### Google Calendar

To update the calendar:
1.  Go to `src/pages/Home.tsx`.
2.  Replace the `iframe` `src` URL with your club's public Google Calendar embed URL.

## Deployment

You can deploy this site easily to Vercel, Netlify, or Firebase Hosting.

### Vercel
1.  Push this code to GitHub.
2.  Import the repository in Vercel.
3.  Deploy!

### Firebase Hosting
1.  Run `npm install -g firebase-tools`.
2.  Run `firebase login`.
3.  Run `firebase init` and select "Hosting".
4.  Run `npm run build`.
5.  Run `firebase deploy`.
