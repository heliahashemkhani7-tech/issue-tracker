import prisma from "@/prisma/client";
import { editIssueSchema, issueSchema } from "@/app/validationSchemas";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const body = await request.json();
  const validation = issueSchema.safeParse(body);
  const status = editIssueSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) },
  });

  if (!issue)
    return NextResponse.json({ error: "Invalid issue" }, { status: 404 });

  const updatedIssue = await prisma.issue.update({
    where: { id: issue.id },
    data: {
      title: validation.data.title,
      description: validation.data.description,
      status: status.data?.status,
    },
  });

  return NextResponse.json(updatedIssue);
}
