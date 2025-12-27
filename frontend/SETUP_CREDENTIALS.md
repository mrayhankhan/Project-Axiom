# Setting Up Credentials for Project Axiom

Follow these steps to generate the necessary API keys and set up your `.env` file.

## 1. Create the `.env` File
1.  Navigate to the `frontend` folder.
2.  Create a new file named `.env`.
3.  Copy the contents of `.env.example` into `.env`.

---

## 2. Supabase (Database & Storage)
*We use Supabase for the PostgreSQL database and file storage.*

1.  Go to [supabase.com](https://supabase.com/) and sign up/log in.
2.  Click **"New Project"**.
3.  Give it a name (e.g., "Axiom") and a strong password. **Save this password!**
4.  Select a region close to you.
5.  Click **"Create new project"**.
6.  Once the project is ready:
    *   Go to **Project Settings** (gear icon) -> **API**.
    *   Copy the **Project URL** -> Paste into `.env` as `NEXT_PUBLIC_SUPABASE_URL`.
    *   Copy the **anon public** key -> Paste into `.env` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
    *   Go to **Project Settings** -> **Database**.
    *   Under **Connection string**, make sure "Transaction Pooler" is checked (port 6543) -> Copy the URI.
    *   Paste into `.env` as `DATABASE_URL`. **Replace `[YOUR-PASSWORD]` with the password you created in step 3.**
    *   Uncheck "Use connection pooling" (port 5432) -> Copy the URI.
    *   Paste into `.env` as `DIRECT_URL`. **Replace `[YOUR-PASSWORD]` again.**

---

## 3. Google OAuth (Sign In)
*Allows users to sign in with their Google accounts.*

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a **New Project** (e.g., "Axiom Auth").
3.  Search for **"OAuth consent screen"** in the top bar.
    *   Select **External**.
    *   Fill in App Name ("Axiom"), User Support Email, and Developer Contact Email.
    *   Click **Save and Continue** (you can skip Scopes and Test Users for now).
4.  Go to **Credentials** (left sidebar).
5.  Click **Create Credentials** -> **OAuth client ID**.
6.  Application type: **Web application**.
7.  Name: "Axiom Web".
8.  **Authorized JavaScript origins**:
    *   `http://localhost:3000`
    *   *(Add your Vercel domain later, e.g., `https://project-axiom.vercel.app`)*
9.  **Authorized redirect URIs**:
    *   `http://localhost:3000/api/auth/callback/google`
    *   *(Add Vercel domain later: `https://project-axiom.vercel.app/api/auth/callback/google`)*
10. Click **Create**.
11. Copy **Client ID** -> Paste into `.env` as `GOOGLE_CLIENT_ID`.
12. Copy **Client Secret** -> Paste into `.env` as `GOOGLE_CLIENT_SECRET`.

---

## 4. Gemini API (Intelligence)
*Powers the AI chat and embeddings.*

1.  Go to [Google AI Studio](https://aistudio.google.com/).
2.  Click **"Get API key"** (top left).
3.  Click **"Create API key"**.
4.  Select your Google Cloud project (or create a new one).
5.  Copy the key -> Paste into `.env` as `GEMINI_API_KEY`.

---

## 5. NextAuth Secret
1.  Open your terminal.
2.  Run: `openssl rand -base64 32`
3.  Copy the output -> Paste into `.env` as `NEXTAUTH_SECRET`.
