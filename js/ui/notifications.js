export function showNotification(
  element,
  message,
  type = "info"
) {
  if (!element) return;

  element.textContent = message;

  element.className =
    `notification notification-${type}`;

  element.setAttribute(
    "role",
    "status"
  );

  element.setAttribute(
    "aria-live",
    "polite"
  );
}

export function clearNotification(element) {
  if (!element) return;

  element.textContent = "";
  element.className = "notification";
}