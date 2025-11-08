# Email Setup Guide for Elder Mood Mirror

## Overview
Elder Mood Mirror now sends real weekly wellness reports to guardians via email using the Resend email service.

## How to Enable Email Sending

### Step 1: Get a Resend API Key

1. Go to [Resend](https://resend.com) and create a free account
2. Navigate to the API Keys section in your dashboard
3. Create a new API key
4. Copy the API key (it starts with `re_`)

### Step 2: Add the API Key to Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Project Settings** → **Edge Functions**
3. Scroll to **Environment Variables**
4. Add a new secret:
   - Name: `RESEND_API_KEY`
   - Value: Your Resend API key (e.g., `re_123abc...`)
5. Click **Save**

### Step 3: Configure Email Domain (Optional)

For production use, you should verify your own domain in Resend:

1. In Resend dashboard, go to **Domains**
2. Add your domain (e.g., `yourdomain.com`)
3. Follow the DNS configuration steps
4. Update the `from` address in the code from `noreply@eldermoodmirror.com` to `noreply@yourdomain.com`

**Note:** For testing, Resend allows you to send emails from their sandbox domain to email addresses you verify in your account.

### Step 4: Test Email Sending

1. Make sure you have set a guardian email in your elder profile
2. Go to the Reports page in the app
3. Click "Send to Guardian"
4. Check the guardian's email inbox (and spam folder)

## Email Features

The weekly report email includes:

- 📊 Weekly statistics (completion rate, surveys, camera checks)
- 💡 Key insights and mood trends
- ✅ Personalized recommendations
- 🎨 Beautiful HTML formatting optimized for email clients
- 📱 Mobile-responsive design

## Troubleshooting

### Email not sending?

1. **Check API Key**: Make sure `RESEND_API_KEY` is set correctly in Supabase environment variables
2. **Check Guardian Email**: Ensure the elder profile has a valid guardian email address
3. **Check Logs**: View Supabase Edge Function logs for error messages
4. **Verify Email**: In Resend's sandbox mode, you can only send to verified email addresses

### Still having issues?

Check the browser console and Supabase function logs for detailed error messages. The system will show user-friendly error messages if:
- Guardian email is not set
- API key is missing or invalid
- Email service is unreachable

## Free Tier Limits

Resend's free tier includes:
- 3,000 emails per month
- 100 emails per day
- This is more than enough for typical Elder Mood Mirror usage

## Production Deployment

For production:
1. Verify your own domain in Resend
2. Update the `from` email address in `/supabase/functions/server/index.tsx`
3. Consider upgrading Resend plan if you have many users
4. Set up proper email monitoring and deliverability tracking
