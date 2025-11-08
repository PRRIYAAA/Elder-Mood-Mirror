import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const baseUrl = `${supabaseUrl}/functions/v1/make-server-70d930de`;

// Create Supabase client for auth
export const supabase = createClient(supabaseUrl, publicAnonKey);

// Store the current session
let currentAccessToken: string | null = null;

// Get the current access token
export async function getAccessToken(): Promise<string | null> {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    currentAccessToken = null;
    return null;
  }
  currentAccessToken = session.access_token;
  return session.access_token;
}

// Helper function to make authenticated API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = await getAccessToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add authorization header if we have a token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    // Response is not JSON - might be an HTML error page
    const text = await response.text();
    console.error(`API error on ${endpoint}: Invalid JSON response`, text);
    throw new Error(`Invalid response from server on ${endpoint}`);
  }
  
  if (!response.ok) {
    console.error(`API error on ${endpoint}:`, data.error);
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

// ===================
// AUTH API
// ===================

export async function signUp(email: string, password: string, name: string, phone: string) {
  try {
    console.log('Starting signup process...');
    console.log('Base URL:', baseUrl);
    
    // First, create the user via our backend
    const signupUrl = `${baseUrl}/signup`;
    console.log('Signup URL:', signupUrl);
    
    const response = await fetch(signupUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}` // Use anon key for public endpoint
      },
      body: JSON.stringify({ email, password, name, phone }),
    });

    console.log('Response status:', response.status);
    
    let data;
    try {
      data = await response.json();
      console.log('Response data:', data);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      throw new Error('Invalid server response');
    }
    
    if (!response.ok) {
      console.error('Signup backend error:', data);
      throw new Error(data.error || `Signup failed with status ${response.status}`);
    }

    console.log('User created successfully, now signing in...');

    // Then sign in the user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error('Sign in error after signup:', signInError);
      throw signInError;
    }

    console.log('Sign in successful');

    return { 
      success: true, 
      userId: data.userId,
      session: signInData.session,
      user: signInData.user
    };
  } catch (error: any) {
    console.error('Signup error:', error.message || error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return { 
      success: true, 
      session: data.session,
      user: data.user
    };
  } catch (error: any) {
    console.error('Sign in error:', error.message);
    throw error;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
  currentAccessToken = null;
  return { success: true };
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return null;
  }
  return user;
}

// ===================
// USER PROFILE API
// ===================

export async function getUserProfile() {
  return apiCall('/user-profile', {
    method: 'GET',
  });
}

// ===================
// ELDER PROFILE API
// ===================

export async function saveElderInfo(elderInfo: any) {
  return apiCall('/elder-info', {
    method: 'POST',
    body: JSON.stringify(elderInfo),
  });
}

export async function getElderInfo() {
  return apiCall('/elder-info', {
    method: 'GET',
  });
}

// ===================
// MOOD SURVEY API
// ===================

export async function saveMoodSurvey(surveyData: any) {
  return apiCall('/mood-survey', {
    method: 'POST',
    body: JSON.stringify(surveyData),
  });
}

export async function getMoodSurveys(startDate?: string, endDate?: string) {
  let url = '/mood-surveys';
  const params = new URLSearchParams();
  
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  return apiCall(url, {
    method: 'GET',
  });
}

// ===================
// CAMERA MOOD API
// ===================

export async function saveCameraMood(moodData: any) {
  return apiCall('/camera-mood', {
    method: 'POST',
    body: JSON.stringify(moodData),
  });
}

export async function getCameraMoods(startDate?: string, endDate?: string) {
  let url = '/camera-moods';
  const params = new URLSearchParams();
  
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  return apiCall(url, {
    method: 'GET',
  });
}

// ===================
// COMPLETION STATUS API
// ===================

export async function getCompletionStatus(date?: string) {
  let url = '/completion-status';
  if (date) {
    url += `?date=${date}`;
  }

  return apiCall(url, {
    method: 'GET',
  });
}

// ===================
// WEEKLY REPORT API
// ===================

export async function getWeeklyReport() {
  return apiCall('/weekly-report', {
    method: 'GET',
  });
}

export async function sendWeeklyReport() {
  return apiCall('/send-weekly-report', {
    method: 'POST',
  });
}

// ===================
// HEALTH CHECK
// ===================

export async function healthCheck() {
  const response = await fetch(`${baseUrl}/health`);
  return response.json();
}

// ===================
// DOCTOR API
// ===================

export async function saveDoctorInfo(doctorInfo: any) {
  try {
    return await apiCall('/doctor-info', {
      method: 'POST',
      body: JSON.stringify(doctorInfo),
    });
  } catch (error: any) {
    // If endpoint doesn't exist yet, return a structured error
    console.warn('Save doctor info endpoint not available:', error.message);
    return { success: false, error: error.message };
  }
}

export async function getDoctorInfo() {
  try {
    return await apiCall('/doctor-info', {
      method: 'GET',
    });
  } catch (error: any) {
    // If endpoint doesn't exist yet, return a structured error
    console.warn('Doctor info endpoint not available:', error.message);
    return { success: false, error: error.message, doctorInfo: null };
  }
}

export async function getDoctorPatients() {
  return apiCall('/doctor-patients', {
    method: 'GET',
  });
}

export async function getPatientDetail(patientId: string) {
  return apiCall(`/patient-detail/${patientId}`, {
    method: 'GET',
  });
}

export async function addDoctorNote(patientId: string, note: string) {
  return apiCall('/doctor-note', {
    method: 'POST',
    body: JSON.stringify({ patientId, note }),
  });
}

export async function getDoctorAlerts() {
  return apiCall('/doctor-alerts', {
    method: 'GET',
  });
}

export async function sendMessageToGuardian(patientId: string, message: string) {
  return apiCall('/send-guardian-message', {
    method: 'POST',
    body: JSON.stringify({ patientId, message }),
  });
}

export async function getGuardianMessages(patientId: string) {
  return apiCall(`/guardian-messages/${patientId}`, {
    method: 'GET',
  });
}

export async function getDoctorConversations() {
  return apiCall('/doctor-conversations', {
    method: 'GET',
  });
}