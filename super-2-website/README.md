# Certain biscuits Website

A responsive Certain biscuits brand website with a small Express backend for product data and retailer/customer enquiries. Brand-specific product facts, official assets, contact destinations, and company story have intentionally not been invented.

## Run locally

Requirements: Node.js 20 or newer and npm.

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Open `http://localhost:3000` for the home page or `http://localhost:3000/catalogue` for the standalone biscuit catalogue. The site and API are served by the same Express process.

## Publish with GitHub and Render

GitHub stores the project code. Render runs the Express server, so the product API and contact endpoint work online too. GitHub Pages alone cannot run this backend.

### 1. Install GitHub Desktop

Install GitHub Desktop from [desktop.github.com](https://desktop.github.com/) and sign in with your GitHub account. GitHub Desktop includes Git, so you do not need to install Git separately.

### 2. Create a GitHub repository

1. In GitHub Desktop, choose **File > Add local repository**.
2. Select this project folder: `C:\Users\Glitch\Documents\Dev\super-2-website`.
3. If prompted that it is not a repository, choose the option to create a repository here. Keep the project folder as the local path.
4. Name it `super-2-website`. Choose **Private** while the brand content and contact settings are still being prepared.
5. Create the repository, then choose **Publish repository** and keep **Keep this code private** selected.

The `.gitignore` keeps `node_modules` and `.env` out of Git. Never upload SMTP passwords, private credentials, or real enquiry data.

### 3. Deploy from the GitHub repository

1. Create/sign in to an account at [render.com](https://render.com/).
2. In Render, choose **New > Blueprint** and connect your GitHub account.
3. Select the `super-2-website` repository. Render reads `render.yaml`, installs dependencies, and starts the Express server.
4. When deployment finishes, open the `onrender.com` URL Render provides. The home page is `/`, and the biscuit catalogue is `/catalogue`.

The included `render.yaml` is the deployment configuration. A push to the connected GitHub repository triggers a new deployment.

### 4. Configure enquiry email before launch

In the Render service, open **Environment** and add the SMTP settings listed in the local `.env.example` file as environment variables. Use credentials for an approved sending account, and add them only in Render's private Environment settings, never in GitHub. The form intentionally reports that delivery is unavailable until all required mail settings are configured.

Before making the site public, replace sample products with approved content, complete the privacy notice, and test a real enquiry end to end. Free hosting availability and limits can change; review the host's current plan details before relying on it for production.

## Enquiry email setup

Set these values in `.env` using an approved SMTP account. Do not commit `.env` or put credentials in client-side files.

```env
CONTACT_TO=approved-inbox@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_FROM=website@example.com
```

The contact endpoint validates and bounds submitted fields, requires an email or phone number, requires a business name for trade enquiries, applies per-IP rate limiting, and uses a hidden honeypot field. With no SMTP configuration, it returns a clear service-unavailable response rather than claiming an enquiry was delivered.

## Product content

Add approved products to `data/products.json`:

```json
[
  {
    "name": "Approved product name",
    "description": "Approved short description",
    "image": "/images/products/approved-pack.webp",
    "imageAlt": "Approved product name package"
  }
]
```

Only publish product data and imagery supplied or approved by the brand. Place optimized pack images under `public/images/products/`.

## Before launch

- Replace the illustrative hero art with official approved logo and product photography.
- Confirm all copy, product names, product imagery, company details, and contact destinations.
- Have the privacy notice completed with the approved controller details, retention period, and applicable legal review.
- Configure HTTPS and trusted proxy settings/rate limiting for the production host.
- Add the approved analytics provider only after consent and privacy requirements are settled.
- Verify accessibility, mobile layouts, links, email delivery, and browser support before publication.

## API

- `GET /api/products` returns the structured product list.
- `POST /api/contact` accepts `name`, `email`, `phone`, `type`, `business`, `location`, `message`, and the honeypot `website` field.