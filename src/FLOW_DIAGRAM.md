# Elder Mood Mirror - Authentication & Profile Flow

## 🔄 Complete User Flow After Fix

### Scenario 1: Brand New User (Elder)

```
┌─────────────────┐
│  Landing Page   │
│  "Get Started"  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Role Selection  │
│  Choose: Elder  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Auth Screen    │
│   Sign Up Form  │
│ (email/password)│
└────────┬────────┘
         │ Account Created
         ▼
┌─────────────────┐
│ Elder Info Form │
│  (4-step form)  │
│ • Personal Info │
│ • Health        │
│ • Medications   │
│ • Contacts      │
└────────┬────────┘
         │ Saved with role: 'elder'
         ▼
┌─────────────────┐
│ Elder Dashboard │  ← Main App
│ (Mood tracking) │
└─────────────────┘
```

### Scenario 2: Brand New User (Doctor)

```
┌─────────────────┐
│  Landing Page   │
│  "Get Started"  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Role Selection  │
│ Choose: Doctor  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Auth Screen    │
│   Sign Up Form  │
│ (email/password)│
└────────┬────────┘
         │ Account Created
         ▼
┌─────────────────┐
│Doctor Info Form │
│ • Specialty     │
│ • License       │
│ • Hospital      │
│ • Contact Info  │
└────────┬────────┘
         │ Saved with role: 'doctor'
         ▼
┌─────────────────┐
│Doctor Dashboard │  ← Main App
│(Patient mgmt)   │
└─────────────────┘
```

### Scenario 3: Returning Elder User ✨ (THE FIX!)

```
┌─────────────────┐
│   App Opens     │
│ checkSession()  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ User logged in? │
│      YES        │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ getUserProfile() API    │
│ Check: hasProfile?      │
│        role?            │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Response:               │
│ hasProfile: true        │
│ role: 'elder'           │
│ profile: {age, gender...│
└────────┬────────────────┘
         │
         ▼
┌─────────────────┐
│ setElderData()  │
│ setRole('elder')│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Elder Dashboard │  ← DIRECT! No form!
│ Welcome back!   │
└─────────────────┘
```

### Scenario 4: Returning Doctor User ✨ (THE FIX!)

```
┌─────────────────┐
│   App Opens     │
│ checkSession()  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ User logged in? │
│      YES        │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ getUserProfile() API    │
│ Check: hasProfile?      │
│        role?            │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Response:               │
│ hasProfile: true        │
│ role: 'doctor'          │
│ profile: {specialty...} │
└────────┬────────────────┘
         │
         ▼
┌─────────────────┐
│setDoctorData()  │
│setRole('doctor')│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│Doctor Dashboard │  ← DIRECT! No form!
│ Welcome back!   │
└─────────────────┘
```

## 🆚 Before vs After Comparison

### ❌ BEFORE (Broken)

```
Returning User Login:
  ↓
checkSession()
  ↓
Try getElderInfo() → Fails
  ↓
Try getDoctorInfo() → Fails
  ↓
Assume elder role
  ↓
Redirect to Elder Info Form ← 😞 Asked every time!
```

### ✅ AFTER (Fixed)

```
Returning User Login:
  ↓
checkSession()
  ↓
getUserProfile() → Success!
  ↓
hasProfile: true
role: 'elder'/'doctor'
  ↓
Load profile data
  ↓
Go to Dashboard ← 😊 No form!
```

## 🎯 Key Decision Points

### checkSession() Logic

```
┌──────────────────────┐
│ Is user logged in?   │
└──────┬───────────────┘
       │
   YES │
       ▼
┌──────────────────────┐
│ Call getUserProfile()│
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ hasProfile exists?   │
└──┬───────────────┬───┘
   │               │
YES│               │NO
   │               │
   ▼               ▼
┌─────────┐   ┌────────────────┐
│Load Data│   │Role Selection  │
│Go to    │   │(First-time     │
│Dashboard│   │ setup flow)    │
└─────────┘   └────────────────┘
```

## 🗄️ Database Storage Structure

```
Supabase KV Store:
├── user:{userId}:basic
│   └── {email, name, phone, createdAt}
│
├── user:{userId}:profile
│   ├── If Elder: {role: 'elder', age, gender, medicalConditions...}
│   └── If Doctor: {role: 'doctor', specialty, hospital, license...}
│
└── user:{userId}:doctorInfo (backup for doctors)
    └── {specialty, hospital, license...}
```

## 🔐 Security Flow

```
User Request
    ↓
Bearer Token in Header
    ↓
Backend: verifyAuth()
    ↓
Extract userId from token
    ↓
Fetch data: user:{userId}:profile
    ↓
Return to user (only their data)
```

## 🎨 Edit Profile Feature

```
User on Dashboard
    ↓
Click "Edit Profile" button
    ↓
┌──────────────────────┐
│ Edit Profile Dialog  │
│ (Role-specific form) │
└──────┬───────────────┘
       │
       ▼ Save Changes
┌──────────────────────┐
│ Call API:            │
│ saveElderInfo()      │
│   OR                 │
│ saveDoctorInfo()     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Update in Database   │
│ Refresh local data   │
└──────┬───────────────┘
       │
       ▼
Dashboard with updated info
```

## 📝 Summary

**The Fix**: Added a proper profile existence check (`getUserProfile()`) that runs on app startup to determine if the user has already completed their setup. This prevents the info forms from being shown repeatedly to returning users.

**Key Innovation**: The `role` field stored in profiles allows the system to automatically know which type of user (elder or doctor) is logging in and load the appropriate dashboard without any additional user input.

---

🎉 **Result**: Seamless experience for all users - setup once, use forever!
