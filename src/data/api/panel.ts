import axios from "axios";

type ChangeUsernameData = {
  username: string;
};

type ChangeUsernameResponse = {
  username: string;
};

type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export async function changeUsername(
  data: ChangeUsernameData,
): Promise<ChangeUsernameResponse> {
  const response = await axios.post<ChangeUsernameResponse>(
    "/api/panel/settings/username",
    data,
  );
  return response.data;
}

export async function changePassword(data: ChangePasswordData): Promise<void> {
  await axios.post("/api/panel/settings/password", data);
}
