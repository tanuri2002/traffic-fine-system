import API from "./api";

const TOKEN_KEY = "token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const login = async (username, password) => {
  try {
    const response = await API.post("/auth/login", {
      username,
      password,
    });

    const token = response?.data?.token || response?.data?.accessToken;

    if (!token) {
      return {
        success: false,
        message: "Token missing in response",
      };
    }

    setToken(token);

    return {
      success: true,
      token,
    };
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Login failed";

    return {
      success: false,
      message,
    };
  }
};