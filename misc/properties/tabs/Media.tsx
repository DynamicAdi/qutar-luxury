"use client";

import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { removeBgAndPreview } from "@/lib/bgRemover";
import { deleteFile } from "@/lib/uploadImage";
import { ImageIcon, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function Media({ p, upd }: { p: any; upd: any }) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string[]>(p.images || []);
  const [deleteThread, setDeleteThread] = useState<boolean>(false);

type ImageInput = File | string;
type ImageType = "3D" | "ROW";


function handleImageUpload(
  e: React.ChangeEvent<HTMLInputElement>,
  currentImages: ImageInput[]
) {
  const files = Array.from(e.target.files || []);

  // 1. Update upload state (real data)
  const updatedImages: ImageInput[] = [
    ...currentImages,
    ...files,
  ];

  upd("images", updatedImages);

  // 2. Convert ALL images (existing + new) into preview URLs
  const existingPreviews = currentImages.map((img) =>
    typeof img === "string" ? img : URL.createObjectURL(img)
  );
  

  const newPreviews = files.map((file) =>
    URL.createObjectURL(file)
  );

  // 3. Merge both
  setPreviewImage([...existingPreviews, ...newPreviews]);
}


  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const result = await removeBgAndPreview(file);
    const previewUrl = URL.createObjectURL(result);
    
    setImage(previewUrl);
    upd("pngImage", result)
    setLoading(false);
  };


  const deleteImage = async (type: ImageType, filepath: string) => {
    setDeleteThread(true)
    if (!filepath) {
      return
    }
    const del = await deleteFile(filepath)
    if (del) {
      if (type === "ROW") {

      }
      if (type === "3D") {
        setImage(null)
      }
      toast.success("deleted")
    }
  }

  const askToDelete = (type: ImageType, file: string) => {
    const ask = window.confirm("Are you sure want to delete this Image?")
    if (ask) {
      deleteImage(type, file)
    }
  }
  useEffect(() => {
    setPreviewImage([...previewImage, p.images])
    if (p.pngImage) {
      setImage(p.pngImage)
    }
  }, [])
  return (
    <Card className="rounded-2xl p-5 shadow-card border-0 space-y-4">
      <div>
        <Label className="mb-2 block">Image Gallery</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {previewImage.map((img: any, i: number) => (
            <div
              key={i}
              className="relative group rounded-xl overflow-hidden aspect-video"
            >
              <img
                src={img}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <button
                onClick={() => askToDelete("3D", img)}
                className="absolute top-2 right-2 rounded-full bg-card/90 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => handleImageUpload(e, p.images)}
            className="hidden"
            id="imageUpload"
          />

          <label
            htmlFor="imageUpload"
            className="rounded-xl border-2 border-dashed border-border aspect-video flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
          >
            <ImageIcon className="h-5 w-5 mb-1" />
            <span className="text-xs">Add image</span>
          </label>
        </div>
      </div>

      {/* <Field label="3D IMAGE *">
        <p className="text-xs text-gray-500 mb-3">
          Please use <span className="text-rose-400">3D style image</span> of
          property, Background will be removed automatically. <span className="text-rose-400">{"(MAX 5MB)"}</span>
        </p>
        <div className="grid grid-cols-3">
          {image ? (
            <>
              <div className="relative group rounded-xl overflow-hidden aspect-video">
                <img
                  src={image}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <button
                  onClick={() => askToDelete("3D", image)}
                  className="absolute top-2 right-2 rounded-full bg-card/90 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          ) : (
            <>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={loading ? () => {} : handleChange}
                className="hidden"
                id="ThreeDImage"
                disabled={loading}
              />

              <label
                htmlFor="ThreeDImage"
                className="rounded-xl border-2 border-dashed border-border aspect-video flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                {loading ? (
                  <LucideLoader className="animate-spin" size={16} />
                ) : (
                  <>
                    <ImageIcon className="h-5 w-5 mb-1" />
                    <span className="text-xs">Add 3D IMAGE</span>
                  </>
                )}
              </label>
            </>
          )}
        </div>
      </Field> */}
      <Field label="Video Tour URL">
        <Input
          value={p.videoTourUrl || ""}
          onChange={(e) => upd("videoTourUrl", e.target.value)}
          className="rounded-xl"
          placeholder="https://youtube.com/..."
        />
      </Field>
    </Card>
  );
}

export default Media;
