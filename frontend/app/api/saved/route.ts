import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/saved — return saved colleges for current user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      savedColleges: {
        include: { college: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user.savedColleges.map((sc) => sc.college));
}

// POST /api/saved — save a college
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { collegeId } = await req.json();
  if (!collegeId) {
    return NextResponse.json({ error: "collegeId required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check if already saved
  const existing = await prisma.savedCollege.findUnique({
    where: { userId_collegeId: { userId: user.id, collegeId } },
  });

  if (existing) {
    return NextResponse.json({ message: "Already saved" });
  }

  await prisma.savedCollege.create({
    data: { userId: user.id, collegeId },
  });

  return NextResponse.json({ message: "College saved successfully" }, { status: 201 });
}

// DELETE /api/saved — remove a saved college
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { collegeId } = await req.json();
  if (!collegeId) {
    return NextResponse.json({ error: "collegeId required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await prisma.savedCollege.deleteMany({
    where: { userId: user.id, collegeId },
  });

  return NextResponse.json({ message: "College removed" });
}
