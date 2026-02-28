"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  initializePurchases,
  loginToPurchases,
  logoutFromPurchases,
} from "@/lib/purchases";

interface User {
  id: string;
  email: string;
  displayName: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithKakao: (
    accessToken: string,
    profile: KakaoUserProfile
  ) => Promise<void>;
  loginWithNaver: (
    accessToken: string,
    profile: NaverUserProfile
  ) => Promise<void>;
  loginWithApple: (idToken: string, user?: AppleUserData) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<void>;
  logout: () => void;
  updateUserInfo: (userData: User, accessToken: string) => void;
  updateProfile: (data: {
    email: string;
    displayName: string;
  }) => Promise<void>;
}

interface KakaoUserProfile {
  id: string;
  nickname: string;
  email: string;
  profileImage: string;
}

interface NaverUserProfile {
  id: string;
  nickname: string;
  email: string;
  profile_image: string;
}

interface AppleUserData {
  email?: string;
  name?: {
    firstName?: string;
    lastName?: string;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function apiPost(
  path: string,
  body: unknown,
  token?: string | null
): Promise<Response> {
  return fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncPurchasesForUser = async (userId: string) => {
    try {
      await initializePurchases(userId);
      await loginToPurchases(userId);
    } catch {
      return;
    }
  };

  // 로컬 스토리지에서 토큰 로드
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    if (savedToken) {
      setToken(savedToken);
      // 토큰으로 사용자 정보 가져오기
      fetchUserProfile(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser({
          id: userData.id,
          email: userData.email,
          displayName: userData.displayName,
        });
        await syncPurchasesForUser(userData.id);
      } else {
        localStorage.removeItem("auth_token");
        setToken(null);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      localStorage.removeItem("auth_token");
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiPost("/auth/login", { email, password });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "로그인에 실패했습니다.");
    }

    const { user: userData, access_token } = await response.json();

    setUser({
      id: userData.id,
      email: userData.email,
      displayName: userData.displayName,
    });
    setToken(access_token);
    localStorage.setItem("auth_token", access_token);
    await syncPurchasesForUser(userData.id);
  };

  const register = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    const response = await apiPost("/auth/register", {
      email,
      password,
      displayName,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "회원가입에 실패했습니다.");
    }

    const { user: userData, access_token } = await response.json();

    setUser({
      id: userData.id,
      email: userData.email,
      displayName: userData.displayName,
    });
    setToken(access_token);
    localStorage.setItem("auth_token", access_token);
    await syncPurchasesForUser(userData.id);
  };

  const loginWithKakao = async (
    accessToken: string,
    profile: KakaoUserProfile
  ) => {
    const response = await apiPost("/auth/kakao", {
      accessToken,
      profile: {
        id: profile.id,
        nickname: profile.nickname,
        email: profile.email,
        profileImage: profile.profileImage,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "카카오 로그인에 실패했습니다.");
    }

    const responseData = await response.json();
    if (responseData.requiresAdditionalInfo)
      throw new Error("REQUIRES_ADDITIONAL_INFO");

    const { user: userData, access_token } = responseData;
    setUser({
      id: userData.id,
      email: userData.email,
      displayName: userData.displayName,
    });
    setToken(access_token);
    localStorage.setItem("auth_token", access_token);
    await syncPurchasesForUser(userData.id);
  };

  const loginWithNaver = async (
    accessToken: string,
    profile: NaverUserProfile
  ) => {
    const response = await apiPost("/auth/naver", {
      accessToken,
      profile: {
        id: profile.id,
        nickname: profile.nickname,
        email: profile.email,
        profile_image: profile.profile_image,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "네이버 로그인에 실패했습니다.");
    }

    const { user: userData, access_token } = await response.json();
    setUser({
      id: userData.id,
      email: userData.email,
      displayName: userData.displayName,
    });
    setToken(access_token);
    localStorage.setItem("auth_token", access_token);
    await syncPurchasesForUser(userData.id);
  };

  const loginWithApple = async (idToken: string, user?: AppleUserData) => {
    const response = await apiPost("/auth/apple", { idToken, user });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Apple 로그인에 실패했습니다.");
    }

    const { user: userData, access_token } = await response.json();
    setUser({
      id: userData.id,
      email: userData.email,
      displayName: userData.displayName,
    });
    setToken(access_token);
    localStorage.setItem("auth_token", access_token);
    await syncPurchasesForUser(userData.id);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    void logoutFromPurchases();
  };

  const updateUserInfo = (userData: User, accessToken: string) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("auth_token", accessToken);
    void syncPurchasesForUser(userData.id);
  };

  const updateProfile = async (data: {
    email: string;
    displayName: string;
  }) => {
    if (!token) {
      throw new Error("인증이 필요합니다.");
    }

    const response = await apiPost("/auth/profile", data, token);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "프로필 업데이트에 실패했습니다.");
    }

    const updatedUser = await response.json();
    setUser({
      id: updatedUser.id,
      email: updatedUser.email,
      displayName: updatedUser.displayName,
    });
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithKakao,
    loginWithNaver,
    loginWithApple,
    register,
    logout,
    updateUserInfo,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
