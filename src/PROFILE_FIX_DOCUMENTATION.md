# Profile Setup Fix Documentation

## Problem Statement

Previously, elder and doctor information was being requested **every time** users signed in, even if they had already completed their profile setup during their first signup. This created a poor user experience where returning users had to re-enter their information on every login.

## Root Cause

The application was not properly distinguishing between:
1. **First-time users** who need to complete their profile setup
2. **Returning users** who have already completed their profile

The `checkSession()` function in `App.tsx` was attempting to fetch elder or doctor info, but if the fetch failed or returned no data, it would redirect users to the info forms without checking if they had a valid existing profile.

## Solution Implemented

### 1. Backend Changes (`/supabase/functions/server/index.tsx`)

#### Added Role-Based Profile Storage
- Modified elder-info POST endpoint to store profiles with `role: 'elder'` marker
- Added complete doctor-info POST and GET endpoints
- Doctor profiles are stored with `role: 'doctor'` marker
- Both elder and doctor profiles are stored at `user:${userId}:profile`

#### New Endpoint: `/user-profile`
Created a unified endpoint that:
- Returns `hasProfile: true/false` to indicate if user completed setup
- Returns `role: 'elder' | 'doctor'` to identify user type
- Returns the complete profile data
- Provides basic user info (name, email, phone from signup)

```typescript
// Example response
{
  success: true,
  hasProfile: true,
  role: "elder",
  profile: { age: "70", gender: "Male", ... },
  basicInfo: { email: "user@example.com", name: "John Doe", phone: "+1234567890" }
}
```

### 2. Frontend API Changes (`/utils/api.ts`)

Added new function:
```typescript
export async function getUserProfile() {
  return apiCall('/user-profile', {
    method: 'GET',
  });
}
```

### 3. App Logic Changes (`/App.tsx`)

#### Updated `checkSession()` Function
The session check now follows this improved flow:

```
1. Check if user is authenticated
   ↓
2. Call getUserProfile() to check profile status
   ↓
3. If hasProfile && role exists:
   → Load appropriate data (elder or doctor)
   → Set role
   → Go to main screen ✓
   ↓
4. If no profile:
   → Go to role selection screen
   → User selects role → Auth → Info Form → Main screen
```

**Before:**
```typescript
// Old logic tried elder first, then doctor, then assumed elder
const elderInfoResponse = await getElderInfo();
if (elderInfoResponse.success) { /* ... */ }
else {
  const doctorInfoResponse = await getDoctorInfo();
  if (doctorInfoResponse.success) { /* ... */ }
  else {
    // Redirect to elderInfo form ❌ (Asked every time!)
  }
}
```

**After:**
```typescript
// New logic checks profile status first
const profileResponse = await getUserProfile();
if (profileResponse.success && profileResponse.hasProfile && profileResponse.role) {
  // User has completed setup - load profile and go to main ✓
  if (profileResponse.role === 'elder') {
    setElderData(profileResponse.profile);
    setSelectedRole('elder');
  } else if (profileResponse.role === 'doctor') {
    setDoctorData(profileResponse.profile);
    setSelectedRole('doctor');
  }
  setCurrentScreen('main');
} else {
  // No profile - go to role selection for first-time setup
  setCurrentScreen('roleSelection');
}
```

## User Flow Diagrams

### First-Time User (Elder)
```
Landing Page
    ↓
Role Selection → Select "Elder"
    ↓
Auth Screen → Sign Up
    ↓
Elder Info Form → Complete 4-step form
    ↓ [Profile saved with role: 'elder']
Main Dashboard ✓
```

### First-Time User (Doctor)
```
Landing Page
    ↓
Role Selection → Select "Doctor"
    ↓
Auth Screen → Sign Up
    ↓
Doctor Info Form → Complete professional profile
    ↓ [Profile saved with role: 'doctor']
Doctor Dashboard ✓
```

### Returning User (Any Role)
```
App Opens
    ↓
checkSession() → getUserProfile()
    ↓
Profile Found? YES
    ↓ [Load existing profile data]
Main Dashboard ✓ (No form asked!)
```

### Edge Case: Logged-in User Without Profile
```
App Opens
    ↓
checkSession() → getUserProfile()
    ↓
Profile Found? NO
    ↓
Role Selection → Complete setup flow
```

## Database Schema

### Storage Keys Used

| Key Pattern | Purpose | Example |
|------------|---------|---------|
| `user:${userId}:basic` | Basic user info from signup | `{email, name, phone, createdAt}` |
| `user:${userId}:profile` | Main profile (elder or doctor) | `{role: 'elder', age, gender, ..., updatedAt}` |
| `user:${userId}:doctorInfo` | Doctor-specific backup key | `{specialty, hospital, ..., updatedAt}` |

### Profile Data Structure

**Elder Profile:**
```json
{
  "role": "elder",
  "age": "70",
  "gender": "Male",
  "bloodGroup": "O+",
  "disability": "None",
  "medicalConditions": ["High Blood Pressure (BP)", "Diabetes"],
  "otherConditions": "",
  "currentMedications": "Metformin, Lisinopril",
  "tabletName": "Metformin",
  "tabletFrequency": "Twice a day",
  "medicationNotes": "Take with meals",
  "guardianName": "Jane Doe",
  "guardianEmail": "jane@example.com",
  "guardianPhone": "+1234567890",
  "clinicEmail": "clinic@example.com",
  "emergencyContact": "+0987654321",
  "updatedAt": "2025-11-08T10:30:00.000Z"
}
```

**Doctor Profile:**
```json
{
  "role": "doctor",
  "specialty": "Geriatrics",
  "licenseNumber": "MD12345",
  "hospital": "City General Hospital",
  "address": "123 Main St, City, State",
  "phone": "+1234567890",
  "email": "doctor@hospital.com",
  "yearsOfExperience": "15",
  "updatedAt": "2025-11-08T10:30:00.000Z"
}
```

## Benefits of This Fix

✅ **No More Repeated Forms**: Returning users go directly to their dashboard
✅ **Role Persistence**: System remembers if user is elder or doctor
✅ **Better UX**: Smooth experience for both first-time and returning users
✅ **Backward Compatible**: Works with existing data (defaults to 'elder' for legacy profiles)
✅ **Secure**: All profile checks use authenticated API calls
✅ **Edit Profile**: Users can still edit their profile anytime via "Edit Profile" button

## Edit Profile Feature

Users can edit their profile information at any time:

1. Click **"Edit Profile"** button in the header (visible on main screen)
2. Edit any information in the dialog
3. Click **"Save Changes"**
4. Profile is updated in the database
5. Changes reflect immediately in the app

The `EditProfileDialog` component handles both elder and doctor profiles with appropriate form fields for each role.

## Testing Checklist

- [x] First-time elder signup → completes form once
- [x] First-time doctor signup → completes form once  
- [x] Elder logs out and logs back in → goes directly to dashboard
- [x] Doctor logs out and logs back in → goes directly to dashboard
- [x] Edit profile works for elders
- [x] Edit profile works for doctors
- [x] Profile data persists across sessions
- [x] Role-based data separation works correctly

## Migration Notes

**For Existing Users:**
- Legacy profiles without `role` field will default to `'elder'`
- Elder profiles will continue to work seamlessly
- Doctor users may need to complete profile setup once if they were created before this fix

**For New Deployments:**
- Backend changes are required for this to work
- Deploy backend changes first, then frontend
- No database migration needed (KV store is schema-less)

## Files Modified

1. `/supabase/functions/server/index.tsx` - Added doctor endpoints and user-profile endpoint
2. `/utils/api.ts` - Added getUserProfile() function
3. `/App.tsx` - Updated checkSession() logic
4. `/PROFILE_FIX_DOCUMENTATION.md` - This documentation (new file)

## Support

If users experience issues:
1. Check browser console for error messages
2. Verify backend endpoints are accessible
3. Clear browser cache/localStorage and try again
4. Check that user has proper authentication token
5. Verify profile data exists in database with correct role field
