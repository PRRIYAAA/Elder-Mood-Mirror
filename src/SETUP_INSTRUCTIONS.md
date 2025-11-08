# Elder Mood Mirror - Setup Instructions

## Quick Start

### 1. Fix the Back Button (✅ Already Fixed)
The back button on the sign-in page now properly returns you to the landing page.

### 2. Enable Real Email Sending

To send actual emails to guardians, follow these steps:

#### Option A: Quick Test (Recommended for Testing)

1. **Sign up for Resend** (Free):
   - Go to https://resend.com
   - Create a free account
   - Verify your email address

2. **Get API Key**:
   - In Resend dashboard, go to "API Keys"
   - Click "Create API Key"
   - Copy the key (starts with `re_`)

3. **Add to Supabase**:
   - Open your Supabase project
   - Go to **Project Settings** → **Edge Functions**
   - Under **Environment Variables**, add:
     - **Name**: `RESEND_API_KEY`
     - **Value**: Paste your Resend API key
   - Click Save

4. **Test It**:
   - Make sure your elder profile has a guardian email set
   - Go to the Reports page
   - Click "Send to Guardian"
   - Check the guardian's email (and spam folder)

**Note**: With Resend's free sandbox mode, you can only send emails to addresses verified in your Resend account. To test:
- Add the guardian email as a "verified email" in Resend dashboard
- Or upgrade to verify your own domain (see below)

#### Option B: Production Setup (For Real Deployment)

1. **Verify Your Domain in Resend**:
   - In Resend dashboard, click "Domains"
   - Add your domain (e.g., `yourcompany.com`)
   - Add the DNS records they provide to your domain provider
   - Wait for verification (usually takes a few minutes)

2. **Update the Email Sender**:
   - Edit `/supabase/functions/server/index.tsx`
   - Find the line: `from: 'Elder Mood Mirror <noreply@eldermoodmirror.com>'`
   - Change to: `from: 'Elder Mood Mirror <noreply@yourdomain.com>'`

3. **Deploy**:
   - The changes will automatically deploy
   - Now you can send emails to any address

## Features

### What's Included

✅ **Beautiful Landing Page** - Introduces the app with your mission statement  
✅ **Back Navigation** - Users can go back from sign-in to the landing page  
✅ **Real Email Sending** - Weekly reports sent to guardian's email  
✅ **HTML Email Template** - Professional, mobile-responsive design  
✅ **Automatic Reports** - Can be scheduled weekly (manual for now)  

### Email Contains

- 📊 Weekly statistics (completion rate, surveys, mood tracking)
- 💡 Key insights about mood trends
- ✅ Personalized recommendations
- 🎨 Beautiful, branded design
- 📱 Mobile-responsive layout

## Testing Checklist

- [ ] Landing page loads and looks good
- [ ] "Get Started" button navigates to sign-in
- [ ] Back button on sign-in returns to landing page
- [ ] Sign up and set elder info with guardian email
- [ ] Complete at least one mood survey
- [ ] Go to Reports page
- [ ] Click "Send to Guardian"
- [ ] Verify email received (check spam folder)

## Troubleshooting

### Email Not Sending?

1. **Check Error Messages**: Look at the toast notification - it will tell you what's wrong
2. **Guardian Email Not Set**: Make sure elder profile has a valid guardian email
3. **API Key Missing**: Verify `RESEND_API_KEY` is set in Supabase environment variables
4. **Sandbox Mode**: If using Resend free tier, verify the recipient email in Resend dashboard

### Back Button Not Working?

This should be fixed now. If it still doesn't work:
1. Clear your browser cache
2. Reload the page
3. Check browser console for errors

## Free Tier Limits

**Resend Free Tier**:
- 3,000 emails/month
- 100 emails/day
- Perfect for testing and small deployments

## Need Help?

Check these files for more details:
- `/EMAIL_SETUP_GUIDE.md` - Detailed email configuration
- `/BACKEND_DOCUMENTATION.md` - API documentation
- Browser console - Look for error messages
- Supabase logs - View function execution logs
