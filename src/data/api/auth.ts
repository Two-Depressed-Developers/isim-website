import axios from "axios";

type ForgotPasswordData = {
  email: string;
};

type ResetPasswordData = {
  token: string;
  password: string;
  passwordConfirmation: string;
};

type SetupAccountData = {
  token: string;
  username: string;
  password: string;
};

export async function forgotPassword(data: ForgotPasswordData): Promise<void> {
  await axios.post("/api/auth/forgot-password", data);
}

export async function resetPassword(data: ResetPasswordData): Promise<void> {
  await axios.post("/api/auth/reset-password", data);
}

export async function setupAccount(data: SetupAccountData): Promise<void> {
  await axios.post("/api/auth/complete-registration", data);
}
