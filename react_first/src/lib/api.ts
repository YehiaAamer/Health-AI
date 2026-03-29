// API Configuration and Error Handling

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  PREDICT: `${API_BASE_URL}/api/predict/`,
  GET_PREDICTIONS: `${API_BASE_URL}/api/predictions/`,
  HISTORY: `${API_BASE_URL}/api/history/`,
  PROFILE: `${API_BASE_URL}/api/profile/`,
} as const;

// ═══════════════════════════════════════════════════════════════
// Custom API Error Class
// ═══════════════════════════════════════════════════════════════
export class APIError extends Error {
  constructor(
    public code: string,
    public statusCode?: number,
    public originalError?: Error,
    message?: string
  ) {
    super(message || `API Error: ${code}`);
    this.name = 'APIError';
  }
}

// ═══════════════════════════════════════════════════════════════
// Retry Configuration
// ═══════════════════════════════════════════════════════════════
interface RetryConfig {
  maxRetries: number;
  delayMs: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
};

// ═══════════════════════════════════════════════════════════════
// Retry Helper with Exponential Backoff
// ═══════════════════════════════════════════════════════════════
async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: Error | null = null;
  let currentDelay = config.delayMs;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt + 1} of ${config.maxRetries + 1}`);
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < config.maxRetries) {
        console.warn(
          `⚠️ Attempt ${attempt + 1} failed. Retrying in ${currentDelay}ms...`,
          lastError.message
        );
        await delay(currentDelay);
        currentDelay *= config.backoffMultiplier;
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

// ═══════════════════════════════════════════════════════════════
// Main API Call Function with Error Handling
// ═══════════════════════════════════════════════════════════════
interface APICallOptions extends RequestInit {
  retryConfig?: RetryConfig;
  timeout?: number;
}

/**
 * ترسل request للـ API مع:
 * ✅ معالجة أخطاء شاملة
 * ✅ Retry مع exponential backoff (ماعدا للـ auth endpoints)
 * ✅ Timeout handling
 * ✅ Detailed error logging
 */
export async function apiCall<T>(
  endpoint: string,
  options?: APICallOptions
): Promise<T> {
  const { retryConfig, timeout = 30000, ...fetchOptions } = options || {};

  // ❌ لا تعمل retry للـ auth endpoints
  const isAuthEndpoint = endpoint.includes('/auth/');
  
  // ❌ لا تعمل retry للـ profile endpoint
  const isProfileEndpoint = endpoint.includes('/profile/');
  
  // استخدام retryConfig مخصص للـ auth endpoints
  const finalRetryConfig = (isAuthEndpoint || isProfileEndpoint) 
    ? { maxRetries: 0, delayMs: 0, backoffMultiplier: 1 } 
    : (retryConfig || DEFAULT_RETRY_CONFIG);

  return retryWithBackoff(async () => {
    try {
      // ─────────────────────────────────────────────
      // 1. إضافة headers الافتراضية
      // ─────────────────────────────────────────────
      const headers = new Headers();

      // الحصول على token من localStorage
      const storedTokens = localStorage.getItem('auth_tokens');
      console.log('🔑 Stored tokens:', storedTokens);
      if (storedTokens) {
        try {
          const tokens = JSON.parse(storedTokens);
          console.log('✅ Parsed tokens:', tokens);
          if (tokens?.access) {
            headers.set('Authorization', `Bearer ${tokens.access}`);
            console.log('🛡️ Authorization header set');
          } else {
            console.warn('⚠️ No access token found');
          }
        } catch (e) {
          console.warn('⚠️ Failed to parse auth tokens:', e);
        }
      } else {
        console.warn('⚠️ No tokens in localStorage');
      }

      // Only set Content-Type to application/json if body is not FormData
      const isFormData = fetchOptions.body instanceof FormData;
      if (!isFormData && fetchOptions.body) {
        headers.set('Content-Type', 'application/json');
      }

      // Add any custom headers
      if (fetchOptions.headers) {
        Object.entries(fetchOptions.headers).forEach(([key, value]) => {
          if (value !== null) {
            headers.set(key, String(value));
          }
        });
      }

      // ─────────────────────────────────────────────
      // 2. إنشاء AbortController للـ timeout
      // ─────────────────────────────────────────────
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        // ─────────────────────────────────────────────
        // 3. إرسال الـ request
        // ─────────────────────────────────────────────
        console.log(`📤 Sending request to: ${endpoint}`);
        console.log('📤 Request method:', fetchOptions.method);
        console.log('📤 Request headers:', Object.fromEntries(headers.entries()));
        if (fetchOptions.body) {
          try {
            console.log('📤 Request body:', JSON.parse(fetchOptions.body as string));
          } catch (e) {
            console.log('📤 Request body (raw):', fetchOptions.body);
          }
        }

        const response = await fetch(endpoint, {
          ...fetchOptions,
          headers,
          signal: controller.signal,
        });

        console.log(`📥 Response status: ${response.status}`);
        clearTimeout(timeoutId);

        // ─────────────────────────────────────────────
        // 4. معالجة الأخطاء based on status code
        // ─────────────────────────────────────────────
        if (!response.ok) {
          await handleErrorResponse(response);
        }

        // ─────────────────────────────────────────────
        // 5. Parse JSON Response
        // ─────────────────────────────────────────────
        let responseData: T;
        try {
          responseData = await response.json();
        } catch (parseError) {
          throw new APIError(
            'INVALID_JSON',
            response.status,
            parseError as Error,
            'الخادم رجع استجابة غير صحيحة'
          );
        }

        console.log(`✅ Request successful (${response.status}):`, responseData);
        return responseData;
      } catch (error) {
        clearTimeout(timeoutId);

        // معالجة خاصة للـ timeout
        if (error instanceof DOMException && error.name === 'AbortError') {
          throw new APIError(
            'TIMEOUT',
            undefined,
            error,
            `انتهت مهلة الاتصال (${timeout}ms). الخادم قد لا يكون متاحًا.`
          );
        }

        throw error;
      }
    } catch (error) {
      // معالجة خاصة للأخطاء المختلفة
      if (error instanceof APIError) {
        throw error;
      }

      if (error instanceof TypeError) {
        // خطأ في الاتصال (Network Error)
        throw new APIError(
          'NETWORK_ERROR',
          undefined,
          error,
          'فشل الاتصال بالخادم. التحقق من اتصالك بالإنترنت.'
        );
      }

      throw new APIError(
        'UNKNOWN_ERROR',
        undefined,
        error as Error,
        'حدث خطأ غير متوقع'
      );
    }
  }, finalRetryConfig);
}

// ═══════════════════════════════════════════════════════════════
// Error Response Handler
// ═══════════════════════════════════════════════════════════════
async function handleErrorResponse(response: Response): Promise<never> {
  let errorMessage = `Server Error: ${response.status}`;
  let errorCode = `HTTP_${response.status}`;

  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.error || errorMessage;
    errorCode = errorData.code || errorCode;
  } catch {
    // إذا ما قدرنا نـ parse الخطأ response
    try {
      const text = await response.text();
      errorMessage = text || errorMessage;
    } catch {
      // لا يمكن قراءة الخطأ
    }
  }

  // تحديد الرسالة العربية بناءً على status code
  const arabicMessage = getArabicErrorMessage(response.status, errorMessage);

  throw new APIError(
    errorCode,
    response.status,
    undefined,
    arabicMessage
  );
}

// ═══════════════════════════════════════════════════════════════
// Arabic Error Messages
// ═══════════════════════════════════════════════════════════════
function getArabicErrorMessage(statusCode: number, serverMessage: string): string {
  const messages: Record<number, string> = {
    400: 'البيانات المرسلة غير صحيحة. يرجى التحقق والمحاولة مرة أخرى.',
    401: 'أنت لم تسجل دخول. يرجى تسجيل الدخول أولاً.',
    403: 'ليس لديك صلاحية للوصول إلى هذا المورد.',
    404: 'المورد المطلوب غير موجود.',
    500: 'خطأ في الخادم. يرجى المحاولة لاحقاً.',
    502: 'خطأ في الخادم (Bad Gateway). يرجى المحاولة لاحقاً.',
    503: 'الخادم غير متاح حالياً. يرجى المحاولة لاحقاً.',
    504: 'انتهت مهلة الاتصال بالخادم. يرجى المحاولة لاحقاً.',
  };

  return messages[statusCode] || `حدث خطأ: ${serverMessage}`;
}

// ═══════════════════════════════════════════════════════════════
// Helper: Get User-Friendly Error Message
// ═══════════════════════════════════════════════════════════════
export function getErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'حدث خطأ غير متوقع';
}
