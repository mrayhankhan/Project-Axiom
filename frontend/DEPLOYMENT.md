# Deploying Project Axiom to Vercel

This guide outlines the steps to deploy the Project Axiom frontend to Vercel.

## Prerequisites

1.  A [GitHub](https://github.com/) account.
2.  A [Vercel](https://vercel.com/) account.
3.  The project code pushed to a GitHub repository.

## Step 1: Push to GitHub

If you haven't already, push your code to a new GitHub repository:

1.  Initialize Git (if not already done):
    ```bash
    git init
    ```
2.  Add files:
    ```bash
    git add .
    ```
3.  Commit changes:
    ```bash
    git commit -m "Initial commit"
    ```
4.  Create a new repository on GitHub.
5.  Link your local repository to GitHub:
    ```bash
    git remote add origin <YOUR_GITHUB_REPO_URL>
    git branch -M main
    git push -u origin main
    ```

## Step 2: Import into Vercel

1.  Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Select **"Continue with GitHub"**.
4.  Find your `Project-Axiom` repository and click **"Import"**.

## Step 3: Configure Project

Vercel will automatically detect that this is a Next.js project.

1.  **Framework Preset**: Ensure it says `Next.js`.
2.  **Root Directory**: If your Next.js app is in a subdirectory (e.g., `frontend`), click "Edit" and select the `frontend` folder. **Important**: Since your project seems to be inside `frontend`, make sure to select this.
3.  **Build and Output Settings**: Leave these as default (`next build`).
4.  **Environment Variables**:
    *   Expand the "Environment Variables" section.
    *   Add any required variables. For this project, you might need:
        *   `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID (if you have one ready).
        *   Any other API keys or backend URLs.

## Step 4: Deploy

1.  Click **"Deploy"**.
2.  Vercel will build your application. You can watch the build logs.
3.  Once complete, you will see a "Congratulations!" screen with a screenshot of your landing page.

## Step 5: Verify

1.  Click the domain provided by Vercel (e.g., `project-axiom.vercel.app`).
2.  Test the landing page animations and navigation.
3.  Test the Theme Toggle.

## Troubleshooting

*   **Build Errors**: If the build fails, check the logs. Common issues include TypeScript errors or linting errors. We have fixed most of these, but strict checks on Vercel might catch others.
*   **Hydration Errors**: We added `suppressHydrationWarning` to `app/layout.tsx`, so these should not block deployment, but check the console if the layout looks broken.

## Common Issues

### "Log in to Vercel" on other devices
If you are asked to log in to view your site on another device, **Deployment Protection** is likely enabled. To fix this:
1.  Go to your project in the Vercel Dashboard.
2.  Click **Settings** -> **Deployment Protection**.
3.  Disable **Vercel Authentication** (or "Standard Protection").
4.  Click **Save**.
