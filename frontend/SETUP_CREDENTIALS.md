# Setup Credentials

## 1. Database (Supabase)
*Already configured.*

## 2. Google OAuth Setup (Final Steps)

**Why not SHA1?**
SHA1 keys are used for **Android/iOS apps** to verify the app's signature.
For a **Web App** (like this one), we use **OAuth 2.0**, which requires a **Client ID** and a **Client Secret**. This is the standard web security protocol.

### You have the Client ID!
You found it: `867168183480-t5kad0s03cfd4va7f1brjtdheln583it.apps.googleusercontent.com`

### How to find the Client Secret:
The "Secret" is like a password. It is often hidden in the Firebase Console. To see it, you must go to the underlying Google Cloud Console.

1.  **Click this direct link**:
    [https://console.cloud.google.com/apis/credentials?project=axiom-78753](https://console.cloud.google.com/apis/credentials?project=axiom-78753)

2.  **Find the matching Credential**:
    *   Look at the list under **"OAuth 2.0 Client IDs"**.
    *   Find the one that matches your ID (`...ln583it.apps.googleusercontent.com`).
    *   Click the **Pencil Icon (Edit)** next to it.

3.  **Reveal the Secret**:
    *   On the right side, you will see **"Client secret"**.
    *   It might be hidden. Click the **Eye Icon** or **Copy Icon** to get it.

4.  **Update `.env`**:
    *   I have already added the Client ID for you.
    *   Just paste the secret into `AUTH_GOOGLE_SECRET`.

5.  **Don't forget the Redirect URI!**:
    *   While you are on that page, scroll down to **"Authorized redirect URIs"**.
    *   Make sure `http://localhost:3000/api/auth/callback/google` is listed there.

## 3. NextAuth Secret
*Already configured.*
