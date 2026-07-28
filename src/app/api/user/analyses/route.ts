import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import { Analysis } from "@/lib/models/Analysis";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const analyses = await Analysis.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .select("-extractedText -jobDescription"); // Exclude large fields for listing efficiency

    return NextResponse.json(analyses);
  } catch (error: any) {
    console.error("Fetch analyses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analyses. Please try again." },
      { status: 500 }
    );
  }
}
