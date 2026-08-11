import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          error:
            "Email and password are required",
        },
        { status: 400 }
      );
    }

    // TODO:
    // Replace these with your database
    // admin credentials.

    const ADMIN_EMAIL =
      process.env.ADMIN_EMAIL;

    const ADMIN_PASSWORD =
      process.env.ADMIN_PASSWORD;

    if (
      email !== ADMIN_EMAIL ||
      password !== ADMIN_PASSWORD
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid email or password",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      {
        error: "Unable to login",
      },
      { status: 500 }
    );
  }
}