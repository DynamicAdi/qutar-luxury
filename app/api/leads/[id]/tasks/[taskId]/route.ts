import { db } from "@/lib/client";
import { NextResponse } from "next/server";
import { z } from "zod";

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  status: z.enum(["PENDING", "COMPLETED"]).optional(),
  tags: z.array(z.string().min(1)).default([]),
});

// UPDATE task
export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string; taskId: string }>;
  }
) {
  try {
    const { taskId } = await params;
    const body = await req.json();
    const parsed = updateTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed To Update Task",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updated = await db.leadTask.update({
      where: { id: taskId },
      data: {
        ...parsed.data,
        completedAt:
          parsed.data.status === "COMPLETED" ? new Date() : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Task updated",
    });
  } catch (err: any) {
    console.log(err.message);
    return NextResponse.json(
      { success: false, message: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE task
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { taskId } = await params;
    await db.leadTask.delete({
      where: { id: taskId },
    });

    return NextResponse.json({
      success: true,
      message: "Task deleted",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Failed to delete task" },
      { status: 500 }
    );
  }
}
