export const AUTH_LOGIN_URL = "/auth/login";
export const AUTH_REGISTER_URL = "/auth/register";
export const AUTH_FORGOT_PASSWORD_URL = "/auth/forgot-password";
export const AUTH_VERIFY_OTP_URL = "/auth/verify-otp";
export const AUTH_RESET_PASSWORD_URL = "/auth/reset-password";

export const INITIAL_LOGIN_DATA = { username: "", password: "" };
export const INITIAL_REGISTER_DATA = {
  name: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
};
export const INITIAL_RESET_DATA = {
  email: "",
  otp: "",
  newPassword: "",
};
