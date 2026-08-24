export const SMARTLINK_URL = "https://www.effectivecpmnetwork.com/ajqxrtk2?key=e88c6ebfc5c63d06d4e955cce6e4d950";

export function openSmartLink() {
  const popup = window.open(SMARTLINK_URL, "_blank", "noopener,noreferrer");
  if (popup) popup.opener = null;
}
