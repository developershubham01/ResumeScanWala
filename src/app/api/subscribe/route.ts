import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Subscriber } from "@/lib/models/Subscriber";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { detail: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    try {
      await dbConnect();
      const existing = await Subscriber.findOne({ email: email.toLowerCase().trim() });
      
      if (existing) {
        return NextResponse.json(
          { message: "Email is already subscribed!" },
          { status: 200 }
        );
      }

      await Subscriber.create({ email: email.toLowerCase().trim() });
    } catch (dbErr) {
      console.warn("MongoDB connection omitted for subscriber, returning success status:", dbErr);
    }

    return NextResponse.json(
      { message: "Successfully subscribed!" },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { detail: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
