# Vconstech Website Backend

Independent Node.js + Express backend for the Vconstech website contact, demo request, pricing plans, and payment flow.

The frontend posts contact form data to this backend. The backend creates a lead through the existing CRM `POST /api/leads` endpoint first. Only after the CRM lead is created successfully, it returns the response and sends both the admin notification and customer auto reply through the Brevo Transactional Email API.

The frontend also requests pricing plans from this backend. The backend proxies `GET /api/plans` to the CRM backend using `CRM_API_BASE_URL` and returns the CRM JSON response without changing its structure.

Razorpay order creation and payment verification run on this backend. After a valid Razorpay signature, this backend calls the existing CRM purchase-success endpoint so CRM can create the subscription and sync ERP.

## Tech Stack

- Node.js
- Express
- CORS
- dotenv
- Helmet
- Morgan
- Nodemon
- Brevo Transactional Email API

## API Routes

```text
GET  /api/health
POST /api/contact
GET  /api/plans
POST /api/payment/create-order
POST /api/payment/verify
POST /api/demo
POST /api/payment
```

`POST /api/contact` forwards the lead payload to the CRM with:

- `status: "new"`
- `channel: "Website Demo"`
- today's `date`

CRM validation and duplicate-lead errors are returned to the frontend without sending emails.

## Environment Variables

Create `.env` from `.env.example`:

```text
NODE_ENV=development
PORT=5000
CORS_ORIGIN=https://vconstech.in,https://test1.vconstech.in,http://localhost:5173
WEBSITE_URL=https://vconstech.in
CRM_API_BASE_URL=https://vconstech-crm-new.onrender.com/api
SUPABASE_DB_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_backend_only_service_role_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

BREVO_API_KEY=your_brevo_api_key
SMTP_FROM_EMAIL=no-reply@vconstech.in
SMTP_FROM_NAME=Vconstech ERP
ADMIN_EMAIL=support@vconstech.in
```

## Local Development

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Verify:

```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/plans
```

Contact request:

```bash
curl -X POST http://localhost:5000/api/contact ^
  -H "Content-Type: application/json" ^
  -d "{\"fullName\":\"Test User\",\"company\":\"ABC Construction\",\"phone\":\"9876543210\",\"email\":\"test@example.com\",\"location\":\"Tirunelveli\",\"address\":\"Site office\",\"requirements\":\"I want a Vconstech ERP demo.\"}"
```

## Render Deployment

1. Push this backend project to Git.
2. Create a Render Web Service.
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add all required environment variables from `.env.example`.
6. Set `CORS_ORIGIN` to the deployed website URL. Use comma-separated values when more than one domain should access the API.
7. Deploy.
8. Verify `https://your-render-service.onrender.com/api/health`.

## Frontend Integration

After backend deployment, set this in the frontend environment:

```text
VITE_WEBSITE_API_BASE_URL=https://your-render-service.onrender.com/api
```

Then rebuild and redeploy the frontend.
