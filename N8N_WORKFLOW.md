# CVCraft n8n Workflow Guide

This document describes the complete n8n workflow for CVCraft's CV generation pipeline.

## Workflow Overview

The n8n workflow receives CV data from the CVCraft frontend, processes it using AI/OCR if needed, generates an ATS-optimized Google Doc using a model CV template, exports to PDF, uploads files to Supabase storage, and returns results.

## Workflow Steps

### 1. Webhook Trigger
- **Node**: Webhook
- **Method**: POST
- **Authentication**: API Key (x-api-key header)
- **Path**: `/webhook/cvcrafter`

**Expected Payload**:
```json
{
  "user_id": "uuid",
  "cv_id": "uuid",
  "cv_url": "https://... (optional, if user uploaded a file)",
  "form_fields": {
    "personal_info": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "linkedin": "linkedin.com/in/johndoe",
      "summary": "Experienced software engineer...",
      "skills": ["React", "TypeScript", "Node.js"],
      "languages": ["English", "French"],
      "certifications": ["AWS Certified"]
    },
    "experiences": [
      {
        "company": "Tech Corp",
        "position": "Senior Developer",
        "location": "San Francisco, CA",
        "start_date": "2020-01-15",
        "end_date": null,
        "is_current": true,
        "description": "Led development of...",
        "sort_order": 0
      }
    ],
    "education": [
      {
        "institution": "University of Technology",
        "degree": "Bachelor of Science",
        "field_of_study": "Computer Science",
        "location": "Boston, MA",
        "start_date": "2012-09-01",
        "end_date": "2016-05-31",
        "is_current": false,
        "description": "Graduated with honors",
        "sort_order": 0
      }
    ],
    "target_role": "Senior Software Engineer",
    "language": "en"
  }
}
```

### 2. Branch Logic (IF Node)
Check if `cv_url` exists:
- **YES**: User uploaded a CV → Go to CV Parser
- **NO**: User filled form manually → Skip to Google Docs Generator

### 3A. CV Parser (HTTP Request or Code Node)
**Only runs if cv_url exists**

**Option A: Use Affinda API** (Recommended for production)
- **Node**: HTTP Request
- **Method**: POST
- **URL**: `https://api.affinda.com/v3/resumes`
- **Headers**: 
  - `Authorization: Bearer {{$env.AFFINDA_API_KEY}}`
  - `Content-Type: application/json`
- **Body**:
```json
{
  "url": "{{$json.cv_url}}",
  "wait": true
}
```

**Option B: Use Lovable AI for OCR/Parsing** (Free alternative)
- **Node**: HTTP Request
- **Method**: POST
- **URL**: `https://ai.gateway.lovable.dev/v1/chat/completions`
- **Headers**:
  - `Authorization: Bearer {{$env.LOVABLE_API_KEY}}`
  - `Content-Type: application/json`
- **Body**:
```json
{
  "model": "google/gemini-2.5-flash",
  "messages": [
    {
      "role": "system",
      "content": "Extract structured CV data from the image/PDF. Return JSON with: personal_info (name, email, phone, linkedin, summary, skills[], languages[], certifications[]), experiences[] (company, position, location, start_date, end_date, is_current, description), education[] (institution, degree, field_of_study, location, start_date, end_date, description). Use format YYYY-MM-DD for dates."
    },
    {
      "role": "user",
      "content": [
        {
          "type": "image_url",
          "image_url": {
            "url": "{{$json.cv_url}}"
          }
        },
        {
          "type": "text",
          "text": "Parse this CV and extract all information."
        }
      ]
    }
  ]
}
```

**Parser Output Processing**:
- Map the parsed fields to the `form_fields` structure
- If a field is missing, insert placeholder: `{{MISSING_field_name}}`
- Merge with any existing `form_fields` from the webhook

### 4. Fetch Model CV Template (HTTP Request)
- **Node**: HTTP Request
- **Method**: GET
- **URL**: Supabase Storage URL for model CV
- **Purpose**: Download the reference CV template

**Query to get template**:
```sql
SELECT file_url FROM templates 
WHERE language = '{{$json.form_fields.language}}' 
AND is_default = true 
LIMIT 1
```

### 5. AI CV Generator (HTTP Request to Lovable AI)
- **Node**: HTTP Request
- **Method**: POST
- **URL**: `https://ai.gateway.lovable.dev/v1/chat/completions`
- **Headers**:
  - `Authorization: Bearer {{$env.LOVABLE_API_KEY}}`
  - `Content-Type: application/json`

**System Prompt** (use the model CV as context):
```
You are an expert ATS-optimized CV writer. I will provide you with:
1. A model CV from an ex-Google engineer (as reference for structure, tone, and formatting)
2. Candidate's raw data (personal info, experiences, education)

Your task:
- Use the model CV's STRUCTURE and PROFESSIONAL TONE as a guide
- Write an ATS-friendly CV using the candidate's actual data
- Do NOT fabricate facts. If data is missing ({{MISSING_x}}), leave it as a clear placeholder
- Optimize for keyword density relevant to: {{target_role}}
- Keep bullet points action-oriented and quantified where possible
- Maintain clean formatting suitable for ATS parsing

OUTPUT: Return ONLY the CV content in clean Markdown format, ready to convert to Google Docs.

MODEL CV (for reference only):
{{model_cv_content}}

CANDIDATE DATA:
{{JSON.stringify(form_fields, null, 2)}}

TARGET ROLE: {{target_role}}
```

**Request Body**:
```json
{
  "model": "google/gemini-2.5-flash",
  "messages": [
    {
      "role": "system",
      "content": "{{system_prompt}}"
    },
    {
      "role": "user",
      "content": "Generate the ATS-optimized CV now."
    }
  ]
}
```

### 6. Create Google Doc (Google Docs API)
- **Node**: HTTP Request or Google Docs node
- **Method**: POST
- **URL**: `https://docs.googleapis.com/v1/documents`
- **Authentication**: Google Service Account
- **Body**:
```json
{
  "title": "{{$json.form_fields.personal_info.name}} - CV - {{$now.format('YYYY-MM-DD')}}"
}
```

**Response**: Contains `documentId`

### 7. Populate Google Doc Content
- **Node**: HTTP Request
- **Method**: POST
- **URL**: `https://docs.googleapis.com/v1/documents/{{documentId}}:batchUpdate`
- **Body**: Convert the AI-generated Markdown to Google Docs requests
  - Use `insertText` for content
  - Use `updateTextStyle` for formatting (bold, font size, etc.)
  - Use `createParagraphBullets` for bullet points

### 8. Export to PDF (Google Drive API)
- **Node**: HTTP Request
- **Method**: GET
- **URL**: `https://www.googleapis.com/drive/v3/files/{{documentId}}/export?mimeType=application/pdf`
- **Authentication**: Google Service Account
- **Binary Response**: true

### 9. Upload PDF to Supabase Storage
- **Node**: HTTP Request
- **Method**: POST
- **URL**: `{{SUPABASE_URL}}/storage/v1/object/cv-generated/{{user_id}}/{{cv_id}}.pdf`
- **Headers**:
  - `Authorization: Bearer {{SUPABASE_SERVICE_ROLE_KEY}}`
  - `Content-Type: application/pdf`
- **Body**: Binary PDF data from step 8

### 10. Generate Signed URL for PDF
- **Node**: HTTP Request
- **Method**: POST
- **URL**: `{{SUPABASE_URL}}/storage/v1/object/sign/cv-generated/{{user_id}}/{{cv_id}}.pdf`
- **Headers**:
  - `Authorization: Bearer {{SUPABASE_SERVICE_ROLE_KEY}}`
- **Body**:
```json
{
  "expiresIn": 3600
}
```

### 11. Calculate ATS Score (Code Node or AI)
**Simple scoring logic**:
```javascript
const cv_text = $input.first().json.ai_generated_cv;
const target_role = $input.first().json.form_fields.target_role;

// Keywords to check (customize per role)
const keywords = ["react", "typescript", "javascript", "node.js", "agile", "ci/cd"];
let score = 0;

keywords.forEach(keyword => {
  if (cv_text.toLowerCase().includes(keyword.toLowerCase())) {
    score += 10;
  }
});

// Additional scoring factors
if (cv_text.length > 500 && cv_text.length < 2000) score += 20;
if (cv_text.split('\n').length > 10) score += 10;

return {
  json: {
    ats_score: Math.min(score, 100)
  }
};
```

### 12. Generate Recommendations (AI)
- **Node**: HTTP Request
- **Method**: POST
- **URL**: `https://ai.gateway.lovable.dev/v1/chat/completions`
- **Body**:
```json
{
  "model": "google/gemini-2.5-flash",
  "messages": [
    {
      "role": "system",
      "content": "You are an expert CV reviewer. Analyze this CV and provide 3-5 actionable recommendations to improve ATS compatibility and appeal for the target role."
    },
    {
      "role": "user",
      "content": "CV Content:\n{{cv_text}}\n\nTarget Role: {{target_role}}"
    }
  ]
}
```

Parse the response to extract recommendations as an array.

### 13. Update Supabase Database
- **Node**: HTTP Request
- **Method**: PATCH
- **URL**: `{{SUPABASE_URL}}/rest/v1/user_cvs?id=eq.{{cv_id}}`
- **Headers**:
  - `Authorization: Bearer {{SUPABASE_SERVICE_ROLE_KEY}}`
  - `apikey: {{SUPABASE_SERVICE_ROLE_KEY}}`
  - `Content-Type: application/json`
  - `Prefer: return=minimal`
- **Body**:
```json
{
  "status": "completed",
  "generated_doc_url": "https://docs.google.com/document/d/{{documentId}}",
  "generated_pdf_url": "{{signed_pdf_url}}",
  "ats_score": {{ats_score}},
  "recommendations": {{recommendations_array}}
}
```

### 14. Respond to Webhook
- **Node**: Respond to Webhook
- **Response Body**:
```json
{
  "success": true,
  "ats_score": {{ats_score}},
  "recommendations": {{recommendations}},
  "generated_doc_url": "https://docs.google.com/document/d/{{documentId}}",
  "generated_pdf_signed_url": "{{signed_pdf_url}}",
  "form_fields": {{parsed_fields if cv_url was provided}}
}
```

## Error Handling

Wrap critical steps in Try/Catch nodes:
- If CV parsing fails, return error with `form_fields: null`
- If Google Docs creation fails, return appropriate error
- Always set `cv.status = 'failed'` in database on errors
- Return descriptive error messages to frontend

## Environment Variables Required

```bash
# n8n Instance
AFFINDA_API_KEY=your_affinda_key  # Optional if using Lovable AI
LOVABLE_API_KEY=auto_provisioned  # For AI features
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account"...}
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
N8N_WEBHOOK_SECRET=random_secure_string
```

## Security Notes

1. **Always validate** the `x-api-key` header matches `N8N_WEBHOOK_SECRET`
2. **Use Service Role Key** only server-side (never expose to frontend)
3. **Set short expiry** on signed URLs (1-24 hours)
4. **Validate user_id** exists before processing
5. **Rate limit** the webhook to prevent abuse

## Testing the Workflow

**Test Payload (manual form)**:
```bash
curl -X POST https://YOUR_N8N/webhook/cvcrafter \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_webhook_secret" \
  -d '{
    "user_id": "test-user-uuid",
    "cv_id": "test-cv-uuid",
    "form_fields": {
      "personal_info": {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "phone": "+1234567890",
        "linkedin": "linkedin.com/in/janedoe",
        "summary": "Experienced product manager...",
        "skills": ["Product Strategy", "Agile", "Data Analysis"],
        "languages": ["English"],
        "certifications": []
      },
      "experiences": [],
      "education": [],
      "target_role": "Senior Product Manager",
      "language": "en"
    }
  }'
```

## Deployment Checklist

- [ ] Set up Google Cloud Project with Docs + Drive API enabled
- [ ] Create Service Account and download JSON key
- [ ] Configure n8n credentials for Google and Supabase
- [ ] Upload model CV to Supabase `cv-templates` bucket
- [ ] Insert template record into `templates` table
- [ ] Test webhook with sample data
- [ ] Monitor n8n logs for errors
- [ ] Set up alerts for failed workflows
