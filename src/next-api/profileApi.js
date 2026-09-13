// src/lib/profileApi.js

import { API_BASE_URL } from "@/config/base-url";

/**
 * Get authorization header from localStorage token
 */
const getAuthHeaders = (isFormData = false) => {
  const headers = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Fetch customer profile data
 * @returns {Promise<{ data: Object }>}
 */
export async function getCustomerProfile() {
  try {
    const response = await fetch(`${API_BASE_URL}profile`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch profile (${response.status})`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    // If backend is not running or returns network error, provide fallback or rethrow
    console.error("getCustomerProfile error:", error);
    throw error;
  }
}

/**
 * Update customer profile (supports both JSON and FormData for profile image upload)
 * @param {Object|FormData} data
 * @returns {Promise<{ data: Object }>}
 */
export async function updateCustomerProfile(data) {
  try {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    const headers = getAuthHeaders(isFormData);

    const response = await fetch(`${API_BASE_URL}profile`, {
      method: "PUT",
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update profile (${response.status})`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    console.error("updateCustomerProfile error:", error);
    throw error;
  }
}

/**
 * Update customer password
 * @param {{ currentPassword: string, newPassword: string }} passwordData
 * @returns {Promise<{ data: Object }>}
 */
export async function updateCustomerPassword(passwordData) {
  try {
    const response = await fetch(`${API_BASE_URL}profile/password`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update password (${response.status})`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    console.error("updateCustomerPassword error:", error);
    throw error;
  }
}

/**
 * Helper to construct FormData for profile updates with image
 * @param {Object} data - Profile fields including profilePhoto File
 * @returns {FormData}
 */
export function createProfileFormData(data) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  return formData;
}
