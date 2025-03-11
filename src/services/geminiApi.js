import axios from "axios";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText";

const MAX_REQUESTS = 3;
const RESET_INTERVAL = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

// Generate or retrieve a unique device ID
const getDeviceId = () => {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = "device-" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
};

// Load request count and timestamp for this device
const getStoredData = () => {
  const deviceId = getDeviceId();
  const storedRequests = localStorage.getItem(`requestCount-${deviceId}`);
  const storedTimestamp = localStorage.getItem(`lastRequestTime-${deviceId}`);

  return {
    requestCount: storedRequests ? parseInt(storedRequests) : 0,
    lastRequestTime: storedTimestamp ? parseInt(storedTimestamp) : Date.now(),
    deviceId,
  };
};

// Save request data for this device
const saveRequestData = (count) => {
  const { deviceId } = getStoredData();
  localStorage.setItem(`requestCount-${deviceId}`, count);
  localStorage.setItem(`lastRequestTime-${deviceId}`, Date.now());
};

// Check if input is spam (too short or common words)
const isSpam = (input) => {
  const trimmed = input.trim().toLowerCase();
  return trimmed.length < 15 || ["hi", "hello", "test"].includes(trimmed);
};

// Reset request count every 3 hours
setInterval(() => {
  const { deviceId } = getStoredData();
  localStorage.setItem(`requestCount-${deviceId}`, 0);
  localStorage.setItem(`lastRequestTime-${deviceId}`, Date.now());
}, RESET_INTERVAL);

export const getSymptomAnalysis = async (userInput) => {
  const { requestCount, lastRequestTime, deviceId } = getStoredData();

  if (Date.now() - lastRequestTime > RESET_INTERVAL) {
    localStorage.setItem(`requestCount-${deviceId}`, 0);
    localStorage.setItem(`lastRequestTime-${deviceId}`, Date.now());
  }

  if (isSpam(userInput)) {
    return "Please enter a valid symptom. Try describing what you're feeling.";
  }

  if (requestCount >= MAX_REQUESTS) {
    return `
      You've reached your limit for now. 
      Need immediate help? Consult a Doctor.
    `;
  }

  try {
    saveRequestData(requestCount + 1); // Increase request count

    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        prompt: {
          text: `User reports: ${userInput}. Provide three possible conditions along with simple, reassuring explanations.`
        }
      }
    );

    return response.data.candidates[0].output;
  } catch (error) {
    console.error("API Error:", error);
    return `
      We're currently down for maintenance. Please try again later. 
      Need help? Consult a Doctor.
    `;
  }
};
