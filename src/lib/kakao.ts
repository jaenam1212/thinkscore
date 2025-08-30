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
      console.log("서버 사이드 환경에서는 카카오 SDK를 초기화할 수 없습니다");
      resolve(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 100; // 10초 최대 대기 (더 여유롭게)

    const checkKakaoSDK = () => {
      attempts++;

      console.log(`카카오 SDK 확인 중... (${attempts}/${maxAttempts})`, {
        window: typeof window !== "undefined",
        Kakao: !!window.Kakao,
        init: !!window.Kakao?.init,
        Auth: !!window.Kakao?.Auth,
        API: !!window.Kakao?.API,
        isInitialized: window.Kakao?.isInitialized?.(),
      });

      if (window.Kakao) {
        console.log("카카오 SDK 객체 발견:", Object.keys(window.Kakao));

        // Auth와 API가 없는 경우 SDK 로딩이 완전하지 않은 상태
        if (!window.Kakao.Auth || !window.Kakao.API) {
          console.log(
            `SDK 모듈 로딩 중... Auth: ${!!window.Kakao.Auth}, API: ${!!window.Kakao.API}`
          );
          // 계속 대기
        } else if (window.Kakao.init) {
          if (!window.Kakao.isInitialized()) {
            try {
              const kakaoKey =
                process.env.NEXT_PUBLIC_KAKAO_JS_KEY ||
                "2e88ef8df1d85ed606a1c6d423fcdd9a";
              window.Kakao.init(kakaoKey);
              console.log("✅ 카카오 SDK 초기화 완료");
              resolve(true);
              return;
            } catch (error) {
              console.error("❌ 카카오 SDK 초기화 실패:", error);
              resolve(false);
              return;
            }
          } else {
            console.log("✅ 카카오 SDK 이미 초기화됨");
            resolve(true);
            return;
          }
        }
      }

      if (attempts < maxAttempts) {
        setTimeout(checkKakaoSDK, 100);
      } else {
        console.error(
          "❌ 카카오 SDK 로딩 타임아웃 - 네트워크 문제이거나 스크립트가 차단되었을 수 있습니다"
        );
        console.log("현재 상태:", {
          scriptLoaded: !!document.querySelector('script[src*="kakao"]'),
          windowKakao: !!window.Kakao,
          networkStatus: navigator.onLine ? "온라인" : "오프라인",
        });
        resolve(false);
      }
    };

    // 즉시 한 번 체크하고, 없으면 대기
    checkKakaoSDK();
  });
};

// REST API 방식 리다이렉트 로그인 (SDK 불필요)
export const kakaoLoginRestAPI = () => {
  const KAKAO_CLIENT_ID =
    process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "2e88ef8df1d85ed606a1c6d423fcdd9a";
  const FRONTEND_URL =
    process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
  const REDIRECT_URI = `${FRONTEND_URL}/auth/kakao/callback`;

  const kakaoAuthURL =
    `https://kauth.kakao.com/oauth/authorize?` +
    `client_id=${KAKAO_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `response_type=code&` +
    `scope=profile_nickname,account_email`; // 이메일 필수, 닉네임 선택

  console.log("카카오 REST API 로그인 리다이렉트:", {
    client_id: KAKAO_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    full_url: kakaoAuthURL,
  });
  window.location.href = kakaoAuthURL;
};

// 리다이렉트 방식 카카오 로그인 (REST API 우선)
export const kakaoLoginRedirect = () => {
  console.log("카카오 로그인: REST API 방식 직접 사용");
  kakaoLoginRestAPI();
};

// 기존 팝업 방식 (백업용)
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
