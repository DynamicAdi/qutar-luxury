"use client";

import axios from "axios";
import { useState, useTransition } from "react";

import { UserPlus, ImageIcon, X } from "lucide-react";

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

export function AddAdminDialog({
  mutate,
  refreshStats
}: {
  mutate: any;
  refreshStats: any
}) {
  const [open, setOpen] = useState(false);

  const [loading, startTransition] = useTransition();

  const [imagePreview, setImagePreview] =
    useState<string>("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    image: null as File | null,
  });

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setForm({
      ...form,
      image: file,
    });

    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setForm({
      ...form,
      image: null,
    });

    setImagePreview("");
  };

  const submit = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("password", form.password);

        if (form.image) {
          formData.append("image", form.image);
        }

        const res = await axios.post(
          "/api/adminusers",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        toast.success(
          res.data?.message || "Admin added"
        );

        mutate();
        refreshStats();
        setOpen(false);

        setForm({
          name: "",
          email: "",
          password: "",
          image: null,
        });

        setImagePreview("");
      } catch (error: any) {
        console.log(error);

        toast.error(
          error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Failed to add admin"
        );
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-12 rounded-2xl px-5">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-3xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Admin User</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-4">
          {/* NAME */}
          <div className="space-y-2">
            <Label>Name</Label>

            <Input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
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
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              placeholder="john@example.com"
              className="h-11 rounded-xl"
            />
          </div>

          {/* IMAGE */}
          <div className="space-y-2">
            <Label>Profile Image</Label>

            {imagePreview ? (
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl border">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="adminImage"
                />

                <label
                  htmlFor="adminImage"
                  className="flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 transition hover:border-primary"
                >
                  <ImageIcon className="mb-2 h-5 w-5 text-muted-foreground" />

                  <span className="text-sm text-muted-foreground">
                    Upload profile image
                  </span>
                </label>
              </>
            )}
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <Label>Password</Label>

            <Input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              placeholder="••••••••"
              className="h-11 rounded-xl"
            />
          </div>

          {/* SUBMIT */}
          <Button
            onClick={submit}
            disabled={loading}
            className="h-11 w-full rounded-xl"
          >
            {loading
              ? "Creating..."
              : "Create Admin"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}