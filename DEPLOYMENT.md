# 🚀 NexaRoute Logistics — Production Deployment Guide

This guide covers how to deploy the **NexaRoute Logistics** platform to various cloud providers and hosting environments. All configuration files have already been prepared in this repository.

---

## 📋 Overview of Available Deployment Methods

| Target Environment | Best For | Included Config | API & Backend Support |
| :--- | :--- | :--- | :--- |
| **Vercel** | Fastest global edge hosting, automatic SSL | `vercel.json` + `api/index.js` | ✅ Full Serverless REST & GraphQL |
| **Netlify** | Static + Serverless Edge hosting | `netlify.toml` | ✅ Static + Client-side Fallback |
| **GitHub Pages** | Free public hosting on GitHub | `.github/workflows/deploy.yml` | ✅ Static + Local Fallback |
| **Docker (Any VPS/Cloud)** | AWS ECS, DigitalOcean, Render, Railway, Fly.io | `Dockerfile` + `docker-compose.yml` | ✅ Complete Node.js runtime & JSON persistence |

---

## 1. ⚡ Deploying to Vercel (Recommended)

Vercel provides instant global deployment with automated HTTPS and serverless API execution.

### Option A: Via GitHub / GitLab / Bitbucket (Zero-Configuration)
1. Push this repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of NexaRoute Logistics platform"
   git branch -M main
   git remote add origin https://github.com/<your-username>/nexaroute-logistics.git
   git push -u origin main
   ```
2. Go to **[vercel.com/new](https://vercel.com/new)** and import your `nexaroute-logistics` repository.
3. Keep default settings (Framework: *Other*, Root Directory: `./`).
4. Click **Deploy**. Vercel will read `vercel.json` and deploy both the static pages and the `/api/*` serverless function automatically.

### Option B: Via Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy immediately from your project folder
vercel

# Deploy directly to production
vercel --prod
```

---

## 2. 🌐 Deploying to Netlify

### Option A: Drag & Drop (Instant Preview)
1. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)**.
2. Drag and drop the `nexaroute-logistics` project directory into the browser window.
3. Your site will be live instantly with a free `*.netlify.app` domain.

### Option B: Via Netlify CLI
```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod
```

---

## 3. 🐙 Deploying to GitHub Pages

A pre-configured GitHub Actions workflow (`.github/workflows/deploy.yml`) is included in the project.

1. Push your repository to GitHub.
2. In your GitHub repository, navigate to:
   **Settings** ➔ **Pages** ➔ **Build and deployment**.
3. Under **Source**, select **GitHub Actions**.
4. Push a new commit or manually run the workflow under the **Actions** tab.
5. Your site will be published at `https://<your-username>.github.io/<repo-name>/`.

---

## 4. 🐳 Deploying with Docker (AWS, DigitalOcean, VPS, Render)

The project includes an optimized `Dockerfile` based on `node:20-alpine` with built-in health checks and non-root security.

### Local or VPS Docker Run
```bash
# Build the Docker container image
docker build -t nexaroute-logistics:latest .

# Run the container exposing port 3000
docker run -d -p 3000:3000 --name nexaroute nexaroute-logistics:latest
```

### With Docker Compose
```bash
# Start container with volume persistence for data/
docker compose up -d

# Check logs
docker compose logs -f

# Stop container
docker compose down
```

### Deploy to Render or Railway
- **Render:** Create a **New Web Service**, connect your GitHub repo, select **Docker** as environment, and click Deploy.
- **Railway:** Run `railway up` or connect via GitHub; Railway will auto-detect the `Dockerfile` and expose port `3000`.
- **Fly.io:** Run `fly launch` in the repository root.

---

## 5. 🏷️ Custom Domain & Production Checklist

1. **Custom Domain DNS Records:**
   - For apex domain (`example.com`): Add an `A` record pointing to your cloud host IP (e.g. `76.76.21.21` for Vercel).
   - For subdomain (`www.example.com` or `logistics.example.com`): Add a `CNAME` record pointing to `cname.vercel-dns.com` or your provider's hostname.
2. **SEO & Metadata:**
   - Update canonical URLs and Open Graph tags in `<head>` of all HTML files to match your live production domain.
3. **Company Registration & Contact Details:**
   - Replace placeholder GSTIN, CIN, address, and telephone numbers in the footer and `contact.html` with your registered commercial credentials.
4. **CRM / Webhook Integration:**
   - If routing inquiries to Salesforce, HubSpot, or Zoho CRM, configure your webhook endpoint in `server.js` or `js/contact.js`.

---

## 🩺 Verifying Production Health

Once deployed, you can verify your production instance at:
- `https://your-domain.com/api/health`
- Expected output:
  ```json
  {
    "status": "healthy",
    "service": "NexaRoute Logistics Express API",
    "version": "2.5.0",
    "uptimeSeconds": 481
  }
  ```
