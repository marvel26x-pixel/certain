<div align="center">

# CERTAIN BISCUITS

### A bright little home for the biscuit break.

Brand website · Product catalogue · Retail and distributor enquiries

<br>

![Node.js](https://img.shields.io/badge/Node.js-20%2B-31725e?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-API-152b2a?style=flat-square&logo=express&logoColor=white)
![Status](https://img.shields.io/badge/status-in%20progress-e5533e?style=flat-square)

</div>

---

> **Brand note:** Biscuit names, pack illustrations, and category details in the catalogue are fictional placeholders. Replace them with brand-approved assets and facts before launch.

## What’s inside

| Page or route | What it does |
| --- | --- |
| `/` | Brand homepage, story, FAQs, and contact form |
| `/catalogue` | Filterable biscuit catalogue with sample products |
| `/privacy.html` | Draft privacy notice for enquiry submissions |
| `GET /api/products` | Returns catalogue data from `data/products.json` |
| `POST /api/contact` | Validates and sends enquiries through configured SMTP |

The frontend is responsive HTML, CSS, and JavaScript. Express serves the pages and API from one Node.js app.

## Run it locally

**You’ll need:** Node.js 20 or newer and npm.

```powershell
cd path\to\super-2-website
npm install
Copy-Item .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The biscuit catalogue is at [http://localhost:3000/catalogue](http://localhost:3000/catalogue).

The site itself works without email settings. Contact submissions will show a configuration message until SMTP is set up.

## Make the catalogue yours

Edit `data/products.json`. Each product can include these filter fields:

```json
{
  "id": "sample-01",
  "name": "Approved biscuit name",
  "description": "Brand-approved description.",
  "type": "Plain biscuit",
  "flavour": "Original",
  "texture": "Crisp",
  "occasion": "Tea break",
  "palette": "coral"
}
```

Supported sample pack palettes: `coral`, `yellow`, `blue`, and `green`. Add approved, optimized product imagery under `public/images/products/` when it’s ready. Don’t infer ingredients, allergens, nutrition, or product claims.

## Publish with GitHub Pages

The workflow at the repository root (`.github/workflows/deploy-pages.yml`) builds this site from the `super-2-website/` folder and publishes it when you push to `main`. It prepares the `/certain/` project-site path automatically.

1. Push or merge these changes to the `main` branch of the connected `marvel26x-pixel/certain` repository.
2. On GitHub, open **Settings → Pages** and set the build and deployment source to **GitHub Actions**.
3. Open the repository’s **Actions** tab and wait for **Deploy to GitHub Pages** to finish successfully.
4. Visit `https://marvel26x-pixel.github.io/certain/`. The catalogue is at `/certain/catalogue/`.

GitHub Pages serves static files only. The product catalogue works from its JSON file, but **the Express contact API and email sending do not run on Pages**. The deployed form is clearly disabled until a separate backend or approved form provider is connected. Do not remove that notice unless contact delivery has been tested.

The `.gitignore` excludes `.env`, `node_modules`, and the generated `dist` folder. Never commit credentials, private enquiry data, or SMTP passwords. GitHub Pages visibility depends on your repository and plan settings; confirm repository visibility requirements in GitHub before enabling the site.

## Enable enquiry delivery

For local testing, add these values to `.env`. If you later deploy the Express backend on Render, add them under the service’s private **Environment** settings. GitHub Pages cannot store or use these server-side SMTP secrets.

```env
CONTACT_TO=approved-inbox@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_FROM=website@example.com
```

The endpoint validates input, requires an email address or phone number, requires a business name for trade enquiries, rate-limits submissions, and uses a honeypot field. It returns an error if email delivery isn’t configured or fails.

## Before launch

- Replace placeholder biscuit names, artwork, and copy with approved brand material.
- Confirm official contact details, company information, and social links.
- Complete the privacy notice with the approved data controller and retention details.
- Configure SMTP and test a real enquiry from the live site.
- Review accessibility, mobile layouts, HTTPS, analytics consent, and hosting limits.

## Project map

```text
public/          Website pages, styles, scripts, and favicon
data/            Structured biscuit catalogue
server.js         Express server and enquiry API
render.yaml       Render deployment blueprint
.env.example      Local configuration template
```