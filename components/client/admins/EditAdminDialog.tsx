"use client";

import axios from "axios";
import { useState, useTransition } from "react";

import {
  Pencil,
  Eye,
  EyeOff,
  ImageIcon,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";

import { Admin } from "@/store/cms";

export function EditAdminDialog({
  admin,
  mutate,
}: {
  admin: Admin;
  mutate: any;
}) {
  const [open, setOpen] = useState(false);

  const [loading, startTransition] =
    useTransition();

  const [showPassword, setShowPassword] =
    useState(false);

  const [form, setForm] = useState({
    name: admin.name || "",
    email: admin.email || "",
    password: "",
  });

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const submit = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();

        formData.append("name", form.name);

        formData.append("email", form.email);

        if (form.password.trim()) {
          formData.append(
            "password",
            form.password
          );
        }

        if (imageFile) {
          formData.append("image", imageFile);
        }

        const res = await axios.put(
          `/api/adminusers/${admin.id}`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        toast.success(
          res.data?.message ||
            "Admin updated successfully"
        );

        mutate();

        setOpen(false);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to update admin"
        );
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-3xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Admin</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-4">
          {/* NAME */}
          <div className="space-y-2">
            <Label>Name</Label>

            <Input
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="John Doe"
              className="h-11 rounded-xl"
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <Label>Email</Label>

            <Input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              placeholder="john@example.com"
              className="h-11 rounded-xl"
            />
          </div>

          {/* IMAGE */}
          <div className="space-y-2">
            <Label>Profile Image</Label>

            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImageFile(
                    e.target.files?.[0] || null
                  )
                }
                className="h-11 rounded-xl pl-10"
              />
            </div>

            {(imageFile || admin.image) && (
              <div className="pt-2">
                <img
                  src={
                    imageFile
                      ? URL.createObjectURL(
                          imageFile
                        )
                      : admin.image
                  }
                  alt="Preview"
                  className="h-16 w-16 rounded-2xl object-cover border"
                />
              </div>
            )}
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <Label>New Password</Label>

            <div className="relative">
              <Input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                placeholder="Leave blank to keep current password"
                className="h-11 rounded-xl pr-11"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* ACTION */}
          <Button
            onClick={submit}
            disabled={loading}
            className="h-11 w-full rounded-xl"
          >
            {loading
              ? "Updating..."
              : "Update Admin"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}