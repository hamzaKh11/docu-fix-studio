# CVCraft - Production-Ready ATS CV Generator

CVCraft is a professional SaaS application that transforms messy CVs into ATS-friendly Google Docs and downloadable PDFs. Built with React, TypeScript, Tailwind CSS, and powered by Lovable Cloud for authentication, database, and storage.

## 🎯 Features

- **Smart CV Input**: Upload existing CV (PDF/DOCX/images) with auto-parsing OR create from scratch
- **ATS Optimization**: AI-powered CV generation using model templates from ex-FAANG engineers
- **Two-Pane Interface**: Real-time preview while editing
- **Multi-language Support**: English, French, Arabic
- **Cloud Storage**: Secure file storage with Lovable Cloud
- **Authentication**: Email/password + Google OAuth
- **Export Options**: Download as PDF or edit in Google Docs
- **ATS Scoring**: Get instant feedback on CV optimization
- **AI Recommendations**: Actionable suggestions to improve your CV

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **Tailwind CSS** with custom design tokens
- **Framer Motion** for animations
- **shadcn/ui** for UI components
- **React Hook Form** + **Zod** for validation

### Backend (Lovable Cloud)
- **Authentication**: Email/password + Google OAuth
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Storage**: Secure file storage buckets
- **Edge Functions**: Serverless functions (optional)

### External Integrations
- **n8n**: Workflow automation for CV processing
- **Google Docs API**: Document generation
- **Google Drive API**: PDF export
- **Lovable AI** or **Affinda**: OCR and CV parsing

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- n8n instance (for CV processing workflow)
- Google API credentials (for Google Docs creation)
- Affinda API key (or alternative resume parser)
- Supabase account (for auth & database)
- Stripe account (for billing)

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd cvcraft

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your actual credentials

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
npm run preview
```

## Architecture

### Frontend Flow

1. **Landing Page** (`/`): Hero, features, testimonials, pricing
2. **CV App** (`/app`): Two-pane editor with upload + form (left) and live preview (right)
3. **Auth** (`/auth`): Sign in / Sign up with Lovable Cloud or Supabase
4. **Preview**: Google Docs embed or HTML preview
5. **Actions**: Download PDF, rename document

### Backend Integration (n8n)

Create an n8n workflow with the following nodes:

1. **Webhook Trigger**: Receives CV upload + form data
2. **File Processing**: 
   - Parse uploaded file using Affinda API or similar
   - Extract structured data (name, email, experience, etc.)
3. **CV Generation**:
   - Format data into ATS-friendly structure
   - Create Google Doc using Google Docs API
   - Generate PDF using Google Drive API
4. **Response**: Return `{ doc_id, doc_preview_url, pdf_url }`

#### n8n Webhook Endpoint

```
POST https://YOUR_N8N/webhook/cvcrafter
Content-Type: multipart/form-data

Body:
- file: (binary) CV file (PDF/DOCX/image)
- data: (JSON) { name, email, phone, linkedin, summary, experience[], education[], skills[], languages[], certifications[], targetRole, language }

Response:
{
  "doc_id": "1a2b3c4d5e6f",
  "doc_preview_url": "https://docs.google.com/document/d/.../preview",
  "pdf_url": "https://drive.google.com/file/d/.../view"
}
```

### Google API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google Docs API and Google Drive API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs
6. Copy Client ID and Client Secret to `.env`

### Resume Parser (Affinda)

1. Sign up at [Affinda](https://www.affinda.com/)
2. Get your API key
3. Add to `.env` as `AFFINDA_API_KEY`

Alternative parsers:
- Sovren
- HireAbility
- RChilli

### Telemetry & Monitoring

#### Plausible Analytics

Add to `index.html` before `</head>`:

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

Events tracked:
- `cv_uploaded`: When user uploads a CV
- `cv_generated`: When CV is successfully processed
- `pdf_downloaded`: When user downloads PDF
- `signup_completed`: When user creates account

#### Sentry Error Tracking

```bash
npm install @sentry/react
```

Add to `src/main.tsx`:

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### Stripe Integration

1. Create a Stripe account
2. Get API keys (test & production)
3. Create products and prices for Pro & Enterprise plans
4. Add webhook endpoint for subscription events
5. Implement billing portal in `/app/settings`

See [Stripe Docs](https://stripe.com/docs) for detailed integration guide.

## Deployment

### Via Lovable

1. Open your project in Lovable
2. Click "Publish" in the top right
3. Configure custom domain (optional)

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

Recommended hosts:
- Vercel
- Netlify
- AWS Amplify
- Cloudflare Pages

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `N8N_WEBHOOK_URL` | n8n webhook endpoint | Yes |
| `AFFINDA_API_KEY` | Resume parser API key | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | For billing |
| `STRIPE_PUBLISHABLE_KEY` | Stripe public key | For billing |
| `SUPABASE_URL` | Supabase project URL | For auth |
| `SUPABASE_ANON_KEY` | Supabase anon key | For auth |
| `PLAUSIBLE_DOMAIN` | Your domain for analytics | Optional |
| `SENTRY_DSN` | Sentry error tracking DSN | Optional |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

- 📧 Email: support@cvcraft.com
- 💬 Discord: [Join our community](https://discord.gg/cvcraft)
- 📚 Docs: [docs.cvcraft.com](https://docs.cvcraft.com)

---

Built with ❤️ using [Lovable](https://lovable.dev)
