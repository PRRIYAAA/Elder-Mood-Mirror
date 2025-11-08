# Elder Mood Mirror - Backend Documentation

## Overview

The Elder Mood Mirror backend is implemented using Supabase Edge Functions with a Hono web server. The backend handles authentication, data storage, and provides API endpoints for the mobile app.

## Architecture

- **Frontend**: React mobile app
- **Backend**: Supabase Edge Functions (Hono server)
- **Database**: Supabase KV Store
- **Authentication**: Supabase Auth

## Backend Endpoints

### Base URL
```
https://${projectId}.supabase.co/functions/v1/make-server-70d930de
```

### Authentication Endpoints

#### POST /signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "phone": "123-456-7890"
}
```

**Response:**
```json
{
  "success": true,
  "userId": "uuid",
  "message": "User created successfully"
}
```

**Note:** After signup, users are automatically confirmed and can sign in immediately.

### Elder Profile Endpoints

#### POST /elder-info
Save or update elder profile information (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "age": "72",
  "gender": "Male",
  "bloodGroup": "O+",
  "disability": "None",
  "medicalConditions": ["High Blood Pressure (BP)", "Diabetes"],
  "otherConditions": "Seasonal allergies",
  "currentMedications": "Metformin 500mg twice daily",
  "tabletName": "Metformin",
  "tabletFrequency": "Twice a day",
  "medicationNotes": "Take with meals",
  "guardianName": "Jane Doe",
  "guardianEmail": "jane@example.com",
  "guardianPhone": "123-456-7891",
  "clinicEmail": "doctor@clinic.com",
  "emergencyContact": "911"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Elder information saved successfully"
}
```

#### GET /elder-info
Retrieve elder profile information (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "elderInfo": { /* elder profile data */ },
  "basicInfo": {
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "123-456-7890"
  }
}
```

### Mood Survey Endpoints

#### POST /mood-survey
Save daily mood survey responses (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "overall_mood": "happy",
  "energy_level": 7,
  "physical_comfort": "good",
  "sleep_quality": "excellent",
  "appetite": "good",
  "social_interaction": "somewhat-interested",
  "medication_taken": "all-on-time",
  "additional_notes": "Had a great day today!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mood survey saved successfully",
  "completionStatus": {
    "surveyCompleted": true,
    "cameraCompleted": false
  }
}
```

#### GET /mood-surveys
Retrieve mood surveys for a date range (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `startDate` (optional): YYYY-MM-DD format
- `endDate` (optional): YYYY-MM-DD format

**Response:**
```json
{
  "success": true,
  "surveys": [
    {
      "overall_mood": "happy",
      "energy_level": 7,
      "date": "2025-11-07",
      "completedAt": "2025-11-07T10:30:00Z"
    }
  ]
}
```

### Camera Mood Detection Endpoints

#### POST /camera-mood
Save camera mood detection data (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "primaryMood": "Happy",
  "confidence": 87,
  "emotions": {
    "happiness": 87,
    "contentment": 8,
    "neutral": 3,
    "concern": 2
  },
  "stress_level": "Low",
  "method": "camera"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Camera mood detection saved successfully",
  "completionStatus": {
    "surveyCompleted": false,
    "cameraCompleted": true
  }
}
```

#### GET /camera-moods
Retrieve camera mood detections for a date range (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `startDate` (optional): YYYY-MM-DD format
- `endDate` (optional): YYYY-MM-DD format

**Response:**
```json
{
  "success": true,
  "cameraMoods": [
    {
      "primaryMood": "Happy",
      "confidence": 87,
      "date": "2025-11-07",
      "completedAt": "2025-11-07T14:30:00Z"
    }
  ]
}
```

### Completion Status Endpoints

#### GET /completion-status
Check if user has completed daily tasks (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `date` (optional): YYYY-MM-DD format (defaults to today)

**Response:**
```json
{
  "success": true,
  "completionStatus": {
    "surveyCompleted": true,
    "cameraCompleted": true,
    "surveyCompletedAt": "2025-11-07T10:30:00Z",
    "cameraCompletedAt": "2025-11-07T14:30:00Z"
  },
  "date": "2025-11-07"
}
```

### Weekly Report Endpoints

#### GET /weekly-report
Generate weekly mood report data (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "reportData": {
    "elderName": "John Doe",
    "elderEmail": "user@example.com",
    "guardianEmail": "jane@example.com",
    "guardianName": "Jane Doe",
    "weekStart": "2025-11-04",
    "weekEnd": "2025-11-10",
    "statistics": {
      "totalDays": 7,
      "surveysCompleted": 5,
      "cameraMoodsCompleted": 5,
      "completionRate": "71",
      "averageEnergyLevel": "7.2",
      "dominantMood": "happy",
      "dominantCameraMood": "Happy"
    },
    "surveys": [ /* array of survey data */ ],
    "cameraMoods": [ /* array of camera mood data */ ],
    "elderInfo": { /* elder profile */ }
  }
}
```

#### POST /send-weekly-report
Manually trigger sending weekly report email (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Weekly report email would be sent (email service not configured)",
  "reportData": { /* report data */ }
}
```

**Note:** Email functionality is prepared but requires email service integration (e.g., SendGrid, AWS SES).

### Health Check

#### GET /health
Check if the server is running.

**Response:**
```json
{
  "status": "ok"
}
```

## Data Storage Structure

The backend uses Supabase KV store with the following key patterns:

### User Data
- `user:{userId}:basic` - Basic user information (email, name, phone)
- `user:{userId}:profile` - Elder profile information

### Daily Data
- `user:{userId}:survey:{date}` - Daily mood survey (YYYY-MM-DD)
- `user:{userId}:camera:{date}` - Daily camera mood detection (YYYY-MM-DD)
- `user:{userId}:completion:{date}` - Daily completion status (YYYY-MM-DD)

### Reports
- `user:{userId}:report:{date}` - Weekly report sent records (date = week end date)

## Frontend API Usage

The frontend uses the `/utils/api.ts` file to interact with the backend:

```typescript
import { signUp, signIn, saveElderInfo, saveMoodSurvey, saveCameraMood } from './utils/api';

// Sign up
await signUp(email, password, name, phone);

// Sign in
await signIn(email, password);

// Save elder info
await saveElderInfo(elderInfoData);

// Save mood survey
await saveMoodSurvey(surveyData);

// Save camera mood
await saveCameraMood(moodData);

// Get completion status
const { completionStatus } = await getCompletionStatus();

// Get weekly report
const { reportData } = await getWeeklyReport();
```

## Authentication Flow

1. **Sign Up**: 
   - User provides email, password, name, and phone
   - Backend creates user with Supabase Auth
   - User is automatically confirmed (no email verification needed)
   - Frontend signs in the user automatically

2. **Sign In**:
   - User provides email and password
   - Frontend calls Supabase Auth directly
   - Access token is stored and used for all subsequent requests

3. **Authenticated Requests**:
   - All protected endpoints require `Authorization: Bearer <access_token>` header
   - Backend verifies token and extracts user ID
   - User can only access their own data

## Future Enhancements

1. **Email Integration**:
   - Integrate with email service (SendGrid, AWS SES) to send weekly reports
   - Set up automated cron job to send reports every Monday

2. **Analytics**:
   - Add endpoints for mood trend analysis
   - Generate insights and recommendations based on historical data

3. **Notifications**:
   - Push notifications for daily reminders
   - Alert caregivers if concerning patterns are detected

4. **Data Export**:
   - Allow users to export their data in CSV or PDF format
   - Generate comprehensive health reports

5. **Multi-language Support**:
   - Add support for multiple languages in reports and notifications

## Security Considerations

- All sensitive data is stored securely in Supabase
- Access tokens are required for all authenticated endpoints
- User data is isolated by user ID
- Passwords are hashed by Supabase Auth
- CORS is configured to allow requests from the app

## Error Handling

All endpoints return standardized error responses:

```json
{
  "error": "Error message describing what went wrong"
}
```

HTTP status codes:
- 200: Success
- 400: Bad request (missing or invalid parameters)
- 401: Unauthorized (invalid or missing token)
- 500: Internal server error

## Development

### Testing the Backend

You can test the backend using curl:

```bash
# Health check
curl https://${projectId}.supabase.co/functions/v1/make-server-70d930de/health

# Sign up
curl -X POST https://${projectId}.supabase.co/functions/v1/make-server-70d930de/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User","phone":"123-456-7890"}'

# Get elder info (requires auth token)
curl https://${projectId}.supabase.co/functions/v1/make-server-70d930de/elder-info \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Debugging

The server logs all requests and errors to console. Check the Supabase Edge Function logs for debugging information.

## Support

For questions or issues, please refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Hono Documentation](https://hono.dev)
