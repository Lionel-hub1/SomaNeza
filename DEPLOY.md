# Deployment & PWA Guide

## 1. Free Deployment & Auto-Deploy (Vercel)

The best way to host a Next.js app for free is **Vercel** (the creators of Next.js). It supports continuous deployment automatically.

### Steps to Deploy:
1.  **Push to GitHub**: Ensure your latest code is on the main branch of your GitHub repository.
2.  **Sign up for Vercel**: Go to [vercel.com](https://vercel.com/signup) and sign up with your GitHub account.
3.  **Import Project**:
    *   Click "Add New..." -> "Project".
    *   Find `SomaNeza` in the list of your GitHub repositories and click "Import".
4.  **Configure**:
    *   Leave the default settings (Next.js preset is automatic).
    *   Click "Deploy".

### Auto-Deployment
Once connected, **every time you push** to the `main` branch on GitHub, Vercel will automatically detect the change, build the new version, and redeploy it. This is included in the free "Hobby" tier.

## 2. Professional Free Domain Name

### Option A: Vercel Subdomain (Free Forever)
By default, Vercel gives you a domain like `somaneza.vercel.app`. This is free, reliable, and includes SSL (HTTPS) automatically.

### Option B: Custom Domain (Free for 1 Year)
If you are a student, you can get a free professional domain (like `.me`, `.tech`, or `.com`) through the **GitHub Student Developer Pack**:
1.  Apply at [education.github.com/pack](https://education.github.com/pack).
2.  Once approved, use offers from partners like **Namecheap** or **Name.com** to register a domain for free for 1 year.
3.  In Vercel, go to **Settings > Domains** and add your new custom domain.

### Option C: Freenom (Not Recommended)
Services like Freenom offer free `.tk`, `.ml`, etc., but they often revoke domains without warning and are less professional. We recommend sticking to the `.vercel.app` subdomain if you don't have a budget for a custom domain.

## 3. Progressive Web App (PWA)

This project is now configured as a PWA! users can install it on their phones/desktops as a native-like app.

### Verification
1.  Deploy the app.
2.  Open it in Chrome/Safari on your phone.
3.  You should see an "Install SomaNeza" prompt or "Add to Home Screen" option in the browser menu.

### Essential Step: Add Icons
To make the PWA look professional, you **must** add your own icon files to the `public/` folder. The app currently looks for:
*   `public/android-chrome-192x192.png`
*   `public/android-chrome-512x512.png`

You can generate these from your logo using [favicon.io](https://favicon.io/favicon-converter/) or any PWA asset generator.
