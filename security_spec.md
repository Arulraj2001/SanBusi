# Security Specification (TDD Rules Validation)

This document outlines the strict data invariants, security boundaries, and validation rules for the Digital Solutions Agency Firestore database.

## 1. Data Invariants

- **Public Access Limitation**: Only verified Admin accounts are authorized to make write modifications (Create, Update, Delete) on `services`, `portfolio`, `blog`, `testimonials`, `faqs`, `careers`, and `settings`.
- **Public Visibility (Read-Only)**: The public can read documents within `services`, `portfolio`, `blog`, `testimonials`, `faqs`, `careers`, and `settings`.
- **Pre-Authorized Admins Only**: Pre-authorized admins exist inside the `/admins/{adminId}` collection. Any update/write operation requires verifying the caller `request.auth.uid` has a matching record in `/admins/$(request.auth.uid)` OR is the bootstrapped developer account `samuelarul2001@gmail.com`.
- **Inbound Lead / Contact Messages Isolation**: Anyone can write (create) leads into `/contactMessages/`. However, reading or querying `/contactMessages/` is strictly restricted to pre-authorized administrative users. Public reads or listings of contact messages are completely blocked to prevent PII leaks.
- **Strict Size Limits**: All string values must be strictly length-restricted to prevent memory/Denial of Wallet attacks.
- **Timestamp Integrity**: All `createdAt` and `updatedAt` properties must conform to `request.time` (no client-controlled timestamps allowed during write transitions).

---

## 2. The "Dirty Dozen" Malicious Payloads

The following 12 payloads represent security-break attempts targeted at identity spoofing, state escalation, resource poisoning, or updating immutable properties. The Firestore security rules must block them with `PERMISSION_DENIED`.

### Payload 1: Self-Escalating Admin Creation
- **Target Collection**: `/admins/malicious_user_uid`
- **Action**: `create`
- **Goal**: Registering oneself as an admin without authorization.
- **Payload**:
  ```json
  {
    "email": "malicious@gmail.com",
    "role": "admin",
    "createdAt": "2026-06-13T00:00:00Z"
  }
  ```
- **Rejection Reason**: Caller `request.auth.uid` is NOT an existing admin or pre-authorized user; therefore they cannot write to the `/admins/` collection.

### Payload 2: Lead Siphoning (Public List of Contact Messages)
- **Target Collection**: `/contactMessages/`
- **Action**: `list` (Get query)
- **Goal**: Steal name, email, phone, and inquiry details of potential clients.
- **Rejection Reason**: Unauthenticated or non-admin users have no read authorization over the `/contactMessages/` collection.

### Payload 3: Mutating Immutable Timestamps
- **Target Collection**: `/blog/article_id`
- **Action**: `update`
- **Goal**: Forging historical creation timestamps.
- **Payload update**:
  ```json
  {
    "createdAt": "2020-01-01T00:00:00"
  }
  ```
- **Rejection Reason**: Rules enforce `incoming().createdAt == existing().createdAt` (immutability of creation dates).

### Payload 4: Injecting Ghost Fields (The Shadow Update)
- **Target Collection**: `/services/service_id`
- **Action**: `update`
- **Goal**: Add arbitrary metadata variables or un-whitelisted attributes.
- **Payload update**:
  ```json
  {
    "title": "New Title",
    "isFeatured": "yes_malicious_additional_key"
  }
  ```
- **Rejection Reason**: The rules enforce strict `affectedKeys().hasOnly(...)` during updates, blocking foreign/shadow parameters.

### Payload 5: Denying Wallet via Massive Input (String Overflow)
- **Target Collection**: `/faqs/faq_id`
- **Action**: `create`
- **Goal**: Exceed database memory allocation by writing a 5MB payload response.
- **Payload**:
  ```json
  {
    "question": "A?".repeat(100000),
    "answer": "Yes.".repeat(100000),
    "category": "General",
    "createdAt": "request.time",
    "updatedAt": "request.time"
  }
  ```
- **Rejection Reason**: Direct character boundary limit checks (`is string && data.question.size() <= 2000`) deny the write.

### Payload 6: Spoofing Admin Identity via Email Property
- **Target Collection**: `/portfolio/project_id`
- **Action**: `create`
- **Goal**: Authenticate as a user, spoofing admin privileges with unverified or falsified claims.
- **Rejection Reason**: Trusting token credentials without verification or checking email verification status. Rules enforce standard email verification checks and direct trusted admin document matching.

### Payload 7: Client-Controlled Creation Timestamps
- **Target Collection**: `/careers/career_id`
- **Action**: `create`
- **Goal**: Forge system creation time.
- **Payload**:
  ```json
  {
    "title": "Software Engineer",
    "department": "Engineering",
    "location": "Remote",
    "type": "Full-time",
    "description": "...",
    "requirements": [],
    "benefits": [],
    "createdAt": "1999-01-01T00:00:00.000Z",
    "updatedAt": "1999-01-01T00:00:00.000Z"
  }
  ```
- **Rejection Reason**: Requires `incoming().createdAt == request.time`.

### Payload 8: Direct Database Infiltration without verified email
- **Target Collection**: `/blog/article_id`
- **Action**: `create`
- **Goal**: Write an article without verifying the admin's email identity.
- **Rejection Reason**: Security rules demand `request.auth.token.email_verified == true`.

### Payload 9: Client Query Scraping (No Query Enforcer)
- **Target Collection**: `/contactMessages/`
- **Action**: `list`
- **Goal**: Fetch list of customer emails using client-side query filters.
- **Rejection Reason**: Rules assert no public listing is allowed, requiring actual admin check inside the security rule.

### Payload 10: Value Poisoning (Invalid Data Type Injection)
- **Target Collection**: `/testimonials/testimonial_id`
- **Action**: `update`
- **Goal**: Force rating to be an invalid type (string) or an out-of-bounds value.
- **Payload**:
  ```json
  {
    "rating": "five_stars"
  }
  ```
- **Rejection Reason**: validation helper checks `incoming().rating is number`.

### Payload 11: System-Generated Property Hijacking
- **Target Collection**: `/contactMessages/message_id`
- **Action**: `update` (From consumer to Admin)
- **Goal**: Switch contact message status to standard "unread" or bypass authorization.
- **Rejection Reason**: Non-admins are completely blocked from updates. Admins must explicitly sign in to transition state safely.

### Payload 12: Orphaned Link Injection (ID Poisoning)
- **Target Collection**: `/services/project_id_with_crazy_length`
- **Action**: `create`
- **Goal**: Corrupt layout indexes with extremely large ID string tokens containing special shell characters.
- **Rejection Reason**: Enforces `isValidId()` check on paths preventing resource exhausting attacks.

---

## 3. Test Runner Verifications

All 12 malicious payloads are run against a simulated environment using the Firebase Rules unit runner. Each payload yields `permission-denied` (or equivalent HTTP 403 response in production client environments) since validation constraints catch them during individual evaluation steps before database commits.
