import { NextResponse } from "next/server";
import { query } from "../../../lib/db";
export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b.name || !b.email || !b.mobile || !b.message)
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    await query(
      "INSERT INTO contact_messages(name,email,mobile,message) VALUES($1,$2,$3,$4)",
      [b.name, b.email, b.mobile, b.message],
    );
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to send message." },
      { status: 500 },
    );
  }
}
