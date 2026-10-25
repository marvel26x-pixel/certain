import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT) || 3000;
const enquiryTypes = new Set(['General', 'Retailer', 'Distributor', 'Other']);

app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:'],
      styleSrc: ["'self'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: null
    }
  }
}));
app.use(express.json({ limit: '10kb' }));

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many enquiries from this connection. Please try again later.' }
});

app.get('/api/products', async (_request, response, next) => {
  try {
    const products = JSON.parse(await readFile(path.join(directory, 'data', 'products.json'), 'utf8'));
    response.json(products);
  } catch (error) {
    next(error);
  }
});

app.post('/api/contact', contactLimiter, async (request, response) => {
  const { name, email, phone, type, business, location, message, website } = request.body ?? {};
  const clean = (value, maxLength) => typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
  const enquiry = {
    name: clean(name, 120),
    email: clean(email, 254),
    phone: clean(phone, 40),
    type: clean(type, 20),
    business: clean(business, 160),
    location: clean(location, 120),
    message: clean(message, 4000)
  };

  if (website) return response.status(200).json({ message: 'Thanks. Your enquiry has been received.' });
  if (!enquiry.name || !enquiry.message || !enquiryTypes.has(enquiry.type)) {
    return response.status(400).json({ error: 'Please complete the required fields and choose an enquiry type.' });
  }
  if (!enquiry.email && !enquiry.phone) {
    return response.status(400).json({ error: 'Please provide an email address or phone number.' });
  }
  if (enquiry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) {
    return response.status(400).json({ error: 'Enter a valid email address.' });
  }
  if (['Retailer', 'Distributor'].includes(enquiry.type) && !enquiry.business) {
    return response.status(400).json({ error: 'Please add your business name for trade enquiries.' });
  }

  const mailConfig = ['CONTACT_TO', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
  if (mailConfig.some((key) => !process.env[key])) {
    return response.status(503).json({ error: 'Enquiry delivery is not configured yet. Please contact the brand through its official channels.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    const details = [
      `Name: ${enquiry.name}`,
      `Email: ${enquiry.email || 'Not provided'}`,
      `Phone: ${enquiry.phone || 'Not provided'}`,
      `Enquiry type: ${enquiry.type}`,
      `Business: ${enquiry.business || 'Not provided'}`,
      `Location: ${enquiry.location || 'Not provided'}`,
      '',
      enquiry.message
    ].join('\n');

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.CONTACT_TO,
      replyTo: enquiry.email || undefined,
      subject: `Certain biscuits website enquiry: ${enquiry.type}`,
      text: details
    });
    return response.status(200).json({ message: 'Thanks. Your enquiry has been received.' });
  } catch {
    return response.status(502).json({ error: 'We could not send your enquiry right now. Please try again later.' });
  }
});

app.use('/api', (_request, response) => response.status(404).json({ error: 'API route not found.' }));
app.use(express.static(path.join(directory, 'public'), { extensions: ['html'] }));
app.use((_request, response) => response.status(404).sendFile(path.join(directory, 'public', '404.html')));
app.use((error, _request, response, _next) => {
  console.error('Request failed:', error.message);
  response.status(500).json({ error: 'Something went wrong. Please try again later.' });
});

app.listen(port, () => console.log(`Certain biscuits website running at http://localhost:${port}`));