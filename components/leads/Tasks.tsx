"use client";

import React, { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Pencil,
  Trash2,
  CheckCheck,
} from "lucide-react";

import Pagination from "@/components/Pagination";
import { useLeadTasks } from "@/hooks/leads/useLeadTasks";
import { usePaginationFrontend } from "@/hooks/usePaginationFrontend";
import { LeadTask } from "@/store/cms";
import TaskDialog from "./TaskDialog";

const priorityColor = {
  LOW: "bg-green-100 text-green-700 border-green-200",
  MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
  HIGH: "bg-red-100 text-red-700 border-red-200",
};

export default function Tasks({ id }: { id: string }) {
  const { tasks, isLoading, mutate } = useLeadTasks(id);
  const [isPending, startTransition] = useTransition();

  const {
    page,
    setPage,
    totalPages,
    paginatedData,
    hasNext,
    hasPrev,
    next,
    prev,
  } = usePaginationFrontend<LeadTask[]>({
    data: tasks,
    pageSize: 5,
  });

  const updateStatus = (taskId: string) => {
    startTransition(async () => {
      await fetch(`/api/leads/${id}/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });

      mutate();
    });
  };

  const deleteTask = (taskId: string) => {
    startTransition(async () => {
      await fetch(`/api/leads/${id}/tasks/${taskId}`, {
        method: "DELETE",
      });

      mutate();
    });
  };

  if (isLoading) {
    return (
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 animate-pulse bg-muted rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Task Management</CardTitle>
        <TaskDialog onSuccess={mutate} mode="create" leadId={id}>
          <Button>Create Task</Button>
        </TaskDialog>
      </CardHeader>

      <CardContent className="space-y-3">
        {paginatedData.length > 0 ? (
          paginatedData.map((t: any) => {
            const isOverdue =
              t.status === "PENDING" && new Date(t.dueDate) < new Date();

            return (
              <div
                key={t.id}
                className={`group relative overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  isOverdue ? "border-red-200" : "border-border"
                }`}
              >
                {/* COLOR ACCENT */}
                <div
                  className={`absolute left-0 top-0 h-full w-1.5 ${
                    t.status === "COMPLETED"
                      ? "bg-gradient-to-b from-emerald-400 to-green-600"
                      : isOverdue
                      ? "bg-gradient-to-b from-red-400 to-rose-600"
                      : t.priority === "HIGH"
                      ? "bg-gradient-to-b from-orange-400 to-red-500"
                      : t.priority === "MEDIUM"
                      ? "bg-gradient-to-b from-yellow-300 to-amber-500"
                      : "bg-gradient-to-b from-lime-300 to-green-500"
                  }`}
                />

                <div className="p-5 pl-6">
                  <div className="flex justify-between gap-5">
                    {/* LEFT BLOCK */}
                    <div className="flex flex-1 gap-4">
                      {/* ICON HOLDER */}
                      <div
                        className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
                          t.status === "COMPLETED"
                            ? "bg-green-50 border-green-200"
                            : isOverdue
                            ? "bg-red-50 border-red-200"
                            : "bg-muted/40 border-border"
                        }`}
                      >
                        {t.status === "COMPLETED" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : isOverdue ? (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>

                      {/* DETAILS */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-[15px] font-semibold leading-snug text-foreground">
                            {t.title}
                          </h3>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Created on{" "}
                            {new Date(t.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {t.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {t.tags.slice(0, 5).map((tag: string) => (
                              <Tag key={tag} text={"#"+tag}/>
                            ))}

                            {t.tags.length > 5 && (
                              <Tag text={`+${t.tags.length - 5} more`} />
                            )}
                          </div>
                        )}
                        {/* META CHIPS */}
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            className={`rounded-full px-3 py-1 text-[10px] font-semibold border ${
                              priorityColor[
                                t.priority as keyof typeof priorityColor
                              ]
                            }`}
                          >
                            {t.priority} PRIORITY
                          </Badge>

                          <Badge
                            variant="outline"
                            className={`rounded-full px-3 py-1 text-[10px] ${
                              t.status === "COMPLETED"
                                ? "text-green-700 border-green-200 bg-green-50"
                                : "text-slate-600"
                            }`}
                          >
                            {t.status}
                          </Badge>

                          <Badge
                            variant="outline"
                            className={`rounded-full px-3 py-1 text-[10px] ${
                              isOverdue
                                ? "text-red-700 border-red-200 bg-red-50"
                                : "text-slate-600"
                            }`}
                          >
                            {t.dueDate
                              ? `Due ${new Date(
                                  t.dueDate
                                ).toLocaleDateString()}`
                              : "No Deadline"}
                          </Badge>
                        </div>

                        {/* WARNING TEXT */}
                        {isOverdue && (
                          <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                            This task deadline has passed and requires immediate
                            attention.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RIGHT ACTION PANEL */}
                    <div className="flex flex-col justify-between items-end">
                      <div className="mt-5 flex flex-col gap-2 opacity-0 translate-x-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                        {/* EDIT */}
                        <TaskDialog
                          onSuccess={mutate}
                          mode="update"
                          initialData={t}
                          leadId={id}
                        >
                          <button
                            className="h-9 w-9 rounded-xl border bg-blue-50 border-blue-200 flex items-center justify-center hover:scale-105 transition"
                            disabled={isPending}
                          >
                            <Pencil className="h-4 w-4 text-green-600" />
                          </button>
                        </TaskDialog>

                        {/* DELETE */}
                        <button
                          onClick={() => deleteTask(t.id)}
                          disabled={isPending}
                          className="h-9 w-9 rounded-xl border bg-red-50 border-red-200 flex items-center justify-center hover:scale-105 transition disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>

                        {/* COMPLETE */}
                        {t.status === "PENDING" && (
                          <button
                            onClick={() => updateStatus(t.id)}
                            disabled={isPending}
                            className="h-9 w-9 rounded-xl border bg-green-50 border-green-200 flex items-center justify-center hover:scale-105 transition disabled:opacity-50"
                          >
                            <CheckCheck className="h-4 w-4 text-green-600" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <h6 className="text-center">No Tasks Added!</h6>
        )}
      </CardContent>

      {/* PAGINATION */}
      <Pagination
        page={page}
        totalPages={totalPages}
        hasPrevPage={hasPrev}
        hasNextPage={hasNext}
        onPrev={prev}
        onNext={next}
        onPageChange={setPage}
      />
    </Card>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <div
      key={text}
      className="
        rounded-full
        border border-primary/10
        bg-primary/5
        px-2.5 py-1
        text-[10px]
        font-medium
        text-primary
      "
    >
      {text}
    </div>
  );
}
