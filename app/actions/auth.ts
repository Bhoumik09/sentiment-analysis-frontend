"use server";

import { UserDataProfile } from "@/context/AuthContext";
import { api } from "@/lib/constants";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export const fetchUserDataFromServer = async (): Promise<{
  userInfo: UserDataProfile;
} | null> => {
  const cookie = cookies();
  const authToken = cookie.get("user-token");
  try {
    if (!authToken || !authToken.value) {
      return redirect("/login");
    }
    const userData = await fetchUserData(authToken.value);
    return userData;
  } catch (error: any) {
    return null;
  }
};
export const fetchUserData = async (
  token: string
): Promise<{ userInfo: UserDataProfile } | null> => {
  try {
    const response = await axios.get(`${api}/auth/fetch-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as {
      userInfo: { id: string; email: string; name: string };
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Extract the specific error message from your backend's JSON response
      const backendError =
        error.response?.data?.error || "Login failed due to a server error.";
      // Throw a new, simple error with that specific message
      console.log(backendError);
      console.error(backendError);
    }
    // For any other kind of error, just re-throw it
    return null;
  }
};

export const  loginUser = async (credentials: {
  email: string;
  password: string;
}): Promise<{ msg: string; token: string }|null> => {
  try {
    const response = await axios.post(`${api}/auth/login`, {
      ...credentials 
    });
    return response.data as {
      msg: string;
      token: string;
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Extract the specific error message from your backend's JSON response
      const backendError =
        error.response?.data?.error || "Signup failed due to a server error.";
      // Throw a new, simple error with that specific message
      throw new Error(backendError);
    }
    // For any other kind of error, just re-throw it
    throw new Error("An unexpected error occurred.");
  }
};
export const signUpUser = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}): Promise<{ msg: string }> => {
  try {
    const response = await axios.post(`${api}/auth/signup`, {
      email,
      password,
      name,
    });
    return response.data as {
      msg: string;
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Extract the specific error message from your backend's JSON response
      const backendError =
        error.response?.data?.error || "Signup failed due to a server error.";
      // Throw a new, simple error with that specific message
      throw new Error(backendError);
    }
    // For any other kind of error, just re-throw it
    throw new Error("An unexpected error occurred.");
  }
};
