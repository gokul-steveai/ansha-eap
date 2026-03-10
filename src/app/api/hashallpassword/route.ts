// app/api/hashAllPasswords/route.ts
import { hashAllUserPasswords } from '@/serverActions/hashAllPasswords';
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await hashAllUserPasswords();

    return NextResponse.json({
      success: result.success,
      message: result.message,
    });
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) message = error.message;

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
