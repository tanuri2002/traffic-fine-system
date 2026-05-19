export const login = async (username, password) => {

  if (username === "admin" && password === "1234") {

    const fakeToken = "jwt-token-example";

    localStorage.setItem("token", fakeToken);

    return {
      success: true,
      token: fakeToken,
    };
  }

  return {
    success: false,
  };
};