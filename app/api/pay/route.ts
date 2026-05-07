import { FAILURE_REASONS, PAYMENT_STATUS } from "@/constants/payment";
import { NextResponse } from "next/server";

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function POST() {
  const random = Math.random();

  // TIMEOUT -> 15%
  if (random < 0.15) {
    await delay(8000);

    return NextResponse.json({
      success: false,
      status: PAYMENT_STATUS.TIMEOUT,
    });
  }

  // FAILURE -> 25%
  if (random < 0.4) {
    await delay(2000);

    const reason =
      FAILURE_REASONS[
        Math.floor(Math.random() * FAILURE_REASONS.length)
      ];

    return NextResponse.json({
      success: false,
      status: PAYMENT_STATUS.FAILED,
      reason,
    });
  }

  // SUCCESS -> 60%
  await delay(2000);

  return NextResponse.json({
    success: true,
    status: PAYMENT_STATUS.SUCCESS,
  });
}