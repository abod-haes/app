import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

// Function to get API base URL
const getApiBaseUrl = () => {
  // Check if environment variable is set
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }

  // Check if we're on Vercel (production) by checking hostname
  // Use relative URLs so requests go through Vercel serverless function
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // If on Vercel or production domain, use relative URLs
    if (
      hostname.includes("vercel.app") ||
      hostname.includes("vercel.com") ||
      process.env.NODE_ENV === "production"
    ) {
      return ""; // Empty string = relative URLs (same origin)
    }
  } else if (process.env.NODE_ENV === "production") {
    // Server-side: use relative URLs in production
    return "";
  }

  // In development, use full HTTP URL (proxy will handle CORS)
  return "http://wasel2.somee.com";
};

export const API_BASE_URL = getApiBaseUrl();

// Log API base URL for debugging (only in browser)
if (typeof window !== "undefined") {
  console.log(
    "[API Client] Base URL:",
    API_BASE_URL || "(empty - using relative URLs)"
  );
  console.log("[API Client] Hostname:", window.location.hostname);
  console.log("[API Client] NODE_ENV:", process.env.NODE_ENV);
}

// Helper function to get full image URL
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";

  // If imagePath is already a full URL, return it
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If imagePath starts with /, it's already a relative path
  if (imagePath.startsWith("/")) {
    return imagePath;
  }

  // In production, use relative URL
  if (process.env.NODE_ENV === "production") {
    return `/${imagePath}`;
  }

  // In development, use full URL
  const baseUrl = API_BASE_URL || "http://wasel2.somee.com";
  return `${baseUrl}/${imagePath}`;
};

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // إضافة authentication token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // معالجة الأخطاء بشكل مركزي
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      switch (status) {
        case 401:
          // Unauthorized - إعادة توجيه للـ login
          console.error("Unauthorized access");
          // إزالة token من localStorage
          localStorage.removeItem("token");
          // إعادة توجيه للصفحة الرئيسية (سيتم توجيهها للـ login)
          window.location.href = "/login";
          break;
        case 403:
          console.error("Forbidden access");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Server error");
          break;
        default:
          console.error("An error occurred:", error.message);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received from server");
    } else {
      // Error in request setup
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
