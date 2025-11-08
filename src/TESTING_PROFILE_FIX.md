# Testing Guide: Profile Setup Fix

## ✅ Test Scenarios

### Test 1: New Elder User - First Time Setup

**Steps:**
1. Open the app
2. Click "Get Started"
3. Select "I'm an Elder" role
4. Click "Sign Up" tab
5. Fill in:
   - Name: "John Elder"
   - Phone: "+1234567890"
   - Email: "johnElder@test.com"
   - Password: "TestPass123!"
   - Confirm Password: "TestPass123!"
6. Click "Create Account"
7. Complete Elder Info Form (all 4 steps)
8. Submit the form

**Expected Result:**
- ✅ User is taken to Elder Dashboard
- ✅ Dashboard shows "Welcome, John Elder"
- ✅ "Edit Profile" button visible in header

**Database Check:**
- Profile saved at `user:{userId}:profile` with `role: 'elder'`

---

### Test 2: New Elder User - Return After Logout

**Steps:**
1. (Continue from Test 1)
2. Click "Sign Out"
3. Close the app/browser tab
4. Reopen the app
5. Click "Get Started"
6. Select "I'm an Elder" role
7. Click "Sign In" (should already be selected)
8. Enter:
   - Email: "johnElder@test.com"
   - Password: "TestPass123!"
9. Click "Sign In"

**Expected Result:**
- ✅ User goes DIRECTLY to Elder Dashboard
- ✅ NO Elder Info Form shown
- ✅ Dashboard shows previous user data
- ✅ No need to re-enter any information

**This is the KEY test! The form should NOT appear!**

---

### Test 3: New Doctor User - First Time Setup

**Steps:**
1. Open the app in incognito/private window
2. Click "Get Started"
3. Select "I'm a Doctor" role
4. Click "Sign Up" tab
5. Fill in:
   - Name: "Dr. Sarah Smith"
   - Phone: "+0987654321"
   - Email: "drsmith@test.com"
   - Password: "DocPass123!"
   - Confirm Password: "DocPass123!"
6. Click "Create Account"
7. Complete Doctor Info Form:
   - Specialty: "Geriatrics"
   - License: "MD12345"
   - Hospital: "City Hospital"
   - Years of Experience: "15"
   - Address: "123 Main St"
   - Phone: "+0987654321"
   - Email: "drsmith@hospital.com"
8. Click "Complete Profile"

**Expected Result:**
- ✅ User is taken to Doctor Dashboard
- ✅ Dashboard shows doctor name
- ✅ "Edit Profile" button visible in header

**Database Check:**
- Profile saved at `user:{userId}:profile` with `role: 'doctor'`

---

### Test 4: New Doctor User - Return After Logout

**Steps:**
1. (Continue from Test 3)
2. Click "Sign Out"
3. Close the app/browser tab
4. Reopen the app
5. Click "Get Started"
6. Select "I'm a Doctor" role
7. Sign in with:
   - Email: "drsmith@test.com"
   - Password: "DocPass123!"
8. Click "Sign In"

**Expected Result:**
- ✅ User goes DIRECTLY to Doctor Dashboard
- ✅ NO Doctor Info Form shown
- ✅ Dashboard shows previous doctor data
- ✅ No need to re-enter any information

**This is the KEY test! The form should NOT appear!**

---

### Test 5: Edit Profile - Elder

**Steps:**
1. Log in as elder user (from Test 2)
2. On Dashboard, click "Edit Profile" button
3. Edit Profile Dialog opens
4. Navigate through tabs and change some values:
   - Personal: Change age
   - Health: Add/remove medical condition
   - Medications: Update medication notes
   - Contacts: Update guardian email
5. Click "Save Changes"

**Expected Result:**
- ✅ Success toast appears
- ✅ Dialog closes
- ✅ Changes are reflected in dashboard
- ✅ After refresh, changes persist

---

### Test 6: Edit Profile - Doctor

**Steps:**
1. Log in as doctor user (from Test 4)
2. On Dashboard, click "Edit Profile" button
3. Edit Profile Dialog opens
4. Change some values:
   - Specialty
   - Hospital name
   - Years of experience
5. Click "Save Changes"

**Expected Result:**
- ✅ Success toast appears
- ✅ Dialog closes
- ✅ Changes are reflected in dashboard
- ✅ After refresh, changes persist

---

### Test 7: Session Persistence - Auto Login

**Steps:**
1. Log in as any user
2. Navigate to Dashboard
3. Close browser tab (don't sign out)
4. Reopen the app in a new tab
5. Wait for loading screen

**Expected Result:**
- ✅ User is automatically logged in
- ✅ Goes directly to their dashboard
- ✅ No authentication screens shown
- ✅ Profile data is loaded

---

### Test 8: Cross-Browser Testing

**Steps:**
1. Complete Test 2 (Elder user) in Chrome
2. Note the email used
3. Open app in Firefox/Safari
4. Sign in with same credentials

**Expected Result:**
- ✅ Works in all browsers
- ✅ Same behavior - goes directly to dashboard
- ✅ No forms shown on return

---

## 🐛 Common Issues and Solutions

### Issue 1: Form Still Appears After Login

**Possible Causes:**
- Backend not deployed
- getUserProfile() endpoint not accessible
- Profile not properly saved with role field

**Debug Steps:**
1. Open browser console
2. Look for API errors
3. Check Network tab for `/user-profile` call
4. Verify response has `hasProfile: true` and `role` field

**Fix:**
- Ensure backend is deployed with new endpoints
- Clear browser cache and try again
- Re-signup to create profile with role field

---

### Issue 2: "Edit Profile" Not Working

**Possible Causes:**
- Old profile data format
- Role not set in profile

**Debug Steps:**
1. Check console for errors
2. Verify API call to `/elder-info` or `/doctor-info`
3. Check if profile has role field

**Fix:**
- Log out and log in again
- Check that profile update includes role field

---

### Issue 3: Wrong Dashboard Showing

**Possible Causes:**
- Role mismatch in profile
- Multiple profiles for same user

**Debug Steps:**
1. Check localStorage/sessionStorage
2. Verify profile role in database
3. Check selectedRole state in App

**Fix:**
- Clear browser storage
- Verify database has correct role
- Re-signup if needed

---

## 📊 Test Results Template

Use this template to record your test results:

```
Test Date: _______________
Tester: __________________

| Test # | Scenario | Pass/Fail | Notes |
|--------|----------|-----------|-------|
| 1 | New Elder Setup | ⬜ Pass ⬜ Fail | |
| 2 | Elder Return Login | ⬜ Pass ⬜ Fail | |
| 3 | New Doctor Setup | ⬜ Pass ⬜ Fail | |
| 4 | Doctor Return Login | ⬜ Pass ⬜ Fail | |
| 5 | Edit Elder Profile | ⬜ Pass ⬜ Fail | |
| 6 | Edit Doctor Profile | ⬜ Pass ⬜ Fail | |
| 7 | Session Persistence | ⬜ Pass ⬜ Fail | |
| 8 | Cross-Browser | ⬜ Pass ⬜ Fail | |

Overall Status: _______________
Issues Found: _________________
```

---

## 🔍 Manual Database Verification

If you have access to the Supabase dashboard:

1. Go to Supabase Dashboard
2. Navigate to your project
3. Open KV Storage viewer
4. Search for keys with pattern: `user:*:profile`
5. Verify each profile has:
   - ✅ `role` field ('elder' or 'doctor')
   - ✅ `updatedAt` timestamp
   - ✅ Complete profile data

Example Elder Profile:
```json
{
  "role": "elder",
  "age": "70",
  "gender": "Male",
  "bloodGroup": "O+",
  "guardianEmail": "guardian@example.com",
  "updatedAt": "2025-11-08T10:30:00.000Z"
}
```

Example Doctor Profile:
```json
{
  "role": "doctor",
  "specialty": "Geriatrics",
  "hospital": "City Hospital",
  "licenseNumber": "MD12345",
  "updatedAt": "2025-11-08T10:30:00.000Z"
}
```

---

## 🎯 Success Criteria

The fix is successful if:
- ✅ All 8 tests pass
- ✅ Users complete info forms only ONCE (during signup)
- ✅ Returning users go directly to dashboard
- ✅ No console errors
- ✅ Profile edits work and persist
- ✅ Both elder and doctor flows work correctly

---

## 📞 Support

If tests fail:
1. Check PROFILE_FIX_DOCUMENTATION.md for detailed information
2. Review FLOW_DIAGRAM.md for expected flow
3. Verify backend is deployed with new endpoints
4. Check browser console for specific errors
5. Try with fresh user accounts

**Happy Testing! 🎉**
