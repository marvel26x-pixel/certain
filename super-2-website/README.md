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

## Put it online

GitHub keeps the project code. Render runs the Express backend; **GitHub Pages alone can’t run this app’s server or contact API**.

1. Install [GitHub Desktop](https://desktop.github.com/) and sign in.
2. Choose **File → Add local repository** and select this project folder. If it isn’t a repository yet, create one there.
3. Publish it to GitHub. Keeping it **Private** is sensible while content and contact settings are being prepared.
4. Create an account at [Render](https://render.com/), choose **New → Blueprint**, connect the GitHub repository, and deploy. Render uses the included `render.yaml`.
5. Open the Render URL when deployment finishes. A push to the connected GitHub repository starts a new deployment.

The `.gitignore` excludes `.env` and `node_modules`. Never commit credentials, private enquiry data, or SMTP passwords.

## Enable enquiry delivery

For local testing, add these values to `.env`. On Render, add them under the service’s private **Environment** settings instead. Use an approved sending account; keep secrets out of browser code and GitHub.

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