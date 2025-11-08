# Elder Mood Mirror - Troubleshooting Guide

## Common Issues and Solutions

### 1. "Email Already Registered" Error

**Issue:** When trying to sign up, you see: "A user with this email address has already been registered"

**Solution:**
- This means you already have an account with this email
- The app will automatically switch you to the Sign In screen
- Simply enter your password to log in
- If you forgot your password, you'll need to use Supabase's password reset feature

**Why This Happens:**
- You may have created an account earlier
- Each email can only be registered once for security

---

### 2. Doctor Profile Features Not Working

**Issue:** Some doctor portal features show "Coming Soon" or fail to save

**Current Status:**
- ✅ **Working:** Doctor Dashboard, Patient Management, Patient Details
- ⏳ **Coming Soon:** Real-time alerts, Guardian messaging
- 🔧 **Backend Needed:** Some features require backend implementation

**What Works Now:**
- Doctor profile creation (saved locally)
- Patient list viewing (mock data)
- Patient detail pages (mock data)
- Dashboard statistics (mock data)

**What's Coming:**
- Real patient data from database
- Live mood alerts
- Direct guardian messaging
- Full API integration

---

### 3. Role Selection Confusion

**Issue:** Not sure which role to choose?

**Guidance:**
- **Choose "I'm an Elder"** if you are:
  - A senior citizen tracking your own wellness
  - Setting up mood tracking for yourself
  - Want to complete daily surveys
  
- **Choose "I'm a Doctor"** if you are:
  - A healthcare professional
  - Managing multiple elderly patients
  - Monitoring patient wellness trends

**Important:** Once you create an account with a specific role, that's your account type. You cannot switch roles later (you'd need a different email for a different role).

---

### 4. Session and Login Issues

**Issue:** App keeps asking me to log in or shows wrong screen

**Solutions:**
1. **Clear browser cache** and reload
2. **Sign out completely** using the Sign Out button
3. **Close all tabs** and open a fresh browser window
4. **Check your role** - make sure you selected the right role when signing up

**Session Behavior:**
- The app saves your login state
- You should stay logged in even after refreshing
- If you see the landing page, your session expired

---

### 5. Elder Features (For Elders)

**All Elder Features Are Fully Functional:**
- ✅ Daily Mood Survey (12 questions)
- ✅ Camera-based Mood Detection
- ✅ Weekly Analytics
- ✅ Reports Dashboard
- ✅ Guardian Email Reports
- ✅ Profile Management

**If surveys aren't working:**
1. Navigate to "Daily Survey" tab
2. Click "Start Survey" button
3. Complete all 12 questions
4. Data is saved to Supabase

---

### 6. Doctor Portal (For Doctors)

**Currently Working with Mock Data:**
- ✅ Dashboard with patient overview
- ✅ Patient list with 6 sample patients
- ✅ Detailed patient profiles
- ✅ Medication tracking views
- ✅ Mood history displays

**Mock Patients Included:**
- Mary Johnson (72, anxious, multiple alerts)
- Robert Smith (68, calm, medication issues)
- Linda Brown (75, happy, excellent adherence)
- James Wilson (70, sad, COPD)
- Patricia Davis (69, anxious, depression)
- Michael Miller (73, calm, Parkinson's)

**To Use:**
1. Create doctor account
2. Fill in professional details
3. Access dashboard
4. Navigate to "Patients" tab
5. Click "View" on any patient card

---

## Development Notes

### For Developers

**Current Architecture:**
- Frontend: React + TypeScript + Tailwind CSS
- Backend: Supabase (Auth + KV Store)
- API: Edge Functions (partially implemented)

**What Needs Backend Implementation:**
- `/doctor-info` endpoint (GET/POST)
- `/doctor-patients` endpoint (GET)
- `/patient-detail/:id` endpoint (GET)
- `/doctor-alerts` endpoint (GET)
- `/send-guardian-message` endpoint (POST)

**Workarounds in Place:**
- Doctor info saves locally in state
- Patient data uses mock/hardcoded values
- Error handling catches missing endpoints gracefully

---

## Getting Help

### Quick Fixes
1. **Refresh the page** - Many issues resolve with a simple refresh
2. **Check console** - Open browser DevTools to see detailed error messages
3. **Verify role** - Make sure you're using the correct account type
4. **Re-authenticate** - Sign out and sign back in

### Still Having Issues?

1. Check the browser console for detailed error messages
2. Verify Supabase connection (check `/utils/supabase/info.tsx`)
3. Ensure you have a stable internet connection
4. Try a different browser (Chrome, Firefox, Safari)

---

## Feature Status Summary

| Feature | Elder | Doctor | Status |
|---------|-------|--------|--------|
| Sign Up/Login | ✅ | ✅ | Working |
| Profile Setup | ✅ | ✅ | Working |
| Dashboard | ✅ | ✅ | Working |
| Daily Survey | ✅ | N/A | Working |
| Camera Detection | ✅ | N/A | Working |
| Analytics | ✅ | ⏳ | Elder: Yes, Doctor: Coming Soon |
| Reports | ✅ | ⏳ | Elder: Yes, Doctor: Coming Soon |
| Patient Management | N/A | ✅ | Mock Data |
| Alerts System | N/A | ⏳ | Coming Soon |
| Messaging | N/A | ⏳ | Coming Soon |

**Legend:**
- ✅ Fully Working
- ⏳ Coming Soon
- 🔧 Needs Backend
- N/A Not Applicable

---

*Last Updated: November 8, 2025*
