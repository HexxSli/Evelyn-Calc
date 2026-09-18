import { Operator, AngleUnit } from '../types';

const FUNNY_ERRORS = [
  "Hei salah loh",
  "Hmm... coba cek lagi",
  "Ada yang salah nih",
  "Coba ulangi deh",
  "Gak bisa gitu dong",
  "Error: Kamu lucu",
  "Waduh, macet nih",
  "Matematika menolak!",
  "Gagal paham",
  "Ampun DJ"
];

function getRandomError(): string {
  return FUNNY_ERRORS[Math.floor(Math.random() * FUNNY_ERRORS.length)];
}

/**
 * Fixes floating-point arithmetic precision errors (e.g. 0.1 + 0.2 = 0.30000000000000004)
 */
export function cleanPrecision(value: number): number {
  if (isNaN(value) || !isFinite(value)) return value;
  // If the number is virtually zero (like 1.22e-16 from floating point trig)
  if (Math.abs(value) < 1e-12) return 0;
  return parseFloat(value.toPrecision(12));
}

/**
 * Performs core binary operations (+, -, ×, ÷, ^)
 */
export function calculate(num1: number, num2: number, operator: Operator): number | string {
  switch (operator) {
    case '+':
      return cleanPrecision(num1 + num2);
    case '-':
      return cleanPrecision(num1 - num2);
    case '×':
      return cleanPrecision(num1 * num2);
    case '÷':
      if (num2 === 0) {
        return getRandomError();
      }
      return cleanPrecision(num1 / num2);
    case '^':
      if (num1 < 0 && !Number.isInteger(num2)) {
        return getRandomError(); // Complex roots not supported
      }
      const powVal = Math.pow(num1, num2);
      if (isNaN(powVal) || !isFinite(powVal)) return getRandomError();
      return cleanPrecision(powVal);
    default:
      return num2;
  }
}

/**
 * Applies a scientific unary operation directly on a number
 */
export function applyUnaryFunction(
  num: number,
  fn: 'sin' | 'cos' | 'tan' | 'log' | 'ln' | 'sqrt',
  angleUnit: AngleUnit = 'DEG'
): number | string {
  if (isNaN(num) || !isFinite(num)) return getRandomError();

  switch (fn) {
    case 'sin': {
      const radians = angleUnit === 'DEG' ? (num * Math.PI) / 180 : num;
      // Handle exact degrees like 0, 180, 360
      if (angleUnit === 'DEG' && num % 180 === 0) return 0;
      return cleanPrecision(Math.sin(radians));
    }
    case 'cos': {
      const radians = angleUnit === 'DEG' ? (num * Math.PI) / 180 : num;
      // Handle exact 90, 270 degrees
      if (angleUnit === 'DEG' && (num - 90) % 180 === 0) return 0;
      return cleanPrecision(Math.cos(radians));
    }
    case 'tan': {
      if (angleUnit === 'DEG') {
        const mod = Math.abs(num % 180);
        if (mod === 90) return getRandomError(); // Undefined at 90, 270 deg
        const radians = (num * Math.PI) / 180;
        return cleanPrecision(Math.tan(radians));
      } else {
        const cosVal = Math.cos(num);
        if (Math.abs(cosVal) < 1e-12) return getRandomError();
        return cleanPrecision(Math.tan(num));
      }
    }
    case 'log': {
      if (num <= 0) return getRandomError();
      return cleanPrecision(Math.log10(num));
    }
    case 'ln': {
      if (num <= 0) return getRandomError();
      return cleanPrecision(Math.log(num));
    }
    case 'sqrt': {
      if (num < 0) return getRandomError();
      return cleanPrecision(Math.sqrt(num));
    }
    default:
      return num;
  }
}

/**
 * Safely evaluates a composite scientific expression string:
 * e.g. "sin(30) + 5", "√(16) × 2", "(2 + 3) ^ 2", "ln(e)"
 */
export function evaluateExpression(rawExpr: string, angleUnit: AngleUnit = 'DEG'): number | string {
  try {
    let expr = rawExpr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, `${Math.PI}`)
      .replace(/\be\b/g, `${Math.E}`);

    // Auto-balance open parentheses
    const openCount = (expr.match(/\(/g) || []).length;
    const closeCount = (expr.match(/\)/g) || []).length;
    if (openCount > closeCount) {
      expr = expr + ')'.repeat(openCount - closeCount);
    }

    // Replace square root: √(x) -> sqrt(x)
    expr = expr.replace(/√\(/g, 'sqrt(');

    // Tokenizer / Parser with safe evaluation
    // Replace functions with Math equivalents respecting angleUnit
    const toRadiansPrefix = angleUnit === 'DEG' ? `* (${Math.PI} / 180)` : '';

    // Transform trig functions:
    // We match sin(...), cos(...), tan(...), log(...), ln(...), sqrt(...)
    // To safely evaluate without eval of arbitrary code, we transform into safe Math calls:
    const safeExpr = expr
      .replace(/sin\(([^()]+)\)/g, (_match, inner) => `Math.sin((${inner})${toRadiansPrefix})`)
      .replace(/cos\(([^()]+)\)/g, (_match, inner) => `Math.cos((${inner})${toRadiansPrefix})`)
      .replace(/tan\(([^()]+)\)/g, (_match, inner) => `Math.tan((${inner})${toRadiansPrefix})`)
      .replace(/log\(([^()]+)\)/g, (_match, inner) => `Math.log10(${inner})`)
      .replace(/ln\(([^()]+)\)/g, (_match, inner) => `Math.log(${inner})`)
      .replace(/sqrt\(([^()]+)\)/g, (_match, inner) => `Math.sqrt(${inner})`)
      .replace(/\^/g, '**');

    // Validate that only safe math characters exist
    if (!/^[0-9+\-*/().\s*Math,pIeE_sincolgtq]+$/.test(safeExpr)) {
      return getRandomError();
    }

    // Execute with Function in sandbox
    const result = new Function(`"use strict"; return (${safeExpr});`)();

    if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
      return getRandomError();
    }

    return cleanPrecision(result);
  } catch {
    return getRandomError();
  }
}

/**
 * Formats a number string for the display:
 * - Adds thousands separators to the integer part
 * - Preserves decimal point and trailing decimals during typing
 * - Handles scientific notation for extreme numbers
 * - Gracefully handles 'Error'
 */
export function formatDisplayValue(val: string): string {
  if (FUNNY_ERRORS.includes(val)) return val;
  if (val === 'Error') return getRandomError();
  if (val === '' || val === '-') return val;

  // Handle scientific notation directly
  if (val.includes('e') || val.includes('E')) {
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    return num.toExponential(4);
  }

  // If the value contains non-numeric tokens (e.g. parentheses or operators in expressions)
  if (/[a-zA-Z()^×÷+\-√]/.test(val)) {
    return val;
  }

  const parts = val.split('.');
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? parts[1] : undefined;

  // Format integer portion with commas
  const isNegative = integerPart.startsWith('-');
  const rawDigits = isNegative ? integerPart.slice(1) : integerPart;
  
  // Format with thousand separators
  const formattedInteger = rawDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const sign = isNegative ? '-' : '';

  if (decimalPart !== undefined) {
    return `${sign}${formattedInteger}.${decimalPart}`;
  }

  return `${sign}${formattedInteger}`;
}

/**
 * Formats calculation result to fit nicely without overflowing
 */
export function formatResult(num: number | string): string {
  if (typeof num === 'string') {
    return num; // Pass through the funny error or string value
  }

  if (isNaN(num) || !isFinite(num)) {
    return getRandomError();
  }

  // If number is extremely large or tiny, use scientific notation
  const abs = Math.abs(num);
  if ((abs >= 1e11 || (abs > 0 && abs < 1e-6)) && abs !== 0) {
    return num.toExponential(5).replace('+', '');
  }

  // Check if integer
  if (Number.isInteger(num)) {
    return num.toString();
  }

  // Limit decimal places to avoid visual overflow while keeping precision
  const str = cleanPrecision(num).toString();
  if (str.length > 11) {
    const fixed = num.toFixed(7);
    return cleanPrecision(parseFloat(fixed)).toString();
  }

  return str;
}

/**
 * Triggers light haptic feedback on mobile devices if supported
 */
export function triggerHaptic(type: 'light' | 'medium' | 'error' = 'light') {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      if (type === 'error') {
        navigator.vibrate([20, 50, 20]);
      } else if (type === 'medium') {
        navigator.vibrate(15);
      } else {
        navigator.vibrate(8);
      }
    } catch {
      // Ignore vibration errors on unsupported environments
    }
  }
}
