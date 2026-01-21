// Professional Authentication Utilities
export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message) || error.message.includes("Unauthorized");
}

export function isAuthError(error: any): boolean {
  if (!error) return false;
  if (error.status === 401 || error.status === 403) return true;
  if (error.message?.includes("Unauthorized")) return true;
  if (error.message?.includes("Forbidden")) return true;
  return false;
}

export function getAuthErrorMessage(error: any): string {
  if (!error) return "An unknown error occurred";
  if (typeof error === "string") return error;
  if (error.message) return error.message;
  if (error.status === 401) return "Please sign in to continue";
  if (error.status === 403) return "You don't have permission to access this resource";
  return "Authentication failed";
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters" };
  }
  return { valid: true, message: "" };
}
