# ALIRA User Flow Diagram

## Visual Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         HOMEPAGE (/)                             │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Hero Section                           │  │
│  │                                                           │  │
│  │              "Turn your idea into a business"           │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐    │  │
│  │  │  💬 Chat Input (id: #start-chat)               │    │  │
│  │  │  "Type your business idea here..."             │    │  │
│  │  │  ┌────────────┐                                 │    │  │
│  │  │  │    Send    │  ◄── User types & clicks       │    │  │
│  │  │  └────────────┘                                 │    │  │
│  │  └─────────────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                               │                                  │
│                               ▼                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │           🔐 AUTH MODAL (Signup/Login)                   │  │
│  │                                                           │  │
│  │  Name:     [________________]  (if signup)              │  │
│  │  Email:    [________________]                           │  │
│  │  Password: [________________]                           │  │
│  │                                                           │  │
│  │  [ Create Account & Continue ]                           │  │
│  │                                                           │  │
│  │  Already have an account? Sign in  ◄── Toggle            │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ Authenticated ✓
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CONVERSATIONAL FORM                            │
│                    (/form-chat)                                  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  🤖 ALIRA Assistant                                        │ │
│  │  "Let's start with the basics. What's your business       │ │
│  │   idea or current venture?"                               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  👤 User: "An AI-powered fitness app..."                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  🤖 "Thanks! What are your biggest operational            │ │
│  │     challenges right now?"                                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  [... continues for 4 questions ...]                             │
│                                                                   │
│  Question 1: Business idea                                       │
│  Question 2: Current challenges                                  │
│  Question 3: Immediate goals (3-6 months)                        │
│  Question 4: Service interests (multi-select checkboxes)         │
│                                                                   │
│                               │                                  │
│                               ▼                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  🤖 "Perfect! I'm now creating your personalized          │ │
│  │     business plan. This will just take a moment..."       │ │
│  │                                                            │ │
│  │                    ⏳ Generating...                        │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ Plan Generated ✓
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                          DASHBOARD                               │
│                        (/dashboard)                              │
│                                                                   │
│  ┌─────────────┬─────────────┬─────────────┐                   │
│  │ 📄 Total    │ ✅ Ready    │ ⏳ In       │                   │
│  │   Plans     │   Download  │   Progress  │                   │
│  │     3       │      2      │      1      │                   │
│  └─────────────┴─────────────┴─────────────┘                   │
│                                                                   │
│  Your Business Plans                         [ + New Plan ]      │
│  ─────────────────────────────────────────────────────────────  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 📄 AI-powered fitness app that creates...              │   │
│  │    Created 19 October 2025                             │   │
│  │                                                          │   │
│  │    Challenge: Limited funding and...                   │   │
│  │    [Brand & Product] [Digital Solutions]               │   │
│  │                                                          │   │
│  │                           [ 📥 Download PDF ]           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 📄 Sustainable fashion marketplace...                  │   │
│  │    Created 15 October 2025                             │   │
│  │                                                          │   │
│  │                           [ 📥 Download PDF ]           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [ Sign Out ]                                                    │
└─────────────────────────────────────────────────────────────────┘
```

## CTA Buttons Flow

All CTA buttons on the site now work consistently:

```
┌──────────────────────────────────────────────────────────┐
│  Any CTA Button                                           │
│  (Homepage, Services, About, etc.)                        │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │ Smooth Scroll
                     ▼
┌──────────────────────────────────────────────────────────┐
│  Hero Chat (#start-chat)                                  │
│  User types idea → Auth Modal → Conversational Form      │
└──────────────────────────────────────────────────────────┘
```

## Key Interactions

### 1. Homepage Chat Interaction
```
User Types Message
       │
       ▼
   [Send Button]
       │
       ▼
   Auth Modal Opens
       │
       ├─ New User? → Sign Up Form
       │
       └─ Existing? → Login Form
              │
              ▼
       Redirect to /form-chat
```

### 2. Conversational Form Interaction
```
Question Appears
       │
       ▼
User Types Answer
       │
       ▼
   [Send/Continue]
       │
       ▼
Next Question (or Complete)
       │
       ▼
Generate Business Plan
       │
       ▼
  Redirect to Dashboard
```

### 3. Dashboard Interaction
```
View Plans
    │
    ├─ Download PDF (if ready)
    │
    ├─ Create New Plan → Back to Homepage #start-chat
    │
    └─ Sign Out → Back to Homepage
```

## Mobile Experience

```
┌─────────────────┐
│   📱 Mobile     │
│                 │
│  ┌───────────┐ │
│  │   Hero    │ │
│  │   Chat    │ │
│  └───────────┘ │
│                 │
│  [Sticky CTA]  │ ◄── Fixed at bottom
│                 │
│  [Scroll]       │
│      ↓          │
│                 │
│  [Services]    │
│  [Team]        │
│  [FAQ]         │
│                 │
└─────────────────┘
```

## Data Flow

```
┌────────────┐     ┌─────────────┐     ┌──────────────┐
│  Browser   │────▶│  Supabase   │────▶│   OpenAI     │
│            │     │   Auth      │     │     API      │
│  User      │     └─────────────┘     └──────────────┘
│  Session   │             │                    │
└────────────┘             │                    │
      ▲                    ▼                    ▼
      │            ┌─────────────┐     ┌──────────────┐
      │            │  Database   │     │   Generate   │
      │            │  - users    │     │  Business    │
      └────────────│  - forms    │◀────│    Plan      │
                   │  - plans    │     │              │
                   └─────────────┘     └──────────────┘
```

## State Management

```
┌─────────────────────────────────────────────────────┐
│  Global Auth State (Supabase)                       │
│  ┌───────────────────────────────────────────────┐ │
│  │  user: { id, email, user_metadata }           │ │
│  │  session: { access_token, refresh_token }     │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
            │                           │
            ▼                           ▼
┌─────────────────────┐    ┌─────────────────────────┐
│  Form State         │    │   Dashboard State       │
│  ┌───────────────┐  │    │  ┌───────────────────┐ │
│  │  messages[]   │  │    │  │  plans[]          │ │
│  │  formData{}   │  │    │  │  loading          │ │
│  │  currentQ     │  │    │  │  user             │ │
│  └───────────────┘  │    │  └───────────────────┘ │
└─────────────────────┘    └─────────────────────────┘
```

## Security Flow

```
┌──────────────────────────────────────────────────────┐
│  Request with Session Token                          │
└─────────────────┬────────────────────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │ Supabase Auth  │
         │  Validates     │
         │   Session      │
         └────────┬───────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
   ✅ Valid            ❌ Invalid
        │                   │
        ▼                   ▼
 ┌──────────────┐    ┌──────────────┐
 │ RLS Policies │    │  Redirect    │
 │   Check      │    │  to Login    │
 │  user_id     │    └──────────────┘
 └──────┬───────┘
        │
        ▼
 ┌──────────────┐
 │  Return      │
 │  User's      │
 │  Data Only   │
 └──────────────┘
```

---

This flow ensures:
- ✅ Users always stay on your platform
- ✅ All data is tied to authenticated users
- ✅ Conversational, personalized experience
- ✅ Easy access to previous plans
- ✅ Secure and private

