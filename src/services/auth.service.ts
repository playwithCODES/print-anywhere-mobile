
import * as SecureStore from "expo-secure-store";

import api from "./api.service";

const TOKEN_KEY = "printanywhere_token";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  };
};

const saveToken = async (token: string) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);

  api.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const getToken = async () => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

const removeToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);

  delete api.defaults.headers.common.Authorization;
};

const login = async (email: string, password: string) => {
  const response = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });

  const { token, user } = response.data.data;

  await saveToken(token);

  return user;
};

const register = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await api.post<AuthResponse>("/auth/register", {
    name,
    email,
    password,
  });

  const { token, user } = response.data.data;

  await saveToken(token);

  return user;
};

const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data.user;
};

const restoreSession = async () => {
  const token = await getToken();

  if (!token) {
    return null;
  }

  api.defaults.headers.common.Authorization = `Bearer ${token}`;

  try {
    const user = await getCurrentUser();

    return user;
  } catch (error) {
    await removeToken();

    return null;
  }
};

const logout = async () => {
  await removeToken();
};

export default {
  login,
  register,
  getCurrentUser,
  restoreSession,
  logout,
};
