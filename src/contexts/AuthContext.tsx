"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        setUser({
          id: userData.id,
          email: userData.email,
          displayName: userData.displayName,
        });
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

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
  };

  const register = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, displayName }),
      }
    );

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
  };

  const loginWithKakao = async (
    accessToken: string,
    profile: KakaoUserProfile
  ) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/kakao`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken,
          profile: {
            id: profile.id,
            nickname: profile.nickname,
            email: profile.email,
            profileImage: profile.profileImage,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "카카오 로그인에 실패했습니다.");
    }

    const responseData = await response.json();

    // requiresAdditionalInfo가 있으면 추가 정보 입력 필요
    if (responseData.requiresAdditionalInfo) {
      throw new Error("REQUIRES_ADDITIONAL_INFO");
    }

    const { user: userData, access_token } = responseData;

    setUser({
      id: userData.id,
      email: userData.email,
      displayName: userData.displayName,
    });
    setToken(access_token);
    localStorage.setItem("auth_token", access_token);
  };

  const loginWithNaver = async (
    accessToken: string,
    profile: NaverUserProfile
  ) => {
    console.log("loginWithNaver 시작:", {
      profileId: profile.id,
      email: profile.email,
    });

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/naver`;
    console.log("백엔드 API URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken,
        profile: {
          id: profile.id,
          nickname: profile.nickname,
          email: profile.email,
          profile_image: profile.profile_image,
        },
      }),
    });

    console.log("백엔드 응답 상태:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("백엔드 에러:", errorData);
      throw new Error(errorData.message || "네이버 로그인에 실패했습니다.");
    }

    const responseData = await response.json();
    console.log("백엔드 응답 데이터:", responseData);

    const { user: userData, access_token } = responseData;

    setUser({
      id: userData.id,
      email: userData.email,
      displayName: userData.displayName,
    });
    setToken(access_token);
    localStorage.setItem("auth_token", access_token);
  };

  const loginWithApple = async (idToken: string, user?: AppleUserData) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/apple`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken,
          user,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Apple 로그인에 실패했습니다.");
    }

    const responseData = await response.json();
    const { user: userData, access_token } = responseData;

    setUser({
      id: userData.id,
      email: userData.email,
      displayName: userData.displayName,
    });
    setToken(access_token);
    localStorage.setItem("auth_token", access_token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
  };

  const updateUserInfo = (userData: User, accessToken: string) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("auth_token", accessToken);
  };

  const updateProfile = async (data: {
    email: string;
    displayName: string;
  }) => {
    if (!token) {
      throw new Error("인증이 필요합니다.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/profile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

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
