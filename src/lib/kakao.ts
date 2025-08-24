declare global {
  interface Window {
    Kakao: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Auth: {
        login: (options: {
          success: (authObj: { access_token: string }) => void;
          fail: (error: { error_description: string }) => void;
        }) => void;
      };
      API: {
        request: (options: {
          url: string;
          success: (response: KakaoProfileResponse) => void;
          fail: (error: { msg: string }) => void;
        }) => void;
      };
    };
  }
}

export const initializeKakao = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 50; // 5초 최대 대기

    const checkKakaoSDK = () => {
      attempts++;

      console.log(`카카오 SDK 확인 중... (${attempts}/${maxAttempts})`, {
        Kakao: !!window.Kakao,
        init: !!window.Kakao?.init,
        Auth: !!window.Kakao?.Auth,
        API: !!window.Kakao?.API,
      });

      if (
        window.Kakao &&
        window.Kakao.init &&
        window.Kakao.Auth &&
        window.Kakao.API
      ) {
        if (!window.Kakao.isInitialized()) {
          try {
            // 카카오 JavaScript 키 (공개용 키이므로 하드코딩 OK)
            window.Kakao.init("wttgQsnQEIssuk9xW8B4S6uK9gOF6oFY");
            console.log("카카오 SDK 초기화 완료");
            resolve(true);
          } catch (error) {
            console.error("카카오 SDK 초기화 실패:", error);
            resolve(false);
          }
        } else {
          console.log("카카오 SDK 이미 초기화됨");
          resolve(true);
        }
      } else if (attempts < maxAttempts) {
        setTimeout(checkKakaoSDK, 100);
      } else {
        console.error("카카오 SDK 로딩 타임아웃");
        resolve(false);
      }
    };

    checkKakaoSDK();
  });
};

export const kakaoLogin = (): Promise<{
  accessToken: string;
  profile: KakaoProfile;
}> => {
  return new Promise((resolve, reject) => {
    if (
      !window.Kakao ||
      !window.Kakao.Auth ||
      typeof window.Kakao.Auth.login !== "function"
    ) {
      reject(new Error("카카오 SDK가 제대로 로드되지 않았습니다"));
      return;
    }

    try {
      window.Kakao.Auth.login({
        success: (authObj: { access_token: string }) => {
          console.log("카카오 인증 성공:", authObj);

          if (
            !window.Kakao.API ||
            typeof window.Kakao.API.request !== "function"
          ) {
            reject(new Error("카카오 API가 준비되지 않았습니다"));
            return;
          }

          window.Kakao.API.request({
            url: "/v2/user/me",
            success: (profileResponse: KakaoProfileResponse) => {
              console.log("카카오 프로필 조회 성공:", profileResponse);
              resolve({
                accessToken: authObj.access_token,
                profile: {
                  id: profileResponse.id.toString(),
                  nickname:
                    profileResponse.kakao_account?.profile?.nickname || "",
                  email: profileResponse.kakao_account?.email || "",
                  profileImage:
                    profileResponse.kakao_account?.profile?.profile_image_url ||
                    "",
                },
              });
            },
            fail: (error: { msg: string }) => {
              console.error("카카오 프로필 조회 실패:", error);
              reject(new Error(`프로필 조회 실패: ${error.msg}`));
            },
          });
        },
        fail: (error: { error_description: string }) => {
          console.error("카카오 로그인 실패:", error);
          reject(new Error(`로그인 실패: ${error.error_description}`));
        },
      });
    } catch (error) {
      console.error("카카오 로그인 호출 중 에러:", error);
      reject(new Error("카카오 로그인 호출 중 오류가 발생했습니다"));
    }
  });
};

export const kakaoLogout = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!window.Kakao) {
      reject(new Error("카카오 SDK가 로드되지 않았습니다"));
      return;
    }

    window.Kakao.Auth.logout(() => {
      resolve();
    });
  });
};

export interface KakaoProfile {
  id: string;
  nickname: string;
  email: string;
  profileImage: string;
}

interface KakaoProfileResponse {
  id: number;
  kakao_account?: {
    profile?: {
      nickname?: string;
      profile_image_url?: string;
    };
    email?: string;
  };
}
