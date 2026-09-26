export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Weak' | 'Medium' | 'Strong';
  hasMinLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export function validateFullName(name: string): { isValid: boolean; error?: string } {
  const trimmed = name.trim();
  if (!trimmed) return { isValid: false, error: 'Full name is required.' };
  if (trimmed.length < 2) return { isValid: false, error: 'Full name must have at least 2 characters.' };
  if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) {
    return { isValid: false, error: 'Name contains invalid characters.' };
  }
  return { isValid: true };
}

export function validateIndianMobile(mobile: string): { isValid: boolean; error?: string } {
  const cleaned = mobile.replace(/[\s-]/g, '');
  if (!cleaned) return { isValid: false, error: 'Mobile number is required.' };
  // Supports +91XXXXXXXXXX or 10-digit starting with 6,7,8,9
  const indianMobileRegex = /^(?:\+91)?[6-9]\d{9}$/;
  if (!indianMobileRegex.test(cleaned)) {
    return { isValid: false, error: 'Please enter a valid 10-digit Indian mobile number (e.g., +919876543210).' };
  }
  return { isValid: true };
}

export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const trimmed = email.trim();
  if (!trimmed) return { isValid: false, error: 'Email address is required.' };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }
  return { isValid: true };
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (hasMinLength) score++;
  if (hasUpper && hasLower) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  let label: 'Weak' | 'Medium' | 'Strong' = 'Weak';
  if (score >= 4) label = 'Strong';
  else if (score >= 2) label = 'Medium';

  return {
    score,
    label,
    hasMinLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial
  };
}
