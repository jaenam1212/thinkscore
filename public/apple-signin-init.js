// Apple Sign In SDK 초기화 스크립트
window.addEventListener("DOMContentLoaded", function () {
  if (window.AppleID) {
    window.AppleID.auth.init({
      clientId:
        process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "your.apple.service.id",
      scope: "name email",
      redirectURI: window.location.origin,
      usePopup: true,
    });
  }
});
