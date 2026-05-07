import {
  PAYMENT_TIMEOUT_MS,
  PAYMENT_STATUS,
} from "@/constants/payment";

import {
  PaymentPayload,
  PaymentResponse,
} from "@/types/payment";

export const processPayment = async (
  payload: PaymentPayload
): Promise<PaymentResponse> => {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, PAYMENT_TIMEOUT_MS);

  try {
    const response = await fetch("/api/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const data: PaymentResponse =
      await response.json();

    return data;
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      return {
        success: false,
        status: PAYMENT_STATUS.TIMEOUT,
        reason:
          "Payment request timed out. Please try again.",
      };
    }

    return {
      success: false,
      status: PAYMENT_STATUS.FAILED,
      reason:
        "Something went wrong while processing payment.",
    };
  } finally {
    clearTimeout(timeoutId);
  }
};