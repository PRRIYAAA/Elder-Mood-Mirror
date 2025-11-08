import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Initialize Supabase Client for auth
const getSupabaseClient = () => createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!
);

// Helper function to verify user authentication
async function verifyAuth(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'No authorization header', userId: null };
  }

  const accessToken = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
  
  if (error || !user) {
    return { error: 'Unauthorized', userId: null };
  }

  return { error: null, userId: user.id };
}

// Helper function to get today's date in YYYY-MM-DD format
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Helper function to get week start date (Monday)
function getWeekStartDate(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

// Health check endpoint
app.get("/make-server-70d930de/health", (c) => {
  return c.json({ status: "ok" });
});

// ===================
// AUTHENTICATION ROUTES
// ===================

// Sign up endpoint
app.post("/make-server-70d930de/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, phone } = body;

    if (!email || !password || !name || !phone) {
      return c.json({ error: 'Missing required fields: email, password, name, phone' }, 400);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, phone },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: `Failed to create user: ${error.message}` }, 400);
    }

    if (!data.user) {
      return c.json({ error: 'User creation failed' }, 500);
    }

    // Store basic user info in KV
    await kv.set(`user:${data.user.id}:basic`, {
      email,
      name,
      phone,
      createdAt: new Date().toISOString()
    });

    return c.json({ 
      success: true, 
      userId: data.user.id,
      message: 'User created successfully'
    });

  } catch (error: any) {
    console.log(`Error during signup: ${error.message}`);
    return c.json({ error: `Signup failed: ${error.message}` }, 500);
  }
});

// ===================
// ELDER PROFILE ROUTES
// ===================

// Save elder profile information
app.post("/make-server-70d930de/elder-info", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, userId } = await verifyAuth(authHeader);

    if (authError || !userId) {
      return c.json({ error: authError || 'Unauthorized' }, 401);
    }

    const elderInfo = await c.req.json();

    // Save elder info to KV store with role marker
    await kv.set(`user:${userId}:profile`, {
      ...elderInfo,
      role: 'elder',
      updatedAt: new Date().toISOString()
    });

    console.log(`Elder profile saved for user ${userId}`);

    return c.json({ 
      success: true, 
      message: 'Elder information saved successfully'
    });

  } catch (error: any) {
    console.log(`Error saving elder info: ${error.message}`);
    return c.json({ error: `Failed to save elder info: ${error.message}` }, 500);
  }
});

// Get elder profile information
app.get("/make-server-70d930de/elder-info", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, userId } = await verifyAuth(authHeader);

    if (authError || !userId) {
      return c.json({ error: authError || 'Unauthorized' }, 401);
    }

    let elderInfo = await kv.get(`user:${userId}:profile`);
    
    // Only return if it's actually an elder profile (or legacy profile without role)
    if (elderInfo && elderInfo.role && elderInfo.role !== 'elder') {
      elderInfo = null; // This user is not an elder
    }
    
    const basicInfo = await kv.get(`user:${userId}:basic`);

    return c.json({ 
      success: true, 
      elderInfo: elderInfo || null,
      basicInfo: basicInfo || null
    });

  } catch (error: any) {
    console.log(`Error fetching elder info: ${error.message}`);
    return c.json({ error: `Failed to fetch elder info: ${error.message}` }, 500);
  }
});

// ===================
// DOCTOR PROFILE ROUTES
// ===================

// Save doctor profile information
app.post("/make-server-70d930de/doctor-info", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, userId } = await verifyAuth(authHeader);

    if (authError || !userId) {
      return c.json({ error: authError || 'Unauthorized' }, 401);
    }

    const doctorInfo = await c.req.json();

    // Save doctor info to KV store with role marker
    await kv.set(`user:${userId}:profile`, {
      ...doctorInfo,
      role: 'doctor',
      updatedAt: new Date().toISOString()
    });

    // Also save to doctor-specific key for backwards compatibility
    await kv.set(`user:${userId}:doctorInfo`, {
      ...doctorInfo,
      updatedAt: new Date().toISOString()
    });

    console.log(`Doctor profile saved for user ${userId}`);

    return c.json({ 
      success: true, 
      message: 'Doctor information saved successfully'
    });

  } catch (error: any) {
    console.log(`Error saving doctor info: ${error.message}`);
    return c.json({ error: `Failed to save doctor info: ${error.message}` }, 500);
  }
});

// Get doctor profile information
app.get("/make-server-70d930de/doctor-info", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, userId } = await verifyAuth(authHeader);

    if (authError || !userId) {
      return c.json({ error: authError || 'Unauthorized' }, 401);
    }

    // Try to get from main profile first
    let doctorInfo = await kv.get(`user:${userId}:profile`);
    
    // If not found or not a doctor profile, try doctor-specific key
    if (!doctorInfo || doctorInfo.role !== 'doctor') {
      doctorInfo = await kv.get(`user:${userId}:doctorInfo`);
    }
    
    const basicInfo = await kv.get(`user:${userId}:basic`);

    return c.json({ 
      success: true, 
      doctorInfo: doctorInfo || null,
      basicInfo: basicInfo || null
    });

  } catch (error: any) {
    console.log(`Error fetching doctor info: ${error.message}`);
    return c.json({ error: `Failed to fetch doctor info: ${error.message}` }, 500);
  }
});

// ===================
// USER PROFILE ROUTES
// ===================

// Get user profile (checks for both elder and doctor profiles)
app.get("/make-server-70d930de/user-profile", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, userId } = await verifyAuth(authHeader);

    if (authError || !userId) {
      return c.json({ error: authError || 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:${userId}:profile`);
    const basicInfo = await kv.get(`user:${userId}:basic`);

    // Determine role from profile
    let role = null;
    let hasProfile = false;

    if (profile) {
      hasProfile = true;
      role = profile.role || 'elder'; // Default to elder for legacy profiles
    }

    return c.json({ 
      success: true,
      hasProfile,
      role,
      profile: profile || null,
      basicInfo: basicInfo || null
    });

  } catch (error: any) {
    console.log(`Error fetching user profile: ${error.message}`);
    return c.json({ error: `Failed to fetch user profile: ${error.message}` }, 500);
  }
});

// ===================
// MOOD SURVEY ROUTES
// ===================

// Save daily mood survey
app.post("/make-server-70d930de/mood-survey", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, userId } = await verifyAuth(authHeader);

    if (authError || !userId) {
      return c.json({ error: authError || 'Unauthorized' }, 401);
    }

    const surveyData = await c.req.json();
    const today = getTodayDate();

    // Save survey data
    await kv.set(`user:${userId}:survey:${today}`, {
      ...surveyData,
      completedAt: new Date().toISOString(),
      date: today
    });

    // Update completion status
    const completionKey = `user:${userId}:completion:${today}`;
    const currentStatus = await kv.get(completionKey) || { surveyCompleted: false, cameraCompleted: false };
    await kv.set(completionKey, {
      ...currentStatus,
      surveyCompleted: true,
      surveyCompletedAt: new Date().toISOString()
    });

    console.log(`Mood survey saved for user ${userId} on ${today}`);

    return c.json({ 
      success: true, 
      message: 'Mood survey saved successfully',
      completionStatus: {
        ...currentStatus,
        surveyCompleted: true
      }
    });

  } catch (error: any) {
    console.log(`Error saving mood survey: ${error.message}`);
    return c.json({ error: `Failed to save mood survey: ${error.message}` }, 500);
  }
});

// Get mood surveys for a date range
app.get("/make-server-70d930de/mood-surveys", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, userId } = await verifyAuth(authHeader);

    if (authError || !userId) {
      return c.json({ error: authError || 'Unauthorized' }, 401);
    }

    const startDate = c.req.query('startDate');
    const endDate = c.req.query('endDate') || getTodayDate();

    // Get surveys by prefix
    const prefix = `user:${userId}:survey:`;
    const surveys = await kv.getByPrefix(prefix);

    // Filter by date range if specified
    let filteredSurveys = surveys;
    if (startDate) {
      filteredSurveys = surveys.filter((survey: any) => {
        const surveyDate = survey.date;
        return surveyDate >= startDate && surveyDate <= endDate;
      });
    }

    return c.json({ 
      success: true, 
      surveys: filteredSurveys || []
    });

  } catch (error: any) {
    console.log(`Error fetching mood surveys: ${error.message}`);
    return c.json({ error: `Failed to fetch mood surveys: ${error.message}` }, 500);
  }
});

// ===================
// CAMERA MOOD ROUTES
// ===================

// Save camera mood detection
app.post("/make-server-70d930de/camera-mood", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, userId } = await verifyAuth(authHeader);

    if (authError || !userId) {
      return c.json({ error: authError || 'Unauthorized' }, 401);
    }

    const moodData = await c.req.json();
    const today = getTodayDate();

    // Save camera mood data
    await kv.set(`user:${userId}:camera:${today}`, {
      ...moodData,
      completedAt: new Date().toISOString(),
      date: today
    });

    // Update completion status
    const completionKey = `user:${userId}:completion:${today}`;
    const currentStatus = await kv.get(completionKey) || { surveyCompleted: false, cameraCompleted: false };
    await kv.set(completionKey, {
      ...currentStatus,
      cameraCompleted: true,
      cameraCompletedAt: new Date().toISOString()
    });

    console.log(`Camera mood saved for user ${userId} on ${today}`);

    return c.json({ 
      success: true, 
      message: 'Camera mood detection saved successfully',
      completionStatus: {
        ...currentStatus,
        cameraCompleted: true
      }
    });

  } catch (error: any) {
    console.log(`Error saving camera mood: ${error.message}`);
    return c.json({ error: `Failed to save camera mood: ${error.message}` }, 500);
  }
});

// Get camera mood detections for a date range
app.get("/make-server-70d930de/camera-moods", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, userId } = await verifyAuth(authHeader);

    if (authError || !userId) {
      return c.json({ error: authError || 'Unauthorized' }, 401);
    }

    const startDate = c.req.query('startDate');
    const endDate = c.req.query('endDate') || getTodayDate();

    // Get camera moods by prefix
    const prefix = `user:${userId}:camera:`;
    const moods = await kv.getByPrefix(prefix);

    // Filter by date range if specified
    let filteredMoods = moods;
    if (startDate) {
      filteredMoods = moods.filter((mood: any) => {
        const moodDate = mood.date;
        return moodDate >= startDate && moodDate <= endDate;
      });
    }

    return c.json({ 
      success: true, 
      cameraMoods: filteredMoods || []
    });

  } catch (error: any) {
    console.log(`Error fetching camera moods: ${error.message}`);
    return c.json({ error: `Failed to fetch camera moods: ${error.message}` }, 500);
  }
});

// ===================
// COMPLETION STATUS ROUTES
// ===================

// Get today's completion status
app.get("/make-server-70d930de/completion-status", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, userId } = await verifyAuth(authHeader);

    if (authError || !userId) {
      return c.json({ error: authError || 'Unauthorized' }, 401);
    }

    const date = c.req.query('date') || getTodayDate();
    const completionKey = `user:${userId}:completion:${date}`;
    const status = await kv.get(completionKey);

    return c.json({ 
      success: true, 
      completionStatus: status || { surveyCompleted: false, cameraCompleted: false },
      date
    });

  } catch (error: any) {
    console.log(`Error fetching completion status: ${error.message}`);
    return c.json({ error: `Failed to fetch completion status: ${error.message}` }, 500);
  }
});

// ===================
// WEEKLY REPORT ROUTES
// ===================

// Generate weekly report data
app.get("/make-server-70d930de/weekly-report", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, userId } = await verifyAuth(authHeader);

    if (authError || !userId) {
      return c.json({ error: authError || 'Unauthorized' }, 401);
    }

    // Get date range for this week
    const endDate = getTodayDate();
    const startDate = getWeekStartDate();

    // Get user profile and elder info
    const basicInfo = await kv.get(`user:${userId}:basic`);
    const elderInfo = await kv.get(`user:${userId}:profile`);

    // Get all surveys for this week
    const surveyPrefix = `user:${userId}:survey:`;
    const allSurveys = await kv.getByPrefix(surveyPrefix);
    const weekSurveys = allSurveys.filter((survey: any) => 
      survey.date >= startDate && survey.date <= endDate
    );

    // Get all camera moods for this week
    const cameraPrefix = `user:${userId}:camera:`;
    const allCameraMoods = await kv.getByPrefix(cameraPrefix);
    const weekCameraMoods = allCameraMoods.filter((mood: any) => 
      mood.date >= startDate && mood.date <= endDate
    );

    // Calculate weekly statistics
    const stats = {
      totalDays: 7,
      surveysCompleted: weekSurveys.length,
      cameraMoodsCompleted: weekCameraMoods.length,
      completionRate: ((weekSurveys.length + weekCameraMoods.length) / 14 * 100).toFixed(0),
      averageEnergyLevel: weekSurveys.length > 0 
        ? (weekSurveys.reduce((sum: number, s: any) => sum + (s.energy_level || 0), 0) / weekSurveys.length).toFixed(1)
        : 0,
      dominantMood: calculateDominantMood(weekSurveys),
      dominantCameraMood: calculateDominantCameraMood(weekCameraMoods)
    };

    return c.json({ 
      success: true,
      reportData: {
        elderName: basicInfo?.name || 'Unknown',
        elderEmail: basicInfo?.email || '',
        guardianEmail: elderInfo?.guardianEmail || '',
        guardianName: elderInfo?.guardianName || '',
        weekStart: startDate,
        weekEnd: endDate,
        statistics: stats,
        surveys: weekSurveys,
        cameraMoods: weekCameraMoods,
        elderInfo
      }
    });

  } catch (error: any) {
    console.log(`Error generating weekly report: ${error.message}`);
    return c.json({ error: `Failed to generate weekly report: ${error.message}` }, 500);
  }
});

// Send weekly report email (this would integrate with an email service)
app.post("/make-server-70d930de/send-weekly-report", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, userId } = await verifyAuth(authHeader);

    if (authError || !userId) {
      return c.json({ error: authError || 'Unauthorized' }, 401);
    }

    // Get the weekly report data directly instead of making HTTP call
    // Get date range for this week
    const endDate = getTodayDate();
    const startDate = getWeekStartDate();

    // Get user profile and elder info
    const basicInfo = await kv.get(`user:${userId}:basic`);
    const elderInfo = await kv.get(`user:${userId}:profile`);

    // Get all surveys for this week
    const surveyPrefix = `user:${userId}:survey:`;
    const allSurveys = await kv.getByPrefix(surveyPrefix);
    const weekSurveys = allSurveys.filter((survey: any) => 
      survey.date >= startDate && survey.date <= endDate
    );

    // Get all camera moods for this week
    const cameraPrefix = `user:${userId}:camera:`;
    const allCameraMoods = await kv.getByPrefix(cameraPrefix);
    const weekCameraMoods = allCameraMoods.filter((mood: any) => 
      mood.date >= startDate && mood.date <= endDate
    );

    // Calculate weekly statistics
    const stats = {
      totalDays: 7,
      surveysCompleted: weekSurveys.length,
      cameraMoodsCompleted: weekCameraMoods.length,
      completionRate: ((weekSurveys.length + weekCameraMoods.length) / 14 * 100).toFixed(0),
      averageEnergyLevel: weekSurveys.length > 0 
        ? (weekSurveys.reduce((sum: number, s: any) => sum + (s.energy_level || 0), 0) / weekSurveys.length).toFixed(1)
        : 0,
      dominantMood: calculateDominantMood(weekSurveys),
      dominantCameraMood: calculateDominantCameraMood(weekCameraMoods)
    };

    const data = {
      elderName: basicInfo?.name || 'Unknown',
      elderEmail: basicInfo?.email || '',
      guardianEmail: elderInfo?.guardianEmail || '',
      guardianName: elderInfo?.guardianName || '',
      weekStart: startDate,
      weekEnd: endDate,
      statistics: stats,
      surveys: weekSurveys,
      cameraMoods: weekCameraMoods,
      elderInfo
    };

    // Check if guardian email exists
    if (!data.guardianEmail) {
      return c.json({ 
        success: false, 
        error: 'Guardian email not set. Please update your profile with guardian email address.' 
      }, 400);
    }

    // Send actual email using Resend
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    if (!RESEND_API_KEY) {
      console.log('Warning: RESEND_API_KEY not configured. Email will not be sent.');
      console.log(`Weekly report would be sent to: ${data.guardianEmail}`);
      console.log(`Report for: ${data.elderName} (${data.weekStart} to ${data.weekEnd})`);
      
      // Store that we attempted the report
      const reportKey = `user:${userId}:report:${data.weekEnd}`;
      await kv.set(reportKey, {
        sentAt: new Date().toISOString(),
        guardianEmail: data.guardianEmail,
        weekStart: data.weekStart,
        weekEnd: data.weekEnd,
        statistics: data.statistics
      });

      return c.json({ 
        success: true, 
        message: 'Email service not configured. Please set RESEND_API_KEY environment variable.',
        reportData: data
      });
    }

    // Create email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Wellness Report</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #16a34a 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">🧠 Elder Mood Mirror</h1>
              <p style="margin: 10px 0 0 0; color: #e0f2fe; font-size: 16px;">Weekly Wellness Report</p>
            </td>
          </tr>

          <!-- Report Period -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 22px;">Hello ${data.guardianName || 'Guardian'},</h2>
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                This is the weekly wellness report for <strong>${data.elderName}</strong> for the period 
                <strong>${data.weekStart}</strong> to <strong>${data.weekEnd}</strong>.
              </p>

              <!-- Statistics -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                <tr>
                  <td style="background-color: #dbeafe; padding: 20px; border-radius: 8px;">
                    <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">📊 Weekly Summary</h3>
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #374151; font-size: 15px;">Completion Rate:</td>
                        <td style="color: #1f2937; font-size: 15px; font-weight: bold; text-align: right;">${data.statistics.completionRate}%</td>
                      </tr>
                      <tr>
                        <td style="color: #374151; font-size: 15px;">Surveys Completed:</td>
                        <td style="color: #1f2937; font-size: 15px; font-weight: bold; text-align: right;">${data.statistics.surveysCompleted} / ${data.statistics.totalDays}</td>
                      </tr>
                      <tr>
                        <td style="color: #374151; font-size: 15px;">Camera Checks:</td>
                        <td style="color: #1f2937; font-size: 15px; font-weight: bold; text-align: right;">${data.statistics.cameraMoodsCompleted} / ${data.statistics.totalDays}</td>
                      </tr>
                      <tr>
                        <td style="color: #374151; font-size: 15px;">Average Energy Level:</td>
                        <td style="color: #1f2937; font-size: 15px; font-weight: bold; text-align: right;">${data.statistics.averageEnergyLevel} / 5</td>
                      </tr>
                      <tr>
                        <td style="color: #374151; font-size: 15px;">Dominant Mood:</td>
                        <td style="color: #1f2937; font-size: 15px; font-weight: bold; text-align: right;">${data.statistics.dominantMood}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Key Insights -->
              <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 18px;">💡 Key Insights</h3>
                <p style="margin: 0; color: #78350f; font-size: 15px; line-height: 1.5;">
                  ${data.elderName} has shown ${
                    parseInt(data.statistics.completionRate) >= 80 ? 'excellent' : 
                    parseInt(data.statistics.completionRate) >= 60 ? 'good' : 'moderate'
                  } engagement this week with a completion rate of ${data.statistics.completionRate}%. 
                  ${data.statistics.dominantMood !== 'No data' ? `The overall mood trend has been "${data.statistics.dominantMood}".` : ''}
                </p>
              </div>

              <!-- Action Items -->
              <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; border-left: 4px solid #16a34a; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; color: #14532d; font-size: 18px;">✅ Recommendations</h3>
                <ul style="margin: 0; padding-left: 20px; color: #166534; font-size: 15px; line-height: 1.8;">
                  <li>Continue encouraging daily mood tracking for better insights</li>
                  <li>Reach out if ${data.elderName} needs support or assistance</li>
                  <li>Monitor any significant changes in mood patterns</li>
                  ${parseInt(data.statistics.completionRate) < 60 ? '<li><strong>Consider checking in - completion rate is lower than usual</strong></li>' : ''}
                </ul>
              </div>

              <!-- Footer Message -->
              <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                For detailed analytics and full history, please log in to the Elder Mood Mirror dashboard.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 13px;">
                Elder Mood Mirror - Reflecting Care, Restoring Smiles<br>
                This is an automated weekly report. Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Send email via Resend
    try {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Elder Mood Mirror <noreply@eldermoodmirror.com>',
          to: [data.guardianEmail],
          subject: `Weekly Wellness Report for ${data.elderName} (${data.weekStart} to ${data.weekEnd})`,
          html: emailHtml
        })
      });

      const emailResult = await emailResponse.json();

      if (!emailResponse.ok) {
        console.error('Resend API error:', emailResult);
        throw new Error(emailResult.message || 'Failed to send email');
      }

      console.log(`Email sent successfully to ${data.guardianEmail}. Email ID: ${emailResult.id}`);
      
      // Store that we sent the report
      const reportKey = `user:${userId}:report:${data.weekEnd}`;
      await kv.set(reportKey, {
        sentAt: new Date().toISOString(),
        guardianEmail: data.guardianEmail,
        weekStart: data.weekStart,
        weekEnd: data.weekEnd,
        statistics: data.statistics,
        emailId: emailResult.id
      });

      return c.json({ 
        success: true, 
        message: `Weekly report email sent successfully to ${data.guardianEmail}`,
        reportData: data,
        emailId: emailResult.id
      });

    } catch (emailError: any) {
      console.error('Error sending email:', emailError);
      return c.json({ 
        success: false, 
        error: `Failed to send email: ${emailError.message}`,
        reportData: data
      }, 500);
    }

  } catch (error: any) {
    console.log(`Error sending weekly report: ${error.message}`);
    return c.json({ error: `Failed to send weekly report: ${error.message}` }, 500);
  }
});

// ===================
// GUARDIAN MESSAGING ROUTES
// ===================

// Send message to guardian
app.post("/make-server-70d930de/send-guardian-message", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error, userId } = await verifyAuth(authHeader);

    if (error || !userId) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { patientId, message } = body;

    if (!patientId || !message) {
      return c.json({ error: 'Missing required fields: patientId, message' }, 400);
    }

    // Get patient's guardian email
    const patientInfoKey = `user:${patientId}:elderInfo`;
    const patientInfo = await kv.get(patientInfoKey);

    if (!patientInfo || !patientInfo.guardianEmail) {
      return c.json({ error: 'Guardian email not found for this patient' }, 404);
    }

    // Store message
    const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const messageKey = `message:${patientId}:${messageId}`;
    const messageData = {
      id: messageId,
      patientId,
      senderId: userId,
      senderType: 'doctor',
      content: message,
      createdAt: new Date().toISOString(),
      read: false
    };

    await kv.set(messageKey, messageData);

    // Add to conversation index
    const conversationKey = `conversation:${patientId}:messages`;
    const existingMessages = await kv.get(conversationKey) || [];
    existingMessages.push(messageId);
    await kv.set(conversationKey, existingMessages);

    // Send email notification to guardian (if RESEND_API_KEY is configured)
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const doctorInfoKey = `user:${userId}:doctorInfo`;
    const doctorInfo = await kv.get(doctorInfoKey);
    const doctorName = doctorInfo?.specialty ? `Dr. ${doctorInfo.specialty}` : 'Your Doctor';

    if (RESEND_API_KEY) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: 'Elder Mood Mirror <noreply@eldersmoodmirror.com>',
            to: [patientInfo.guardianEmail],
            subject: `New message from ${doctorName}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">New Message from ${doctorName}</h2>
                <p>Regarding patient: ${patientInfo.name || 'Your loved one'}</p>
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0;">${message}</p>
                </div>
                <p style="color: #6b7280; font-size: 14px;">
                  This message was sent through the Elder Mood Mirror doctor portal.
                </p>
              </div>
            `
          })
        });

        if (!emailResponse.ok) {
          console.error('Failed to send email notification');
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
      }
    }

    return c.json({ 
      success: true, 
      message: 'Message sent successfully',
      messageId 
    });

  } catch (error: any) {
    console.log(`Error sending message: ${error.message}`);
    return c.json({ error: `Failed to send message: ${error.message}` }, 500);
  }
});

// Get messages for a conversation
app.get("/make-server-70d930de/guardian-messages/:patientId", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error, userId } = await verifyAuth(authHeader);

    if (error || !userId) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }

    const patientId = c.req.param('patientId');
    const conversationKey = `conversation:${patientId}:messages`;
    const messageIds = await kv.get(conversationKey) || [];

    const messages = [];
    for (const messageId of messageIds) {
      const messageKey = `message:${patientId}:${messageId}`;
      const message = await kv.get(messageKey);
      if (message) {
        messages.push(message);
      }
    }

    return c.json({ 
      success: true, 
      messages: messages.sort((a: any, b: any) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    });

  } catch (error: any) {
    console.log(`Error fetching messages: ${error.message}`);
    return c.json({ error: `Failed to fetch messages: ${error.message}` }, 500);
  }
});

// ===================
// HELPER FUNCTIONS
// ===================

function calculateDominantMood(surveys: any[]): string {
  if (surveys.length === 0) return 'No data';
  
  const moodCounts: { [key: string]: number } = {};
  
  surveys.forEach((survey: any) => {
    const mood = survey.overall_mood;
    if (mood) {
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    }
  });

  let dominantMood = 'neutral';
  let maxCount = 0;
  
  for (const [mood, count] of Object.entries(moodCounts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantMood = mood;
    }
  }

  return dominantMood;
}

function calculateDominantCameraMood(cameraMoods: any[]): string {
  if (cameraMoods.length === 0) return 'No data';
  
  const moodCounts: { [key: string]: number } = {};
  
  cameraMoods.forEach((mood: any) => {
    const primaryMood = mood.primaryMood;
    if (primaryMood) {
      moodCounts[primaryMood] = (moodCounts[primaryMood] || 0) + 1;
    }
  });

  let dominantMood = 'neutral';
  let maxCount = 0;
  
  for (const [mood, count] of Object.entries(moodCounts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantMood = mood;
    }
  }

  return dominantMood;
}

Deno.serve(app.fetch);