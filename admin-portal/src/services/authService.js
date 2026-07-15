import API from "./api";

const TOKEN_KEY = "token";
const OFFICER_KEY = "officer";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getOfficer = () => {
  const officer = localStorage.getItem(OFFICER_KEY);

  return officer ? JSON.parse(officer) : null;
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const setOfficer = (officer) => {
  localStorage.setItem(OFFICER_KEY, JSON.stringify(officer));
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(OFFICER_KEY);
};

const extractMessage = (error, fallbackMessage) =>
  error?.response?.data?.message || error?.response?.data?.error || fallbackMessage;

export const login = async (badgeNumber, password) => {
  try {
    const response = await API.post("/auth/login", {
      badgeNumber,
      password,
    });

    const token = response?.data?.token || response?.data?.accessToken;
    const officer = response?.data?.officer || null;

    if (!token) {
      return {
        success: false,
        message: "Token missing in response",
      };
    }

    setToken(token);
    if (officer) {
      setOfficer(officer);
    }

    return {
      success: true,
      token,
      officer,
    };
  } catch (error) {
    const message = extractMessage(error, "Login failed");

    return {
      success: false,
      message,
    };
  }
};

export const signup = async ({ badgeNumber, name, phone, district, password }) => {
  try {
    const response = await API.post("/auth/signup", {
      badgeNumber,
      name,
      phone,
      district,
      password,
    });

    return {
      success: true,
      officer: response?.data || null,
    };
  } catch (error) {
    const message = extractMessage(error, "Signup failed");

    return {
      success: false,
      message,
    };
  }
};