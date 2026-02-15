# JanSaarthi AI – Technical Design Document

## Document Overview

This document provides the technical architecture, system design, and implementation specifications for JanSaarthi AI, a cloud-native civic technology platform that democratizes access to government welfare schemes through AI-powered simplification and multilingual support.

## Architecture Overview

### System Architecture

JanSaarthi AI follows a modern cloud-native architecture deployed on AWS infrastructure with the following key characteristics:

- **Frontend**: React-based single-page application (SPA) with mobile-first responsive design
- **Backend**: Node.js/Express REST API with microservices architecture
- **AI Layer**: Amazon Bedrock integration for content simplification and translation
- **OCR Processing**: Amazon Textract for Aadhaar card data extraction
- **Data Storage**: Amazon RDS PostgreSQL for structured data, S3 for temporary file storage
- **Caching**: Amazon ElastiCache Redis for session management and performance optimization
- **Infrastructure**: AWS ECS Fargate for containerized deployment with auto-scaling

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Devices                             │
│              (Mobile Browsers, Desktop Browsers)                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Amazon CloudFront CDN                         │
│                  (Static Assets, Edge Caching)                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AWS Application Load Balancer                 │
│                      (SSL/TLS Termination)                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                         AWS WAF                                  │
│              (DDoS Protection, Rate Limiting)                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
┌──────────────────┐           ┌──────────────────┐
│   ECS Fargate    │           │   ECS Fargate    │
│  Container AZ-1  │           │  Container AZ-2  │
│                  │           │                  │
│  ┌────────────┐  │           │  ┌────────────┐  │
│  │  Frontend  │  │           │  │  Frontend  │  │
│  │   (React)  │  │           │  │   (React)  │  │
│  └────────────┘  │           │  └────────────┘  │
│                  │           │                  │
│  ┌────────────┐  │           │  ┌────────────┐  │
│  │  Backend   │  │           │  │  Backend   │  │
│  │  (Node.js) │  │           │  │  (Node.js) │  │
│  └────────────┘  │           │  └────────────┘  │
└────────┬─────────┘           └────────┬─────────┘
         │                               │
         └───────────────┬───────────────┘
                         │
         ┌───────────────┼───────────────┬──────────────┐
         ▼               ▼               ▼              ▼
  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
  │ Amazon   │   │ Amazon   │   │ Amazon   │   │   RDS    │
  │ Bedrock  │   │ Textract │   │ElastiCache│   │PostgreSQL│
  │  (LLM)   │   │  (OCR)   │   │  (Redis) │   │ Multi-AZ │
  └──────────┘   └──────────┘   └──────────┘   └──────────┘
                                                      │
                                                      ▼
                                              ┌──────────────┐
                                              │  Amazon S3   │
                                              │  (Temp Files)│
                                              └──────────────┘
```

### Design Principles

1. **Privacy-First**: Minimize data collection, automatic deletion, no permanent PII storage
2. **Mobile-First**: Responsive design optimized for low-bandwidth mobile networks
3. **Accessibility**: WCAG 2.1 AA compliance for inclusive access
4. **Scalability**: Horizontal scaling with stateless services
5. **Resilience**: Multi-AZ deployment, graceful degradation, circuit breakers
6. **Security**: Defense-in-depth with encryption, WAF, rate limiting
7. **Observability**: Comprehensive logging, monitoring, and alerting
8. **Cost Optimization**: Efficient resource utilization, caching, request throttling

## Component Design

### 1. Frontend Application


#### Technology Stack
- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit for global state, React Query for server state
- **Routing**: React Router v6
- **UI Components**: Material-UI (MUI) with custom theme
- **Form Handling**: React Hook Form with Zod validation
- **Internationalization**: i18next for multilingual support
- **Build Tool**: Vite for fast development and optimized production builds
- **Testing**: Jest + React Testing Library

#### Key Features
- Progressive Web App (PWA) capabilities for offline support
- Lazy loading and code splitting for performance
- Responsive design with mobile-first breakpoints
- Accessibility features (ARIA labels, keyboard navigation, screen reader support)
- Image optimization and compression before upload
- Client-side validation before API calls

#### Page Structure

```
/                           → Landing page with language selection
/upload                     → Aadhaar card upload with consent
/profile                    → Extracted data review and manual entry option
/results                    → Eligible schemes list with filtering
/scheme/:id                 → Detailed scheme view with AI simplification
/compare                    → Side-by-side scheme comparison
/guidance/:id               → Step-by-step application guidance
/privacy                    → Privacy policy and data handling
/help                       → User guide and FAQs
```


### 2. Backend API Services

#### Technology Stack
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js with TypeScript
- **API Documentation**: OpenAPI 3.0 (Swagger)
- **Validation**: Zod for request/response validation
- **Authentication**: JWT for session management
- **ORM**: Prisma for database access
- **Testing**: Jest + Supertest for API testing
- **Logging**: Winston with structured JSON logging
- **Monitoring**: AWS CloudWatch integration

#### Microservices Architecture

**1. Identity Service**
- Handles Aadhaar upload and OCR processing
- Integrates with Amazon Textract
- Manages consent and data deletion
- Endpoints:
  - `POST /api/v1/identity/upload` - Upload Aadhaar image
  - `POST /api/v1/identity/extract` - Trigger OCR extraction
  - `GET /api/v1/identity/profile` - Retrieve extracted profile
  - `DELETE /api/v1/identity/data` - Delete user data immediately
  - `POST /api/v1/identity/consent` - Record consent action

**2. Eligibility Service**
- Rule-based eligibility matching engine
- Scheme database queries and filtering
- Relevance scoring algorithm
- Endpoints:
  - `POST /api/v1/eligibility/match` - Find eligible schemes
  - `GET /api/v1/eligibility/explain/:schemeId` - Explain eligibility
  - `POST /api/v1/eligibility/check` - Check single scheme eligibility


**3. AI Service**
- Amazon Bedrock integration for content generation
- Prompt management and versioning
- Output validation and quality checks
- Caching layer for repeated requests
- Endpoints:
  - `POST /api/v1/ai/simplify` - Simplify scheme document
  - `POST /api/v1/ai/translate` - Translate content to target language
  - `POST /api/v1/ai/explain` - Generate contextual explanation
  - `GET /api/v1/ai/cache/:key` - Retrieve cached AI response

**4. Scheme Service**
- Scheme database CRUD operations
- Search and filtering capabilities
- Scheme comparison logic
- Endpoints:
  - `GET /api/v1/schemes` - List schemes with pagination
  - `GET /api/v1/schemes/:id` - Get scheme details
  - `GET /api/v1/schemes/search` - Search schemes
  - `POST /api/v1/schemes/compare` - Compare multiple schemes
  - `GET /api/v1/schemes/categories` - List scheme categories

**5. Analytics Service**
- Anonymized usage tracking
- Metrics aggregation
- Dashboard data endpoints
- Endpoints:
  - `POST /api/v1/analytics/event` - Track user event
  - `GET /api/v1/analytics/metrics` - Retrieve aggregated metrics
  - `GET /api/v1/analytics/dashboard` - Dashboard data


### 3. AI Integration Layer

#### Amazon Bedrock Configuration

**Model Selection**:
- **Primary Model**: Claude 3 Sonnet for content simplification and translation
- **Fallback Model**: Amazon Titan Text Express for cost optimization
- **Temperature**: 0.3-0.5 for factual content generation
- **Max Tokens**: 2000 for simplification, 1500 for translation

**Prompt Templates**:

```typescript
// Simplification Prompt Template
const SIMPLIFICATION_PROMPT = `
You are a government scheme simplification assistant. Your task is to convert complex policy language into simple, clear explanations that can be understood by someone with 6th-8th grade education.

Original Scheme Document:
{scheme_content}

Instructions:
1. Preserve all factual information (eligibility criteria, benefit amounts, deadlines)
2. Use simple vocabulary and short sentences
3. Explain technical terms in plain language
4. Maintain accuracy - do not add information not in the original
5. Structure the output with clear sections: What is it?, Who can apply?, Benefits, How to apply?

Generate simplified version:
`;

// Translation Prompt Template
const TRANSLATION_PROMPT = `
You are a professional translator specializing in government documents. Translate the following scheme information from {source_language} to {target_language}.

Content to translate:
{content}

Instructions:
1. Maintain legal and technical accuracy
2. Use culturally appropriate terminology
3. Keep consistent terminology for legal terms
4. Preserve formatting and structure
5. Adapt examples to regional context where appropriate

Translated content:
`;

// Contextual Explanation Prompt Template
const CONTEXTUAL_EXPLANATION_PROMPT = `
You are helping a citizen understand a government scheme. Generate a personalized explanation based on their profile.

User Profile:
- Occupation: {occupation}
- Location: {location}
- Age: {age}
- Income Level: {income_level}

Scheme Information:
{scheme_details}

Instructions:
1. Explain why this scheme is relevant to the user
2. Provide examples specific to their occupation and location
3. Highlight key benefits in their context
4. Use simple, conversational language
5. Keep explanation under 200 words

Generate personalized explanation:
`;
```

#### Output Validation

```typescript
interface ValidationResult {
  isValid: boolean;
  confidence: number;
  issues: string[];
  originalFacts: string[];
  generatedFacts: string[];
}

// Validation checks:
// 1. Fact preservation: Extract key facts from original and generated content
// 2. Hallucination detection: Flag content not present in source
// 3. Readability score: Verify 6th-8th grade reading level
// 4. Length check: Ensure output is not excessively long or short
// 5. Format validation: Check for required sections
```


#### Caching Strategy

```typescript
// Cache key structure: ai:{operation}:{language}:{contentHash}
// Example: ai:simplify:en:a3f5b2c1d4e6

interface CacheConfig {
  simplification: {
    ttl: 7 * 24 * 60 * 60, // 7 days
    invalidateOn: 'scheme_update'
  },
  translation: {
    ttl: 30 * 24 * 60 * 60, // 30 days
    invalidateOn: 'never' // Translations are stable
  },
  contextualExplanation: {
    ttl: 24 * 60 * 60, // 24 hours
    invalidateOn: 'profile_change'
  }
}
```

### 4. OCR Processing Pipeline

#### Amazon Textract Integration

**Processing Flow**:
1. Image upload to S3 with temporary lifecycle policy (24-hour expiration)
2. Trigger Textract asynchronous job
3. Extract text with confidence scores
4. Parse Aadhaar-specific fields using regex patterns
5. Validate extracted data
6. Return structured profile data
7. Delete S3 object after successful extraction

**Field Extraction Patterns**:

```typescript
interface AadhaarFields {
  name: {
    pattern: /Name[:\s]+([A-Za-z\s]+)/i,
    confidence: number
  },
  dob: {
    pattern: /DOB[:\s]+(\d{2}\/\d{2}\/\d{4})/i,
    confidence: number
  },
  gender: {
    pattern: /Gender[:\s]+(Male|Female|Transgender)/i,
    confidence: number
  },
  address: {
    pattern: /Address[:\s]+(.+?)(?=Aadhaar|$)/is,
    confidence: number
  },
  aadhaarNumber: {
    pattern: /\d{4}\s\d{4}\s\d{4}/,
    maskDisplay: true // Show only last 4 digits
  }
}
```


**Quality Validation**:
- Reject images with average confidence < 80%
- Flag fields with confidence < 90% for user review
- Validate Aadhaar number checksum
- Check for required fields presence
- Detect image quality issues (blur, low resolution)

### 5. Eligibility Matching Engine

#### Rule Engine Architecture

```typescript
interface EligibilityRule {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'between';
  value: any;
  logic?: 'AND' | 'OR';
}

interface SchemeEligibility {
  schemeId: string;
  rules: EligibilityRule[];
  requiredDocuments: string[];
  priority: number;
}

// Example: Senior Citizen Pension Scheme
const seniorCitizenPension: SchemeEligibility = {
  schemeId: 'SC-PENSION-001',
  rules: [
    { field: 'age', operator: 'gte', value: 60, logic: 'AND' },
    { field: 'income', operator: 'lt', value: 100000, logic: 'AND' },
    { field: 'state', operator: 'in', value: ['MH', 'DL', 'KA'], logic: 'AND' }
  ],
  requiredDocuments: ['age_proof', 'income_certificate', 'residence_proof'],
  priority: 1
};
```


#### Matching Algorithm

```typescript
class EligibilityMatcher {
  match(userProfile: UserProfile, schemes: SchemeEligibility[]): MatchResult[] {
    const results: MatchResult[] = [];
    
    for (const scheme of schemes) {
      const matchScore = this.evaluateRules(userProfile, scheme.rules);
      
      if (matchScore.isEligible) {
        results.push({
          schemeId: scheme.schemeId,
          isEligible: true,
          matchScore: matchScore.score,
          matchedCriteria: matchScore.matched,
          missingDocuments: this.checkDocuments(userProfile, scheme.requiredDocuments),
          relevanceScore: this.calculateRelevance(userProfile, scheme)
        });
      }
    }
    
    // Sort by relevance score (priority + match score + user context)
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
  
  private evaluateRules(profile: UserProfile, rules: EligibilityRule[]): EvaluationResult {
    let matched = [];
    let score = 0;
    
    for (const rule of rules) {
      const fieldValue = profile[rule.field];
      const isMatch = this.evaluateCondition(fieldValue, rule.operator, rule.value);
      
      if (isMatch) {
        matched.push(rule.field);
        score += 1;
      } else if (rule.logic === 'AND') {
        return { isEligible: false, score: 0, matched: [] };
      }
    }
    
    return { isEligible: true, score, matched };
  }
}
```


#### Relevance Scoring

```typescript
function calculateRelevance(profile: UserProfile, scheme: Scheme): number {
  let score = 0;
  
  // Base score from eligibility match strength (0-40 points)
  score += matchScore * 40;
  
  // Priority schemes get bonus (0-20 points)
  score += scheme.priority * 20;
  
  // Benefit amount relevance (0-15 points)
  if (scheme.benefitAmount > 0) {
    score += Math.min(scheme.benefitAmount / 10000, 15);
  }
  
  // Deadline urgency (0-15 points)
  if (scheme.deadline) {
    const daysUntilDeadline = daysBetween(new Date(), scheme.deadline);
    if (daysUntilDeadline < 30) {
      score += 15 - (daysUntilDeadline / 2);
    }
  }
  
  // Category match with user profile (0-10 points)
  if (profile.occupation && scheme.targetOccupations.includes(profile.occupation)) {
    score += 10;
  }
  
  return Math.min(score, 100);
}
```

### 6. Database Schema

#### PostgreSQL Schema Design

```sql
-- Users table (temporary session data only)
CREATE TABLE user_sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '24 hours',
  last_4_aadhaar CHAR(4), -- Only last 4 digits
  profile_data JSONB, -- Extracted profile (no Aadhaar number)
  consent_given BOOLEAN DEFAULT FALSE,
  consent_timestamp TIMESTAMP
);


-- Schemes table
CREATE TABLE schemes (
  scheme_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  administering_authority VARCHAR(255),
  description TEXT,
  eligibility_rules JSONB NOT NULL,
  benefit_amount DECIMAL(12, 2),
  benefit_description TEXT,
  required_documents JSONB,
  application_process JSONB,
  official_url VARCHAR(500),
  geographic_scope VARCHAR(50), -- national, state, district
  target_states JSONB,
  validity_start DATE,
  validity_end DATE,
  deadline DATE,
  priority INTEGER DEFAULT 5,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_category (category),
  INDEX idx_status (status),
  INDEX idx_geographic_scope (geographic_scope),
  INDEX idx_deadline (deadline)
);

-- Scheme content (multilingual)
CREATE TABLE scheme_content (
  content_id SERIAL PRIMARY KEY,
  scheme_id VARCHAR(50) REFERENCES schemes(scheme_id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL,
  simplified_description TEXT,
  simplified_eligibility TEXT,
  simplified_benefits TEXT,
  simplified_process TEXT,
  is_ai_generated BOOLEAN DEFAULT TRUE,
  human_reviewed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(scheme_id, language_code),
  INDEX idx_language (language_code)
);


-- Analytics (anonymized)
CREATE TABLE analytics_events (
  event_id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  user_state VARCHAR(50), -- State only, no PII
  user_language VARCHAR(5),
  timestamp TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_event_type (event_type),
  INDEX idx_timestamp (timestamp),
  INDEX idx_user_state (user_state)
);

-- AI cache table
CREATE TABLE ai_cache (
  cache_key VARCHAR(255) PRIMARY KEY,
  operation VARCHAR(50) NOT NULL,
  language_code VARCHAR(5),
  input_hash VARCHAR(64) NOT NULL,
  output_content TEXT NOT NULL,
  model_used VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  hit_count INTEGER DEFAULT 0,
  
  INDEX idx_operation (operation),
  INDEX idx_expires_at (expires_at)
);

-- Automatic cleanup job
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM user_sessions WHERE expires_at < NOW();
  DELETE FROM ai_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup every hour
SELECT cron.schedule('cleanup-sessions', '0 * * * *', 'SELECT cleanup_expired_sessions()');
```


### 7. Security Architecture

#### Authentication & Authorization

```typescript
// JWT token structure
interface JWTPayload {
  sessionId: string;
  last4Aadhaar: string; // For session identification only
  state: string;
  language: string;
  issuedAt: number;
  expiresAt: number;
}

// Token generation
function generateSessionToken(sessionData: SessionData): string {
  return jwt.sign(
    {
      sessionId: sessionData.sessionId,
      last4Aadhaar: sessionData.last4Aadhaar,
      state: sessionData.state,
      language: sessionData.language,
      issuedAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    },
    process.env.JWT_SECRET,
    { algorithm: 'HS256' }
  );
}
```

#### Data Encryption

**In Transit**:
- TLS 1.3 for all API communications
- Certificate management via AWS Certificate Manager
- HSTS headers enforced

**At Rest**:
- RDS encryption using AWS KMS
- S3 server-side encryption (SSE-S3)
- ElastiCache encryption enabled
- Secrets Manager for credential storage


#### Input Validation & Sanitization

```typescript
// Request validation middleware
import { z } from 'zod';

const UploadSchema = z.object({
  file: z.object({
    mimetype: z.enum(['image/jpeg', 'image/png', 'application/pdf']),
    size: z.number().max(5 * 1024 * 1024) // 5MB max
  }),
  consent: z.boolean().refine(val => val === true, {
    message: 'Consent is required'
  })
});

const ProfileSchema = z.object({
  name: z.string().min(2).max(100).regex(/^[A-Za-z\s]+$/),
  age: z.number().int().min(0).max(120),
  gender: z.enum(['Male', 'Female', 'Transgender', 'Other']),
  state: z.string().length(2).regex(/^[A-Z]{2}$/),
  income: z.number().min(0).max(100000000).optional(),
  occupation: z.string().max(100).optional()
});
```

#### Rate Limiting

```typescript
// Rate limiting configuration
const rateLimitConfig = {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 requests per hour per IP
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  
  // Custom key generator (IP + session)
  keyGenerator: (req) => {
    return `${req.ip}-${req.session?.id || 'anonymous'}`;
  },
  
  // Skip rate limiting for health checks
  skip: (req) => req.path === '/health'
};
```


#### AWS WAF Rules

```json
{
  "rules": [
    {
      "name": "RateLimitRule",
      "priority": 1,
      "action": "block",
      "rateLimit": {
        "limit": 2000,
        "window": 300
      }
    },
    {
      "name": "GeoBlockingRule",
      "priority": 2,
      "action": "block",
      "geoMatch": {
        "countryCodes": ["*"],
        "excludeCountryCodes": ["IN"]
      }
    },
    {
      "name": "SQLInjectionRule",
      "priority": 3,
      "action": "block",
      "managedRuleGroup": "AWSManagedRulesSQLiRuleSet"
    },
    {
      "name": "XSSRule",
      "priority": 4,
      "action": "block",
      "managedRuleGroup": "AWSManagedRulesKnownBadInputsRuleSet"
    }
  ]
}
```

### 8. Caching Strategy

#### Multi-Layer Caching

**Layer 1: CloudFront CDN**
- Static assets (JS, CSS, images): 30 days TTL
- HTML pages: 5 minutes TTL with stale-while-revalidate
- API responses: No caching (dynamic content)

**Layer 2: Redis (ElastiCache)**

```typescript
interface CacheStrategy {
  // Scheme data cache
  schemes: {
    key: 'scheme:{schemeId}',
    ttl: 24 * 60 * 60, // 24 hours
    invalidateOn: ['scheme_update']
  },
  
  // Eligibility results cache
  eligibility: {
    key: 'eligibility:{profileHash}',
    ttl: 60 * 60, // 1 hour
    invalidateOn: ['profile_change', 'scheme_update']
  },
  
  // AI-generated content cache
  aiContent: {
    key: 'ai:{operation}:{language}:{contentHash}',
    ttl: 7 * 24 * 60 * 60, // 7 days
    invalidateOn: ['scheme_update']
  },
  
  // Session data cache
  session: {
    key: 'session:{sessionId}',
    ttl: 24 * 60 * 60, // 24 hours
    invalidateOn: ['session_end', 'data_deletion']
  }
}

// Cache implementation
class CacheManager {
  async get<T>(key: string): Promise<T | null> {
    const cached = await redis.get(key);
    if (cached) {
      await redis.incr(`${key}:hits`);
      return JSON.parse(cached);
    }
    return null;
  }
  
  async set(key: string, value: any, ttl: number): Promise<void> {
    await redis.setex(key, ttl, JSON.stringify(value));
  }
  
  async invalidate(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}
```

### 9. Internationalization (i18n)

#### Language Support

```typescript
// Supported languages
const SUPPORTED_LANGUAGES = {
  en: 'English',
  hi: 'हिन्दी (Hindi)',
  bn: 'বাংলা (Bengali)',
  te: 'తెలుగు (Telugu)',
  mr: 'मराठी (Marathi)',
  ta: 'தமிழ் (Tamil)',
  gu: 'ગુજરાતી (Gujarati)',
  ur: 'اردو (Urdu)',
  kn: 'ಕನ್ನಡ (Kannada)',
  or: 'ଓଡ଼ିଆ (Odia)',
  ml: 'മലയാളം (Malayalam)',
  pa: 'ਪੰਜਾਬੀ (Punjabi)'
};

// i18next configuration
const i18nConfig = {
  fallbackLng: 'en',
  supportedLngs: Object.keys(SUPPORTED_LANGUAGES),
  defaultNS: 'common',
  ns: ['common', 'schemes', 'errors', 'validation'],
  
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
    addPath: '/locales/{{lng}}/{{ns}}.missing.json'
  },
  
  detection: {
    order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage', 'cookie']
  }
};

// Translation file structure
// /locales/en/common.json
{
  "app": {
    "title": "JanSaarthi AI",
    "tagline": "Discover Government Schemes You're Eligible For"
  },
  "navigation": {
    "home": "Home",
    "upload": "Upload Aadhaar",
    "results": "My Schemes",
    "help": "Help"
  },
  "consent": {
    "title": "Data Privacy Consent",
    "message": "We will extract information from your Aadhaar card to find eligible schemes. Your data will be automatically deleted within 24 hours.",
    "agree": "I Agree",
    "decline": "Decline"
  }
}
```


#### Content Translation Workflow

```typescript
class TranslationService {
  async translateSchemeContent(
    schemeId: string,
    targetLanguage: string
  ): Promise<TranslatedContent> {
    // Check cache first
    const cacheKey = `translation:${schemeId}:${targetLanguage}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;
    
    // Get original content
    const scheme = await db.schemes.findUnique({ where: { schemeId } });
    
    // Translate using Bedrock
    const translated = await bedrock.translate({
      content: scheme.description,
      sourceLanguage: 'en',
      targetLanguage: targetLanguage,
      context: 'government_scheme'
    });
    
    // Validate translation quality
    const validation = await this.validateTranslation(
      scheme.description,
      translated.content,
      targetLanguage
    );
    
    if (validation.score < 0.8) {
      // Flag for human review
      await this.flagForReview(schemeId, targetLanguage, validation.issues);
    }
    
    // Cache result
    await cache.set(cacheKey, translated, 30 * 24 * 60 * 60);
    
    return translated;
  }
}
```

### 10. Monitoring & Observability

#### CloudWatch Metrics

```typescript
// Custom metrics to track
const CUSTOM_METRICS = {
  // Performance metrics
  'API/ResponseTime': { unit: 'Milliseconds', dimensions: ['Endpoint', 'Method'] },
  'OCR/ProcessingTime': { unit: 'Milliseconds', dimensions: ['ImageQuality'] },
  'AI/GenerationTime': { unit: 'Milliseconds', dimensions: ['Operation', 'Model'] },
  
  // Business metrics
  'Users/SessionsCreated': { unit: 'Count', dimensions: ['State', 'Language'] },
  'Schemes/Matched': { unit: 'Count', dimensions: ['Category', 'State'] },
  'Schemes/Viewed': { unit: 'Count', dimensions: ['SchemeId'] },
  
  // Quality metrics
  'OCR/Accuracy': { unit: 'Percent', dimensions: ['FieldType'] },
  'AI/ValidationFailures': { unit: 'Count', dimensions: ['Operation', 'Reason'] },
  
  // Cost metrics
  'AWS/BedrockCost': { unit: 'None', dimensions: ['Model', 'Operation'] },
  'AWS/TextractCost': { unit: 'None', dimensions: ['DocumentType'] }
};
```


#### Structured Logging

```typescript
// Winston logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'jansaarthi-api',
    environment: process.env.NODE_ENV
  },
  transports: [
    new winston.transports.Console(),
    new WinstonCloudWatch({
      logGroupName: '/aws/ecs/jansaarthi',
      logStreamName: `${process.env.NODE_ENV}-${Date.now()}`
    })
  ]
});

// Log structure
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  service: string;
  environment: string;
  requestId?: string;
  userId?: string; // Session ID only, no PII
  metadata?: Record<string, any>;
  error?: {
    message: string;
    stack: string;
    code: string;
  };
}

// Usage example
logger.info('Eligibility match completed', {
  requestId: req.id,
  userId: req.session.id,
  metadata: {
    schemesMatched: results.length,
    processingTime: endTime - startTime,
    userState: req.session.state
  }
});
```


#### Alerting Configuration

```typescript
// CloudWatch Alarms
const ALARMS = [
  {
    name: 'HighErrorRate',
    metric: 'Errors',
    threshold: 5, // 5% error rate
    evaluationPeriods: 2,
    datapointsToAlarm: 2,
    comparisonOperator: 'GreaterThanThreshold',
    actions: ['SNS:OnCallTeam']
  },
  {
    name: 'HighResponseTime',
    metric: 'API/ResponseTime',
    threshold: 5000, // 5 seconds
    evaluationPeriods: 3,
    datapointsToAlarm: 2,
    comparisonOperator: 'GreaterThanThreshold',
    actions: ['SNS:OnCallTeam']
  },
  {
    name: 'LowOCRAccuracy',
    metric: 'OCR/Accuracy',
    threshold: 90, // 90% accuracy
    evaluationPeriods: 5,
    datapointsToAlarm: 3,
    comparisonOperator: 'LessThanThreshold',
    actions: ['SNS:EngineeringTeam']
  },
  {
    name: 'HighAICost',
    metric: 'AWS/BedrockCost',
    threshold: 1000, // $1000 per hour
    evaluationPeriods: 1,
    datapointsToAlarm: 1,
    comparisonOperator: 'GreaterThanThreshold',
    actions: ['SNS:FinanceTeam', 'SNS:OnCallTeam']
  }
];
```

### 11. Deployment Architecture

#### AWS Infrastructure as Code (Terraform)

```hcl
# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name        = "jansaarthi-vpc"
    Environment = var.environment
  }
}

# Subnets across 2 AZs
resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
}

resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "jansaarthi-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = "jansaarthi-app"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"
  memory                   = "2048"
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn
  
  container_definitions = jsonencode([
    {
      name      = "app"
      image     = "${aws_ecr_repository.app.repository_url}:latest"
      essential = true
      
      portMappings = [
        {
          containerPort = 3000
          protocol      = "tcp"
        }
      ]
      
      environment = [
        { name = "NODE_ENV", value = var.environment },
        { name = "AWS_REGION", value = var.aws_region }
      ]
      
      secrets = [
        {
          name      = "DATABASE_URL"
          valueFrom = aws_secretsmanager_secret.db_url.arn
        },
        {
          name      = "JWT_SECRET"
          valueFrom = aws_secretsmanager_secret.jwt_secret.arn
        }
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/jansaarthi"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "app"
        }
      }
    }
  ])
}
```


#### Auto-Scaling Configuration

```hcl
# Auto-scaling target
resource "aws_appautoscaling_target" "ecs" {
  max_capacity       = 10
  min_capacity       = 2
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.app.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

# CPU-based scaling
resource "aws_appautoscaling_policy" "cpu" {
  name               = "cpu-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs.service_namespace
  
  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = 70.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}

# Memory-based scaling
resource "aws_appautoscaling_policy" "memory" {
  name               = "memory-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs.service_namespace
  
  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }
    target_value       = 80.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}
```


#### RDS Configuration

```hcl
# RDS PostgreSQL with Multi-AZ
resource "aws_db_instance" "main" {
  identifier             = "jansaarthi-db"
  engine                 = "postgres"
  engine_version         = "15.4"
  instance_class         = "db.t3.medium"
  allocated_storage      = 100
  max_allocated_storage  = 500
  storage_encrypted      = true
  kms_key_id             = aws_kms_key.rds.arn
  
  db_name  = "jansaarthi"
  username = "admin"
  password = random_password.db_password.result
  
  multi_az               = true
  publicly_accessible    = false
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "mon:04:00-mon:05:00"
  
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  
  deletion_protection = true
  skip_final_snapshot = false
  final_snapshot_identifier = "jansaarthi-final-snapshot"
  
  tags = {
    Name        = "jansaarthi-db"
    Environment = var.environment
  }
}

# Read replica for query performance
resource "aws_db_instance" "replica" {
  identifier             = "jansaarthi-db-replica"
  replicate_source_db    = aws_db_instance.main.identifier
  instance_class         = "db.t3.medium"
  publicly_accessible    = false
  skip_final_snapshot    = true
  
  tags = {
    Name        = "jansaarthi-db-replica"
    Environment = var.environment
  }
}
```


### 12. CI/CD Pipeline

#### GitHub Actions Workflow

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main, staging]
  pull_request:
 

### 12. Error Handling & Resilience

#### Circuit Breaker Pattern

```typescript
class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime: number | null = null;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  constructor(
    private threshold: number = 5,
    private timeout: number = 60000,
    private resetTimeout: number = 30000
  ) {}
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime! > this.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}

// Usage with Bedrock API
const bedrockCircuitBreaker = new CircuitBreaker(5, 60000, 30000);

async function callBedrock(prompt: string) {
  return bedrockCircuitBreaker.execute(async () => {
    return await bedrock.invokeModel({ prompt });
  });
}
```


#### Retry Logic with Exponential Backoff

```typescript
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      const jitter = Math.random() * 1000;
      await sleep(delay + jitter);
      
      logger.warn(`Retry attempt ${attempt + 1}/${maxRetries}`, {
        error: error.message,
        nextRetryIn: delay + jitter
      });
    }
  }
}
```

#### Graceful Degradation

```typescript
class AIService {
  async simplifyContent(content: string): Promise<string> {
    try {
      // Try primary AI service
      return await this.bedrockSimplify(content);
    } catch (error) {
      logger.error('Bedrock simplification failed', { error });
      
      try {
        // Fallback to cached version if available
        const cached = await this.getCachedSimplification(content);
        if (cached) {
          logger.info('Using cached simplification');
          return cached;
        }
      } catch (cacheError) {
        logger.error('Cache lookup failed', { error: cacheError });
      }
      
      // Final fallback: return original content with warning
      logger.warn('Returning original content due to AI service failure');
      return `[AI simplification temporarily unavailable]\n\n${content}`;
    }
  }
}
```


### 13. Performance Optimization

#### Database Query Optimization

```typescript
// Use database indexes effectively
const INDEXES = [
  'CREATE INDEX idx_schemes_category ON schemes(category)',
  'CREATE INDEX idx_schemes_status_deadline ON schemes(status, deadline)',
  'CREATE INDEX idx_schemes_geographic ON schemes(geographic_scope, target_states)',
  'CREATE INDEX idx_scheme_content_language ON scheme_content(scheme_id, language_code)',
  'CREATE INDEX idx_analytics_timestamp ON analytics_events(timestamp DESC)',
];

// Use connection pooling
const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Optimize queries with proper joins and projections
async function getEligibleSchemes(userProfile: UserProfile) {
  return await db.query(`
    SELECT 
      s.scheme_id,
      s.name,
      s.category,
      s.benefit_amount,
      sc.simplified_description
    FROM schemes s
    LEFT JOIN scheme_content sc 
      ON s.scheme_id = sc.scheme_id 
      AND sc.language_code = $1
    WHERE 
      s.status = 'active'
      AND (s.deadline IS NULL OR s.deadline > NOW())
      AND s.eligibility_rules @> $2::jsonb
    ORDER BY s.priority DESC, s.benefit_amount DESC
    LIMIT 50
  `, [userProfile.language, JSON.stringify(userProfile)]);
}
```


#### API Response Compression

```typescript
import compression from 'compression';

app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Compression level (0-9)
  threshold: 1024 // Only compress responses > 1KB
}));
```

#### Image Optimization

```typescript
// Client-side image compression before upload
async function compressImage(file: File): Promise<Blob> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg',
    quality: 0.85
  };
  
  return await imageCompression(file, options);
}

// Server-side validation
function validateImageSize(file: Express.Multer.File): boolean {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  return file.size <= MAX_SIZE;
}
```

### 14. Testing Strategy

#### Unit Testing

```typescript
// Example: Eligibility matcher unit test
describe('EligibilityMatcher', () => {
  let matcher: EligibilityMatcher;
  
  beforeEach(() => {
    matcher = new EligibilityMatcher();
  });
  
  test('should match eligible scheme based on age criteria', () => {
    const userProfile = {
      age: 65,
      income: 50000,
      state: 'MH'
    };
    
    const scheme = {
      schemeId: 'SC-001',
      rules: [
        { field: 'age', operator: 'gte', value: 60, logic: 'AND' }
      ]
    };
    
    const result = matcher.match(userProfile, [scheme]);
    
    expect(result).toHaveLength(1);
    expect(result[0].isEligible).toBe(true);
    expect(result[0].schemeId).toBe('SC-001');
  });
  
  test('should not match ineligible scheme', () => {
    const userProfile = { age: 55, income: 50000, state: 'MH' };
    const scheme = {
      schemeId: 'SC-001',
      rules: [
        { field: 'age', operator: 'gte', value: 60, logic: 'AND' }
      ]
    };
    
    const result = matcher.match(userProfile, [scheme]);
    expect(result).toHaveLength(0);
  });
});
```


#### Integration Testing

```typescript
// Example: API integration test
describe('POST /api/v1/eligibility/match', () => {
  test('should return eligible 

### 15. Data Flow Diagrams

#### User Journey: Aadhaar Upload to Scheme Discovery

```
1. User uploads Aadhaar card image
   ↓
2. Frontend validates file (size, format)
   ↓
3. Display consent dialog
   ↓
4. User accepts consent
   ↓
5. Upload to S3 with temporary lifecycle
   ↓
6. Trigger Textract OCR job
   ↓
7. Extract and parse Aadhaar fields
   ↓
8. Validate extracted data (confidence scores)
   ↓
9. Display extracted profile for user review
   ↓
10. User confirms or edits profile
   ↓
11. Run eligibility matching engine
   ↓
12. Query schemes database with filters
   ↓
13. Calculate relevance scores
   ↓
14. Check Redis cache for AI-simplified content
   ↓
15. If not cached, call Bedrock for simplification
   ↓
16. Validate AI output quality
   ↓
17. Cache AI-generated content
   ↓
18. Return eligible schemes to frontend
   ↓
19. Display results with filtering options
   ↓
20. User selects scheme for details
   ↓
21. Fetch detailed scheme info + AI explanation
   ↓
22. Display application guidance
   ↓
23. Log analytics event (anonymized)
   ↓
24. Schedule data deletion (24 hours)
```


### 16. API Specifications

#### REST API Endpoints

**Identity Service**

```
POST /api/v1/identity/upload
Request:
  - Content-Type: multipart/form-data
  - Body: { file: File, consent: boolean }
Response: 
  - 200: { uploadId: string, status: 'processing' }
  - 400: { error: 'Invalid file format' }
  - 413: { error: 'File too large' }

GET /api/v1/identity/profile/:uploadId
Response:
  - 200: { 
      sessionId: string,
      profile: {
        name: string,
        age: number,
        gender: string,
        state: string,
        district: string
      },
      confidence: number
    }
  - 404: { error: 'Upload not found' }

DELETE /api/v1/identity/data/:sessionId
Response:
  - 200: { message: 'Data deleted successfully' }
  - 404: { error: 'Session not found' }
```

**Eligibility Service**

```
POST /api/v1/eligibility/match
Request:
  - Headers: { Authorization: 'Bearer <token>' }
  - Body: {
      profile: UserProfile,
      filters?: { categories?: string[], states?: string[] }
    }
Response:
  - 200: {
      schemes: Array<{
        schemeId: string,
        name: string,
        category: string,
        benefitAmount: number,
        relevanceScore: number,
        matchedCriteria: string[]
      }>,
      totalCount: number
    }
```


**AI Service**

```
POST /api/v1/ai/simplify
Request:
  - Body: {
      content: string,
      targetReadingLevel: '6-8' | '9-12',
      language: string
    }
Response:
  - 200: {
      simplified: string,
      originalLength: number,
      simplifiedLength: number,
      readabilityScore: number,
      cached: boolean
    }
  - 503: { error: 'AI service temporarily unavailable' }

POST /api/v1/ai/translate
Request:
  - Body: {
      content: string,
      sourceLanguage: string,
      targetLanguage: string
    }
Response:
  - 200: {
      translated: string,
      confidence: number,
      cached: boolean
    }
```

**Scheme Service**

```
GET /api/v1/schemes/:schemeId
Query params: ?language=hi
Response:
  - 200: {
      scheme: {
        schemeId: string,
        name: string,
        category: string,
        description: string,
        simplifiedDescription: string,
        eligibilityCriteria: string[],
        benefits: string,
        requiredDocuments: string[],
        applicationProcess: string[],
        officialUrl: string,
        deadline: string | null
      }
    }
  - 404: { error: 'Scheme not found' }

GET /api/v1/schemes/search
Query params: ?q=pension&category=social_security&state=MH&page=1&limit=20
Response:
  - 200: {
      schemes: Array<Scheme>,
      pagination: {
        page: number,
        limit: number,
        totalPages: number,
        totalCount: number
      }
    }
```


### 17. Mobile Responsiveness

#### Breakpoints

```css
/* Mobile-first breakpoints */
$breakpoints: (
  'xs': 0,      /* 0-599px: Small phones */
  'sm': 600px,  /* 600-959px: Large phones, small tablets */
  'md': 960px,  /* 960-1279px: Tablets */
  'lg': 1280px, /* 1280-1919px: Desktops */
  'xl': 1920px  /* 1920px+: Large desktops */
);

/* Touch target sizes */
$min-touch-target: 44px; /* WCAG 2.1 AA minimum */
$recommended-touch-target: 48px;

/* Font scaling */
$base-font-size: 16px;
$mobile-font-scale: 0.875; /* 14px on mobile */
$desktop-font-scale: 1; /* 16px on desktop */
```

#### Progressive Web App (PWA) Configuration

```json
{
  "name": "JanSaarthi AI",
  "short_name": "JanSaarthi",
  "description": "Discover government schemes you're eligible for",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1976d2",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```


### 18. Accessibility Implementation

#### WCAG 2.1 AA Compliance

```typescript
// Semantic HTML structure
<main role="main" aria-label="Main content">
  <section aria-labelledby="results-heading">
    <h2 id="results-heading">Your Eligible Schemes</h2>
    <div role="list" aria-label="Scheme results">
      {schemes.map(scheme => (
        <article 
          role="listitem" 
          aria-labelledby={`scheme-${scheme.id}`}
          tabIndex={0}
        >
          <h3 id={`scheme-${scheme.id}`}>{scheme.name}</h3>
          <p aria-label="Benefit amount">₹{scheme.benefitAmount}</p>
          <button 
            aria-label={`View details for ${scheme.name}`}
            onClick={() => viewDetails(scheme.id)}
          >
            View Details
          </button>
        </article>
      ))}
    </div>
  </section>
</main>

// Keyboard navigation
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
    }
    if (e.key === 'Enter' && e.target.role === 'button') {
      e.target.click();
    }
  };
  
  document.addEventListener('keydown', handleKeyPress);
  return () => document.removeEventListener('keydown', handleKeyPress);
}, []);

// Screen reader announcements
const announce = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => document.body.removeChild(announcement), 1000);
};
```


### 19. Cost Estimation

#### Monthly AWS Cost Breakdown (10,000 DAU)

```
Compute (ECS Fargate):
- 2 tasks × 1 vCPU × 2GB RAM × 730 hours = $70
- Auto-scaling (avg 4 tasks during peak) = $140
Total Compute: $210/month

Database (RDS PostgreSQL):
- db.t3.medium Multi-AZ = $120
- Storage (100GB) = $23
- Backup storage (50GB) = $5
Total Database: $148/month

Caching (ElastiCache Redis):
- cache.t3.medium = $50
Total Caching: $50/month

Storage (S3):
- Temporary image storage (avg 1000 images/day × 2MB × 1 day) = $0.05
- Lifecycle deletion (automated) = $0
Total Storage: $0.05/month

AI Services:
- Amazon Bedrock (Claude Sonnet):
  - Simplification: 5000 requests/day × 2000 tokens × $0.003/1K = $90
  - Translation: 3000 requests/day × 1500 tokens × $0.003/1K = $40.50
- Amazon Textract:
  - OCR processing: 1000 pages/day × $0.0015 = $45
Total AI Services: $175.50/month

Content Delivery (CloudFront):
- Data transfer: 500GB/month = $42.50
- Requests: 10M requests = $10
Total CDN: $52.50/month

Load Balancing (ALB):
- ALB hours: 730 hours = $18.25
- LCU usage = $8
Total Load Balancing: $26.25/month

Monitoring & Logging:
- CloudWatch logs (10GB) = $5
- CloudWatch metrics = $3
- CloudWatch alarms (10 alarms) = $1
Total Monitoring: $9/month

Security (WAF):
- Web ACL = $5
- Rules (5 rules) = $5
Total Security: $10/month

TOTAL ESTIMATED COST: $681.30/month
Cost per active user: $0.068/month
```


### 20. Implementation Phases

#### Phase 1: MVP (Weeks 1-4)

**Week 1-2: Infrastructure & Backend Core**
- Set up AWS infrastructure (VPC, ECS, RDS, S3)
- Implement Identity Service with Textract integration
- Build Eligibility Service with rule engine
- Create database schema and seed initial schemes (50 schemes)
- Set up CI/CD pipeline

**Week 3-4: AI Integration & Frontend**
- Integrate Amazon Bedrock for simplification
- Implement caching layer (Redis)
- Build React frontend with core pages
- Implement Aadhaar upload flow
- Create scheme results and detail pages
- Basic i18n support (English, Hindi)

**Deliverables**:
- Working platform with 50 schemes
- Aadhaar OCR extraction
- Basic eligibility matching
- AI simplification (English, Hindi)
- Mobile-responsive UI

#### Phase 2: Scale & Multilingual (Weeks 5-8)

**Week 5-6: Language Expansion**
- Add 10 additional regional languages
- Implement translation service
- Validate translations with native speakers
- Expand scheme database to 150 schemes
- Optimize AI prompts for better quality

**Week 7-8: Performance & Security**
- Implement comprehensive caching strategy
- Add rate limiting and WAF rules
- Set up monitoring and alerting
- Performance optimization (query tuning, CDN)
- Security audit and penetration testing

**Deliverables**:
- 12 language support
- 150 schemes in database
- Production-ready security
- Performance optimizations
- Monitoring dashboard


#### Phase 3: Enhanced Features (Weeks 9-12)

**Week 9-10: Advanced Features**
- Scheme comparison functionality
- Advanced filtering and search
- Application guidance with checklists
- Analytics dashboard
- User feedback mechanism

**Week 11-12: Testing & Launch Prep**
- Comprehensive testing (unit, integration, E2E)
- Load testing and performance validation
- Accessibility audit (WCAG 2.1 AA)
- User acceptance testing with target personas
- Documentation and training materials

**Deliverables**:
- Feature-complete platform
- Comprehensive test coverage
- Launch-ready documentation
- User guides in multiple languages

### 21. Technical Decisions & Rationale

#### Why Node.js/Express?
- JavaScript/TypeScript across full stack reduces context switching
- Large ecosystem of libraries for AWS integration
- Excellent async I/O performance for API services
- Strong community support and tooling

#### Why React?
- Component-based architecture for reusable UI elements
- Large ecosystem for i18n, forms, and state management
- Excellent mobile responsiveness with Material-UI
- Strong accessibility support

#### Why PostgreSQL?
- JSONB support for flexible eligibility rules storage
- Strong ACID compliance for data integrity
- Excellent query performance with proper indexing
- Multi-AZ support for high availability

#### Why Amazon Bedrock over OpenAI?
- Native AWS integration with existing infrastructure
- Data residency compliance (India)
- Multiple model options (Claude, Titan)
- Enterprise-grade security and compliance
- Cost-effective for high-volume usage


#### Why ECS Fargate over EC2?
- Serverless container management reduces operational ov

### 22. Open Questions & Future Considerations

**Technical Questions**:
1. Should we implement GraphQL API alongside REST for more flexible querying?
2. What's the optimal cache invalidation strategy for scheme updates?
3. Should we pre-generate AI content for all schemes in all languages?
4. How to handle scheme eligibility rule conflicts or ambiguities?

**Product Questions**:
1. Should users be able to save schemes for later without creating an account?
2. How to handle schemes with complex eligibility (income verification, caste certificates)?
3. Should we provide application status tracking if government APIs become available?
4. What's the user education strategy for first-time digital users?

**Scalability Considerations**:
1. At what user volume should we consider microservices decomposition?
2. How to handle viral growth scenarios (10x traffic spike)?
3. Should we implement read replicas for database scaling?
4. What's the strategy for multi-region deployment?

**AI Quality Improvements**:
1. How to continuously improve AI prompt quality based on user feedback?
2. Should we implement A/B testing for different simplification approaches?
3. How to detect and prevent AI bias in content generation?
4. What's the human review process for AI-generated content?

---

**Document Version**: 1.0  
**Last Updated**: February 15, 2026  
**Document Owner**: Engineering Team  
**Review Cycle**: Bi-weekly during development, monthly post-launch

---

## Appendix: Technology Stack Summary

**Frontend**:
- React 18 + TypeScript
- Material-UI (MUI)
- Redux Toolkit + React Query
- i18next
- Vite

**Backend**:
- Node.js 20 + Express
- TypeScript
- Prisma ORM
- Winston (logging)
- Zod (validation)

**AI & ML**:
- Amazon Bedrock (Claude 3 Sonnet)
- Amazon Textract

**Data Storage**:
- Amazon RDS PostgreSQL 15
- Amazon ElastiCache Redis
- Amazon S3

**Infrastructure**:
- AWS ECS Fargate
- Application Load Balancer
- Amazon CloudFront
- AWS WAF
- AWS CloudWatch

**DevOps**:
- Terraform (IaC)
- GitHub Actions (CI/CD)
- Docker
- AWS CodePipeline

**Security**:
- AWS KMS
- AWS Secrets Manager
- AWS Certificate Manager
- TLS 1.3
