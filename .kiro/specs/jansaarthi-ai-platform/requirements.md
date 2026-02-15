# JanSaarthi AI – Product Requirements Document

## Executive Summary

JanSaarthi AI is a cloud-native civic technology platform that leverages artificial intelligence to democratize access to government welfare schemes across India. The platform addresses a critical gap in public service delivery by combining Aadhaar-based identity verification, rule-based eligibility matching, and AI-powered content simplification to help underserved communities discover and apply for benefits they are entitled to receive.

The system uses Amazon Bedrock for natural language processing tasks including document simplification, contextual explanation generation, and multilingual translation, while rule-based logic handles deterministic eligibility filtering. Deployed on AWS infrastructure, the platform is designed for national-scale operation with privacy-first architecture and mobile-first accessibility.

## Problem Statement

India operates over 950 central and state welfare schemes targeting various demographic segments. Despite this extensive social safety net, benefit uptake remains critically low among intended beneficiaries due to systemic barriers:


- **Language Complexity**: Government policy documents use legal and bureaucratic language inaccessible to citizens with limited formal education
- **Information Fragmentation**: Schemes are distributed across multiple portals with inconsistent interfaces and no unified discovery mechanism
- **Lack of Personalization**: Citizens cannot easily determine which schemes apply to their specific circumstances without manual research
- **Language Barriers**: Most official documentation is available only in English or Hindi, excluding regional language speakers
- **Digital Literacy Gap**: Complex application processes assume technical proficiency that many rural and elderly citizens lack
- **Intermediary Dependency**: Citizens rely on middlemen who may charge fees or provide incomplete information

These barriers result in eligible citizens missing critical benefits for healthcare, education, housing, and livelihood support, perpetuating cycles of poverty and inequality.

## Objectives

### Technical Objectives


- Implement consent-based Aadhaar verification system with minimal data retention
- Build deterministic rule-based eligibility engine capable of processing multi-criteria scheme requirements
- Integrate Amazon Bedrock for AI-powered document simplification and multilingual content generation
- Deploy scalable, secure cloud infrastructure on AWS with 99.5% uptime target
- Achieve sub-3-second response time for eligibility matching and sub-5-second response for AI-generated content
- Support 10+ Indian regional languages with contextually accurate translations
- Design mobile-first responsive interface accessible on low-bandwidth networks

### Social Impact Objectives

- Increase welfare scheme awareness among underserved communities by 40% within first year
- Reduce time-to-discovery for eligible schemes from weeks to minutes
- Eliminate dependency on intermediaries for scheme information access
- Enable citizens with limited digital literacy to independently navigate government benefits
- Bridge language divide in civic service access across urban and rural populations
- Provide transparent, auditable eligibility determination process


## Scope

### In Scope

- Aadhaar card upload and OCR-based data extraction for identity verification
- Consent-based temporary data processing with automatic deletion post-session
- Rule-based eligibility matching engine supporting age, income, caste, gender, location, and occupation criteria
- AI-powered simplification of government scheme documents using Amazon Bedrock
- Multilingual translation of scheme information into 10+ regional Indian languages
- Contextual explanation generation for eligibility criteria and application requirements
- Step-by-step application guidance with document checklists
- Mobile-responsive web interface optimized for low-bandwidth connectivity
- AWS cloud deployment with auto-scaling, load balancing, and data encryption
- Analytics dashboard for scheme discovery patterns and user engagement metrics


### Out of Scope

- Direct integration with government application portals (platform provides guidance only)
- Aadhaar authentication via UIDAI API (uses OCR-based extraction instead)
- Permanent storage of Aadhaar numbers or biometric data
- Automated application submission on behalf of users
- Real-time scheme database updates (requires periodic manual updates)
- Offline mobile application (web-based only in initial release)
- Payment processing or financial transactions
- Legal advice or guarantee of scheme approval
- Support for non-Indian identity documents

## Target Users & Personas

### Persona 1: Rural Agricultural Worker


- **Name**: Lakshmi, 42 years old
- **Location**: Rural Maharashtra
- **Education**: Primary school
- **Language**: Marathi (limited Hindi)
- **Digital Literacy**: Basic smartphone usage
- **Income**: ₹8,000/month household income
- **Pain Points**: Unaware of agricultural subsidies, cannot read English documents, relies on local agents
- **Goals**: Find schemes for crop insurance, farm equipment subsidies, and children's education

### Persona 2: Urban Daily Wage Worker

- **Name**: Rajesh, 35 years old
- **Location**: Delhi NCR
- **Education**: 10th grade
- **Language**: Hindi (some English)
- **Digital Literacy**: Moderate smartphone proficiency
- **Income**: ₹12,000/month
- **Pain Points**: Missed housing scheme deadlines, confused by application requirements
- **Goals**: Access affordable housing schemes, health insurance, skill development programs


### Persona 3: Elderly Pensioner

- **Name**: Suresh Kumar, 68 years old
- **Location**: Semi-urban Tamil Nadu
- **Education**: Graduate
- **Language**: Tamil, English
- **Digital Literacy**: Limited (requires assistance)
- **Income**: ₹6,000/month pension
- **Pain Points**: Difficulty navigating multiple portals, vision impairment, complex forms
- **Goals**: Find senior citizen benefits, healthcare schemes, pension enhancements

### Persona 4: Community Service Worker

- **Name**: Priya, 28 years old
- **Location**: NGO in Uttar Pradesh
- **Education**: Bachelor's degree in Social Work
- **Language**: Hindi, English
- **Digital Literacy**: High
- **Income**: Salaried
- **Pain Points**: Needs efficient tool to help multiple beneficiaries, time-consuming manual research
- **Goals**: Quickly identify relevant schemes for diverse community members


## User Stories

### Identity Verification

- **US-1**: As a citizen, I want to upload my Aadhaar card image, so that the system can extract my demographic information without manual data entry
- **US-2**: As a privacy-conscious user, I want explicit consent prompts before my data is processed, so that I understand how my information will be used
- **US-3**: As a user, I want my Aadhaar data to be automatically deleted after my session, so that my sensitive information is not permanently stored

### Scheme Discovery

- **US-4**: As a rural worker, I want to see schemes I'm eligible for based on my profile, so that I don't waste time reviewing irrelevant programs
- **US-5**: As a user with limited education, I want scheme descriptions in simple language, so that I can understand complex government policies
- **US-6**: As a regional language speaker, I want scheme information in my native language, so that I can fully comprehend the benefits and requirements


### Application Guidance

- **US-7**: As a first-time applicant, I want step-by-step instructions for applying to schemes, so that I don't make mistakes or miss required documents
- **US-8**: As a user, I want to see a checklist of required documents, so that I can prepare everything before starting the application
- **US-9**: As a citizen, I want to understand why I'm eligible or ineligible for specific schemes, so that I can make informed decisions

### Accessibility

- **US-10**: As a user with low bandwidth, I want the platform to load quickly on 2G/3G networks, so that I can access it from rural areas
- **US-11**: As an elderly user, I want large text and simple navigation, so that I can use the platform without assistance
- **US-12**: As a community worker, I want to help multiple people efficiently, so that I can serve more beneficiaries in limited time


## Functional Requirements

### FR-1: Aadhaar Verification Flow

#### FR-1.1: Document Upload
- System shall accept image uploads in JPEG, PNG, and PDF formats up to 5MB
- System shall support both front and back Aadhaar card images
- System shall provide real-time upload progress indication
- System shall validate image quality and reject blurry or unreadable uploads

#### FR-1.2: OCR Data Extraction
- System shall extract name, date of birth, gender, and address from Aadhaar card images
- System shall achieve minimum 95% accuracy for text extraction
- System shall handle multiple Aadhaar card formats and layouts
- System shall mask Aadhaar number displaying only last 4 digits

#### FR-1.3: Consent Management
- System shall display explicit consent dialog explaining data usage before processing
- System shall require affirmative user action to proceed with data extraction
- System shall provide option to cancel and delete uploaded images at any stage
- System shall log consent timestamps for audit purposes


#### FR-1.4: Data Retention
- System shall automatically delete uploaded images and extracted data within 24 hours of session end
- System shall not store Aadhaar numbers in any database or log files
- System shall retain only anonymized analytics data (no PII)
- System shall provide user-initiated immediate data deletion option

### FR-2: Eligibility Engine

#### FR-2.1: Rule-Based Matching
- System shall evaluate eligibility against age, income, caste category, gender, state/district, occupation, and disability status
- System shall support complex multi-criteria rules with AND/OR logic operators
- System shall process eligibility checks for 100+ schemes within 3 seconds
- System shall rank eligible schemes by relevance score based on profile match strength

#### FR-2.2: Scheme Database
- System shall maintain structured database of central and state government schemes
- System shall store scheme metadata including eligibility criteria, benefits, application process, and official URLs
- System shall support scheme versioning to track policy changes over time
- System shall flag schemes with approaching deadlines or limited availability


#### FR-2.3: Eligibility Explanation
- System shall provide clear explanation for why user qualifies for each matched scheme
- System shall explain reasons for ineligibility when user doesn't match criteria
- System shall highlight which specific criteria user meets or fails
- System shall suggest alternative schemes when primary options are unavailable

### FR-3: AI Simplification Layer

#### FR-3.1: Document Simplification
- System shall use Amazon Bedrock to convert complex policy language into plain language summaries
- System shall generate simplified explanations at 6th-8th grade reading level
- System shall preserve factual accuracy while reducing complexity
- System shall highlight key benefits, eligibility requirements, and application steps
- System shall process simplification requests within 5 seconds

#### FR-3.2: Contextual Explanation Generation
- System shall generate personalized explanations based on user's specific profile
- System shall provide examples relevant to user's occupation and location
- System shall explain technical terms and bureaucratic jargon in simple language
- System shall adapt explanation depth based on user's education level (if available)


#### FR-3.3: Quality Assurance
- System shall implement content validation to prevent AI hallucinations or factual errors
- System shall maintain audit trail of original vs simplified content for verification
- System shall flag AI-generated content that deviates significantly from source material
- System shall provide fallback to original text if simplification fails quality checks

### FR-4: Multilingual Support

#### FR-4.1: Language Translation
- System shall support Hindi, English, Bengali, Telugu, Marathi, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam, and Punjabi
- System shall use Amazon Bedrock for contextually accurate translation of scheme content
- System shall translate UI elements, scheme descriptions, and application guidance
- System shall maintain consistent terminology across languages for legal/technical terms

#### FR-4.2: Language Selection
- System shall auto-detect user's preferred language from browser settings
- System shall provide prominent language selector accessible from all pages
- System shall persist language preference across session
- System shall support dynamic language switching without page reload


#### FR-4.3: Cultural Localization
- System shall adapt examples and explanations to regional context
- System shall use culturally appropriate terminology and references
- System shall format dates, currency, and numbers according to regional conventions
- System shall validate translations with native speakers before deployment

### FR-5: Scheme Display & Guidance

#### FR-5.1: Results Presentation
- System shall display eligible schemes in card-based layout with key information visible
- System shall show scheme name, brief description, benefit amount, and application deadline
- System shall provide filtering options by category (health, education, housing, etc.)
- System shall support sorting by relevance, deadline, or benefit amount

#### FR-5.2: Detailed Scheme View
- System shall provide comprehensive scheme page with simplified description, eligibility criteria, benefits, required documents, and application process
- System shall include official government portal links for application submission
- System shall display scheme validity period and last updated date
- System shall show estimated processing time and approval timeline


#### FR-5.3: Application Guidance
- System shall provide step-by-step application instructions with numbered checklist
- System shall list all required documents with format specifications
- System shall highlight common mistakes and tips for successful application
- System shall provide contact information for scheme-specific helplines

#### FR-5.4: Scheme Comparison
- System shall allow users to compare up to 3 schemes side-by-side
- System shall highlight differences in eligibility, benefits, and requirements
- System shall provide recommendation based on user's profile fit
- System shall enable saving schemes for later review

## Non-Functional Requirements

### NFR-1: Performance

- System shall return eligibility results within 3 seconds for 95% of requests
- System shall generate AI-simplified content within 5 seconds for 90% of requests
- System shall support page load time under 2 seconds on 3G networks
- System shall handle OCR processing within 4 seconds for standard quality images
- System shall cache frequently accessed scheme data to reduce latency


### NFR-2: Scalability

- System shall support 10,000 concurrent users without performance degradation
- System shall scale horizontally to handle 100,000+ daily active users
- System shall implement auto-scaling based on CPU and memory utilization thresholds
- System shall use CDN for static content delivery to reduce origin server load
- System shall partition database to support growth to 1 million+ scheme queries per day

### NFR-3: Availability

- System shall maintain 99.5% uptime excluding planned maintenance windows
- System shall implement health checks and automatic failover for critical services
- System shall deploy across multiple AWS availability zones for redundancy
- System shall complete planned maintenance within 2-hour windows during off-peak hours
- System shall provide graceful degradation if AI services are temporarily unavailable

### NFR-4: Security

- System shall encrypt all data in transit using TLS 1.3
- System shall encrypt sensitive data at rest using AES-256 encryption
- System shall implement rate limiting to prevent abuse (100 requests per IP per hour)
- System shall sanitize all user inputs to prevent injection attacks
- System shall conduct regular security audits and penetration testing
- System shall comply with IT Act 2000 and Aadhaar Act 2016 data protection requirements
- System shall implement role-based access control for administrative functions


### NFR-5: Usability

- System shall achieve task completion rate of 80% for first-time users without assistance
- System shall support accessibility standards (WCAG 2.1 Level AA minimum)
- System shall provide clear error messages with actionable recovery steps
- System shall implement progressive disclosure to avoid overwhelming users with information
- System shall use consistent visual design language across all pages
- System shall support keyboard navigation and screen reader compatibility
- System shall optimize for touch interfaces with minimum 44x44px tap targets

## AI Requirements

### AIR-1: Why AI is Necessary

AI is essential for JanSaarthi AI because:

**Language Simplification Cannot Be Rule-Based**: Government policy documents contain complex legal language, nested clauses, and bureaucratic terminology that varies significantly across schemes. Rule-based text simplification would require manually crafting thousands of transformation rules and would fail to maintain semantic coherence. Amazon Bedrock's large language models understand context, can rephrase complex sentences while preserving meaning, and adapt explanations to different reading levels—capabilities impossible with deterministic algorithms.


**Contextual Translation Requires Understanding**: Direct word-for-word translation of government schemes produces incomprehensible or misleading content in regional languages. AI models trained on multilingual corpora understand cultural context, idiomatic expressions, and domain-specific terminology. They can translate "Below Poverty Line" to culturally appropriate equivalents in Tamil or Bengali while maintaining legal precision—something dictionary-based translation cannot achieve.

**Personalized Explanation Generation**: Users have diverse educational backgrounds, occupations, and contexts. Generating explanations that resonate with a farmer in Punjab versus an urban worker in Kerala requires understanding user context and adapting communication style. AI can generate examples relevant to user's occupation ("As a farmer, this scheme provides ₹6,000 annually for crop insurance") dynamically, which would require pre-writing thousands of variations manually.

**Handling Scheme Variability**: Government schemes have inconsistent documentation formats, varying levels of detail, and frequent policy updates. AI can extract key information from unstructured documents, identify eligibility criteria even when not explicitly listed, and adapt to new scheme formats without reprogramming—providing flexibility that rigid parsing rules cannot match.


### AIR-2: AI vs Rule-Based Distinction

The platform employs a hybrid architecture that uses each approach for its strengths:

**Rule-Based Components** (Deterministic, Auditable):
- **Eligibility Matching**: Age, income, caste, gender, location criteria are evaluated using deterministic logic. Example: "IF age >= 60 AND income < 100000 THEN eligible for Senior Citizen Pension." This ensures consistent, explainable, and legally defensible eligibility decisions.
- **Data Validation**: Aadhaar number format validation, image size checks, and input sanitization use rule-based validation for reliability.
- **Workflow Logic**: User navigation flow, session management, and data retention policies follow deterministic state machines.

**AI-Powered Components** (Adaptive, Contextual):
- **Content Simplification**: Amazon Bedrock transforms "The beneficiary must be a domicile of the state as per Section 3(a) of the Domicile Act 1976" into "You must have lived in this state and have proof of residence."
- **Multilingual Translation**: Bedrock translates scheme content while preserving legal meaning and adapting to regional linguistic patterns.
- **Contextual Explanation**: Bedrock generates personalized examples: "As a farmer in Maharashtra, you can get ₹6,000 per year under PM-KISAN if you own less than 2 hectares of land."


**Why This Separation Matters**:
- Eligibility decisions must be auditable and legally defensible—AI's probabilistic nature is inappropriate here
- Content presentation benefits from AI's ability to adapt to user context and language nuances
- Hybrid approach provides transparency (users can verify eligibility logic) while delivering superior user experience (AI-enhanced content)

### AIR-3: AI Model Requirements

- System shall use Amazon Bedrock with Claude or Titan models for text generation tasks
- System shall implement prompt engineering best practices to ensure consistent output quality
- System shall set temperature parameter to 0.3-0.5 for factual content generation
- System shall implement output validation to detect and reject hallucinated content
- System shall maintain prompt templates versioned in source control
- System shall log AI model responses for quality monitoring and improvement
- System shall implement fallback to cached or template-based content if AI service fails

## Cloud & Deployment Requirements

### CDR-1: AWS Infrastructure


#### CDR-1.1: Compute Services
- System shall deploy application on AWS ECS (Elastic Container Service) with Fargate for serverless container orchestration
- System shall use Application Load Balancer for traffic distribution across containers
- System shall implement auto-scaling policies based on CPU (>70%) and memory (>80%) thresholds
- System shall deploy across minimum 2 availability zones for high availability

#### CDR-1.2: AI Services
- System shall integrate Amazon Bedrock for LLM-powered text generation
- System shall use Amazon Textract for OCR processing of Aadhaar card images
- System shall implement request throttling and retry logic for AI service calls
- System shall monitor AI service costs and implement budget alerts

#### CDR-1.3: Data Storage
- System shall use Amazon RDS PostgreSQL for structured scheme data with Multi-AZ deployment
- System shall use Amazon S3 for temporary image storage with lifecycle policies for automatic deletion
- System shall implement database read replicas for query performance optimization
- System shall use Amazon ElastiCache Redis for session management and caching


#### CDR-1.4: Content Delivery
- System shall use Amazon CloudFront CDN for static asset delivery
- System shall configure edge locations in India for reduced latency
- System shall implement cache invalidation strategy for scheme data updates
- System shall compress assets (gzip/brotli) to optimize bandwidth usage

#### CDR-1.5: Security & Monitoring
- System shall use AWS WAF (Web Application Firewall) for DDoS protection and threat mitigation
- System shall implement AWS CloudWatch for application and infrastructure monitoring
- System shall use AWS CloudTrail for audit logging of all API calls
- System shall configure AWS Secrets Manager for secure credential storage
- System shall implement AWS KMS for encryption key management

### CDR-2: Development Workflow

- System shall use Amazon Q Developer for AI-assisted code generation and documentation
- System shall implement CI/CD pipeline using AWS CodePipeline and CodeBuild
- System shall maintain separate environments for development, staging, and production
- System shall use Infrastructure as Code (Terraform or AWS CDK) for reproducible deployments
- System shall implement automated testing in CI pipeline before deployment


### CDR-3: Cost Optimization

- System shall implement AWS Cost Explorer for spend monitoring and forecasting
- System shall use spot instances for non-critical batch processing workloads
- System shall configure S3 lifecycle policies to transition old data to cheaper storage tiers
- System shall implement resource tagging for cost allocation and tracking
- System shall set up billing alerts for budget threshold breaches

## Data Privacy & Responsible Design Requirements

### DPR-1: Privacy-First Architecture

- System shall process Aadhaar data in-memory without persistent database storage
- System shall implement automatic data deletion within 24 hours of session end
- System shall mask Aadhaar numbers displaying only last 4 digits in UI
- System shall not log Aadhaar numbers in application logs or error traces
- System shall provide user-initiated immediate data deletion option
- System shall anonymize analytics data removing all personally identifiable information
- System shall implement data minimization collecting only essential information


### DPR-2: Consent & Transparency

- System shall display clear privacy policy in simple language before data collection
- System shall require explicit consent with checkbox confirmation before processing Aadhaar data
- System shall explain what data is collected, how it's used, and when it's deleted
- System shall provide option to use platform without Aadhaar upload (manual data entry)
- System shall display data processing status and deletion confirmation to users
- System shall maintain audit logs of consent actions for compliance verification

### DPR-3: AI Transparency & Fairness

- System shall clearly label AI-generated content to distinguish from official government text
- System shall provide access to original scheme documents alongside simplified versions
- System shall implement bias testing to ensure fair treatment across demographic groups
- System shall monitor AI outputs for discriminatory language or exclusionary patterns
- System shall provide feedback mechanism for users to report inaccurate AI-generated content
- System shall maintain human review process for AI content quality assurance


### DPR-4: Accessibility & Inclusion

- System shall support screen readers and keyboard navigation for visually impaired users
- System shall provide high contrast mode for users with vision impairments
- System shall use simple language (6th-8th grade reading level) for all user-facing content
- System shall design for low-bandwidth environments (2G/3G networks)
- System shall support multiple input methods (text, voice, image upload)
- System shall avoid assumptions about user's technical literacy or device capabilities

### DPR-5: Legal Compliance

- System shall comply with IT Act 2000 data protection provisions
- System shall comply with Aadhaar Act 2016 Section 8 (identity information usage restrictions)
- System shall not use Aadhaar for authentication purposes (OCR extraction only)
- System shall implement data localization storing all data within India
- System shall maintain compliance documentation for regulatory audits
- System shall establish data breach notification procedures

## Data Requirements

### DR-1: Scheme Database Schema


System shall maintain scheme records with following attributes:
- Scheme ID, name, category (health, education, housing, agriculture, etc.)
- Administering authority (central/state government, ministry)
- Eligibility criteria (structured as rule conditions)
- Benefit description and monetary value
- Required documents list
- Application process steps
- Official portal URL
- Validity period and deadlines
- Geographic scope (national, state-specific, district-specific)
- Target demographic tags
- Last updated timestamp
- Scheme status (active, expired, suspended)

### DR-2: User Profile Data

System shall extract and temporarily store:
- Name, date of birth, gender
- Address (state, district, pincode)
- Aadhaar last 4 digits (for session identification only)
- Derived attributes: age, location category (urban/rural)

System shall NOT store:
- Full Aadhaar number
- Biometric data
- Income details (user-provided for matching only, not persisted)
- Caste/category information (used for matching, not stored)


### DR-3: Analytics Data

System shall collect anonymized metrics:
- Daily/monthly active users (no PII)
- Scheme search and view counts
- Language preference distribution
- Geographic usage patterns (state/district level only)
- Session duration and completion rates
- Error rates and performance metrics
- AI service usage and costs

### DR-4: Data Sources

- Government scheme data sourced from official portals (MyScheme.gov.in, state government websites)
- Scheme updates require manual curation and verification
- Initial database to include minimum 100 high-impact central and state schemes
- Data refresh cycle: monthly for scheme updates, weekly for deadline changes

## Assumptions

- Users have access to smartphone or computer with internet connectivity
- Users possess Aadhaar card (95%+ Indian adults have Aadhaar enrollment)
- Government scheme policies remain relatively stable between monthly updates
- AWS services (Bedrock, Textract) maintain advertised availability and performance SLAs
- Users provide consent for data processing (non-consenting users can use manual entry)
- OCR accuracy of 95%+ is achievable for standard quality Aadhaar card images
- Regional language translations can be validated by native speakers before deployment
- Users understand that platform provides guidance only, not guaranteed scheme approval


## Constraints

### Technical Constraints

- Amazon Bedrock API rate limits may restrict concurrent AI requests during peak usage
- OCR accuracy degrades with poor image quality, damaged cards, or non-standard formats
- Translation quality depends on availability of training data for regional languages
- Real-time scheme database updates not feasible due to lack of government API access
- Mobile app development deferred to post-MVP phase due to resource constraints
- Aadhaar authentication API access restricted to authorized entities (using OCR instead)

### Regulatory Constraints

- Aadhaar Act 2016 prohibits storage of Aadhaar numbers except by authorized entities
- Data localization requirements mandate all data storage within Indian territory
- Cannot guarantee scheme approval as final decisions rest with government authorities
- Cannot provide legal advice or interpretation of scheme eligibility disputes
- Must comply with evolving data protection regulations (Digital Personal Data Protection Act)

### Resource Constraints

- Initial launch budget limits scheme database to 100-150 schemes
- Manual scheme curation limits update frequency to monthly cycles
- Translation validation requires native speaker review limiting language expansion speed
- Customer support capacity limited to digital channels (no call center initially)


### Operational Constraints

- Scheme eligibility rules may have ambiguities requiring interpretation
- Government portal URLs and application processes change without notice
- User education level and digital literacy vary significantly across target audience
- Internet connectivity quality varies by geography affecting user experience
- Platform cannot verify user-provided income or caste certificate authenticity

## Acceptance Criteria

### AC-1: Aadhaar Verification
- User can upload Aadhaar card image and receive extracted data within 5 seconds
- System achieves 95% OCR accuracy on test dataset of 100 diverse Aadhaar cards
- Consent dialog is displayed before any data processing occurs
- Uploaded images and extracted data are deleted within 24 hours automatically
- User can manually delete data immediately and receive confirmation

### AC-2: Eligibility Matching
- System returns personalized scheme list within 3 seconds for user profile
- Eligibility results match manual evaluation for 95% of test cases
- System correctly handles edge cases (age boundaries, income thresholds)
- Ineligible schemes are excluded from results
- Eligibility explanation accurately reflects matching criteria


### AC-3: AI Content Simplification
- Simplified scheme descriptions are readable at 6th-8th grade level (verified by readability tools)
- AI-generated content maintains factual accuracy (100% match on key facts: eligibility, benefits, deadlines)
- Content simplification completes within 5 seconds for 90% of requests
- Hallucination detection flags content that deviates from source material
- Users can access original government text alongside simplified version

### AC-4: Multilingual Support
- Platform supports 12 Indian languages with complete UI and content translation
- Translations are contextually accurate (validated by native speakers)
- Language switching occurs without page reload
- Legal terms maintain consistency across languages
- Regional examples are culturally appropriate

### AC-5: User Experience
- First-time users complete scheme discovery task without assistance (80% success rate in usability testing)
- Platform loads within 2 seconds on 3G network
- Mobile interface is fully functional on devices with 360px width
- Platform meets WCAG 2.1 Level AA accessibility standards
- Error messages provide clear recovery instructions


### AC-6: System Performance
- System maintains 99.5% uptime over 30-day measurement period
- System handles 10,000 concurrent users without performance degradation
- Database queries return results within 500ms for 95% of requests
- Auto-scaling triggers within 2 minutes of threshold breach
- System recovers from component failure within 5 minutes

### AC-7: Security & Privacy
- All data transmission uses TLS 1.3 encryption
- Penetration testing identifies no critical or high-severity vulnerabilities
- Rate limiting prevents abuse (blocks IPs exceeding 100 requests/hour)
- Audit logs capture all data access and consent events
- Data deletion is verified through database inspection

## Success Metrics

### Impact Metrics (Primary)

- **Scheme Awareness**: 50,000+ unique users discover eligible schemes within first 6 months
- **Application Initiation**: 30% of users who find eligible schemes initiate application process
- **Geographic Reach**: Platform usage across 20+ Indian states within first year
- **Language Diversity**: 40%+ of users access platform in regional languages (non-English/Hindi)
- **Underserved Access**: 60%+ of users from rural areas or Tier 2/3 cities


### Engagement Metrics

- **User Retention**: 40% of users return within 30 days to check additional schemes
- **Session Completion**: 70% of users complete full workflow from upload to scheme discovery
- **Content Interaction**: 80% of users view AI-simplified descriptions
- **Scheme Exploration**: Average user views 5+ eligible schemes per session
- **Feedback Quality**: Net Promoter Score (NPS) of 50+ indicating user satisfaction

### Technical Metrics

- **System Availability**: 99.5% uptime measured monthly
- **Response Time**: 95th percentile response time under 3 seconds
- **AI Quality**: Less than 5% of AI-generated content flagged for inaccuracy
- **OCR Accuracy**: 95%+ successful data extraction from Aadhaar uploads
- **Error Rate**: Less than 2% of user sessions encounter errors

### Cost Efficiency Metrics

- **Cost per User**: AWS infrastructure cost under ₹5 per active user per month
- **AI Cost Optimization**: Bedrock API costs under 30% of total infrastructure spend
- **Resource Utilization**: Average CPU utilization 60-70% (efficient scaling)


## Risks & Mitigation

### Risk 1: Low OCR Accuracy on Poor Quality Images

**Impact**: High | **Probability**: Medium

**Mitigation**:
- Implement image quality validation before processing
- Provide clear guidance on capturing good quality Aadhaar photos
- Offer manual data entry fallback option
- Use Amazon Textract's confidence scores to flag uncertain extractions
- Allow users to correct extracted data before proceeding

### Risk 2: AI Hallucination or Inaccurate Simplification

**Impact**: High | **Probability**: Medium

**Mitigation**:
- Implement output validation comparing AI content against source material
- Maintain human review process for scheme simplifications before publication
- Provide access to original government text alongside simplified version
- Use lower temperature settings (0.3-0.5) for factual content generation
- Implement user feedback mechanism to report inaccuracies
- Maintain audit trail of all AI-generated content


### Risk 3: Scheme Database Becomes Outdated

**Impact**: High | **Probability**: High

**Mitigation**:
- Establish monthly scheme review and update process
- Display "last updated" timestamp on all scheme information
- Implement automated monitoring of government portal changes
- Partner with government agencies or NGOs for scheme update notifications
- Clearly communicate that users should verify details on official portals
- Prioritize high-impact schemes for more frequent updates

### Risk 4: Privacy Breach or Data Leak

**Impact**: Critical | **Probability**: Low

**Mitigation**:
- Implement defense-in-depth security architecture
- Conduct regular security audits and penetration testing
- Use AWS security services (WAF, GuardDuty, Security Hub)
- Implement comprehensive logging and monitoring
- Establish incident response plan with clear escalation procedures
- Minimize data retention (24-hour automatic deletion)
- Encrypt all data in transit and at rest
- Conduct privacy impact assessment before launch


### Risk 5: Low User Adoption in Target Demographics

**Impact**: High | **Probability**: Medium

**Mitigation**:
- Partner with NGOs, community centers, and local governments for outreach
- Conduct user testing with target demographics before launch
- Provide multilingual video tutorials and user guides
- Design for extreme simplicity and progressive disclosure
- Offer assisted access through community service workers
- Implement referral program to encourage word-of-mouth adoption
- Optimize for low-bandwidth environments common in rural areas

### Risk 6: AWS Service Outages or Cost Overruns

**Impact**: Medium | **Probability**: Low

**Mitigation**:
- Deploy across multiple availability zones for redundancy
- Implement graceful degradation (serve cached content if AI services unavailable)
- Set up comprehensive cost monitoring and budget alerts
- Implement request throttling and caching to control AI service costs
- Maintain cost optimization review process
- Design architecture for potential multi-cloud migration if needed


### Risk 7: Translation Quality Issues

**Impact**: Medium | **Probability**: Medium

**Mitigation**:
- Validate all translations with native speakers before deployment
- Implement user feedback mechanism for translation corrections
- Maintain glossary of legal/technical terms with approved translations
- Use human translators for critical content (eligibility criteria, legal terms)
- Test translations with target demographic users
- Provide English/Hindi fallback if regional translation unavailable

### Risk 8: Regulatory Compliance Changes

**Impact**: High | **Probability**: Medium

**Mitigation**:
- Monitor regulatory developments (Digital Personal Data Protection Act, Aadhaar regulations)
- Engage legal counsel for compliance review
- Design architecture for rapid policy adaptation
- Maintain comprehensive documentation of data handling practices
- Establish government liaison for regulatory guidance
- Build compliance flexibility into system design

## Future Roadmap

### Phase 1: MVP Launch (Months 1-3)

- Core platform with 100 high-impact schemes
- Aadhaar OCR and eligibility matching
- AI simplification in English and Hindi
- Basic mobile-responsive web interface
- AWS deployment with essential security controls


### Phase 2: Language & Scale Expansion (Months 4-6)

- Expand to 12 regional languages with validated translations
- Increase scheme database to 250+ schemes
- Implement advanced filtering and comparison features
- Add voice input capability for low-literacy users
- Enhance analytics and reporting dashboard
- Optimize performance for 50,000+ concurrent users

### Phase 3: Enhanced Features (Months 7-12)

- Native mobile applications (Android/iOS)
- Offline mode with cached scheme data
- Application status tracking integration (where APIs available)
- Community forum for user support and knowledge sharing
- SMS/WhatsApp notifications for scheme deadlines
- Integration with DigiLocker for document management
- Chatbot for interactive scheme discovery

### Phase 4: Ecosystem Integration (Year 2)

- API for NGOs and community organizations
- Integration with government application portals (where feasible)
- Predictive analytics for scheme recommendation
- Personalized scheme alerts based on life events
- Expansion to district and municipal-level schemes
- Partnership with banks for financial inclusion schemes
- Impact measurement and reporting framework


### Long-Term Vision

- Become the primary discovery platform for government welfare schemes in India
- Expand to cover 1000+ central, state, and local schemes
- Achieve 10 million+ active users across all Indian states
- Establish partnerships with government agencies for real-time scheme updates
- Develop predictive models to proactively notify citizens of new eligible schemes
- Create open-source framework for replication in other countries
- Measure and publish social impact metrics (benefits claimed, lives improved)
- Influence policy improvements based on user feedback and usage patterns

---

**Document Version**: 1.0  
**Last Updated**: February 15, 2026  
**Document Owner**: Product Management Team  
**Review Cycle**: Monthly or upon significant requirement changes

---

## Appendix: Glossary

- **Aadhaar**: 12-digit unique identity number issued by UIDAI to Indian residents
- **Amazon Bedrock**: AWS managed service for foundation models and generative AI
- **Amazon Textract**: AWS OCR service for text extraction from documents
- **OCR**: Optical Character Recognition - technology to extract text from images
- **Rule-Based Logic**: Deterministic algorithms using if-then conditions
- **LLM**: Large Language Model - AI trained on vast text data for language tasks
- **CDN**: Content Delivery Network - distributed servers for fast content delivery
- **Multi-AZ**: Multiple Availability Zones - AWS deployment across separate data centers
- **WCAG**: Web Content Accessibility Guidelines - standards for accessible web design
