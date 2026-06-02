"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { LucideEdit3, LucidePlus, LucideTrash } from "lucide-react";
import React, { useEffect, useState, useTransition } from "react";

function CatCard({
  formData,
  onEdit,
  onDelete,
}: {
  formData: formData;
  onEdit: (data: formData) => void;
  onDelete: (name: string, id: string) => void;
}) {
  return (
    <div className="min-w-64 min-h-96 bg-white w-80 h-96 rounded-xl relative flex items-end justify-end group p-4">
      <img
        src={formData.image as string}
        className="absolute inset-0 w-full h-full object-cover rounded-xl"
      />
      <div className="w-full h-1/2 bg-white relative rounded-md p-3 flex flex-col justify-end gap-2 transition-all duration-300 ease-in-out">
        <div className="absolute w-full top-0 right-0 p-4 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
          <button onClick={() => onEdit(formData)}>
            <LucideEdit3 size={16} className="text-blue-400" />
          </button>

          <button
            onClick={() => onDelete(formData.name, formData.id as string)}
          >
            <LucideTrash size={16} className="text-red-400" />
          </button>
        </div>
        <h1 className="text-xl font-semibold">{formData.name}</h1>
        <p className="text-sm text-gray-400">{formData.subTitle}</p>

        <div className="w-full py-1 pb-1.5 px-2 text-gold border border-gold-glow rounded-md">
          <p className="text-xs">{formData.slug}</p>
        </div>
      </div>
    </div>
  );
}

interface formData {
  id?: string;
  name: string;
  subTitle: string;
  slug: string;
  image: File | string | null;
}
type DialogProps = {
  formData: formData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleClose: () => void;
handleUpdate?: (formData: formData) => Promise<any>;
  type?: "create" | "edit";
  loading?: boolean;
};

function Dialog({
  formData,
  handleChange,
  handleImageChange,
  handleSubmit,
  handleClose,
  type = "create",
  handleUpdate,
  loading = false,
}: DialogProps) {
  return (
    <div className="absolute inset-0 z-50 flex h-[95vh] w-full items-center justify-center bg-white/60 backdrop-blur-sm">
      <div className="w-1/2 rounded-xl bg-primary p-6">
        <h2 className="mb-6 text-2xl font-semibold text-white">
          {type === "create" ? "Create" : "Edit"} Category
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (type === "create") {
              handleSubmit(e as React.FormEvent<HTMLFormElement>);
            } else {
              if (handleUpdate) {
                void handleUpdate(formData);
              }
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="mb-2 block font-medium text-white">Title</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Title"
              className="w-full rounded-lg bg-accent-foreground/60 px-4 py-2 text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-white">
              Subtitle
            </label>
            <input
              type="text"
              name="subTitle"
              value={formData.subTitle}
              onChange={handleChange}
              placeholder="Enter subtitle"
              className="w-full rounded-lg bg-accent-foreground/60 px-4 py-2 text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-white">
              Slug / URL
            </label>
            <input
              type="url"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="https://example.com/category"
              className="w-full rounded-lg bg-accent-foreground/60 px-4 py-2 text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-white">Image</label>
            {
                formData.image && typeof formData.image === "string" && (
            <div className="w-full h-52">
                <img 
                src={formData.image as string}
                alt="preview"
                className="w-full h-full object-cover rounded-lg"
                />
            </div>
                )                
            }
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-lg bg-accent-foreground/60 px-4 py-2 text-white file:mr-4 file:rounded-md file:border-0 file:px-3 file:py-2 file:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" onClick={handleClose}>
              Cancel
            </Button>

            <Button size="lg" style={{ background: "#cbab48" }} type="submit">
              {loading ? "Processing..." : type === "create" ? "Create" : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function page() {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    subTitle: "",
    slug: "",
    image: "",
  });
  const [showDialog, setShowDialog] = useState(false);
  const [type, setType] = useState<"create" | "edit">("create");
  const [data, setData] = useState([]);
  const [submitThread, startSubmitThread] = useTransition();
  const [getterThread, startGetterThread] = useTransition();


  const handleChange = (e: any) => {
    const { name, value } = e.target;


    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files?.[0] || null,
    }));
  };

  const handleSubmit = async (e: any) => startSubmitThread(async () =>{
    e.preventDefault();

    try {
      let imageUrl = "";

      // 1. Upload image
      if (formData.image) {
        const uploadData = new FormData();
        uploadData.append("file", formData.image);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        const uploadResult = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(uploadResult.message || "Image upload failed");
        }

        imageUrl = uploadResult.url; // adjust key if your API returns something else
      }

      // 2. Create category
      const categoryRes = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          subTitle: formData.subTitle,
          slug: formData.slug,
          image: imageUrl,
        }),
      });

      const categoryResult = await categoryRes.json();

      if (!categoryRes.ok) {
        throw new Error(categoryResult.message || "Failed to create category");
      }

      setShowDialog(false);
      setFormData({
        id: "",
        name: "",
        subTitle: "",
        slug: "",
        image: "",
      });

      // close dialog / refresh data here if needed
    } catch (error) {
      console.error(error);
    }
  });

  const handleDelete = async (id: string) => {
    const del = await axios.delete(`/api/category?id=${id}`);
    if (del.status === 200) {
      window.location.reload();
    }
  };

  const askToDelete = (title: string, id: string) => {
    const ok = window.confirm(`Are you sure want to delete ${title}`);
    if (ok) {
      handleDelete(id);
    }
  };

  const handleEdit = (formData: formData) =>{
    setFormData({
      id: formData.id as string,
      name: formData.name,
      subTitle: formData.subTitle,
      slug: formData.slug,
      image: formData.image as string,
    });
    setType("edit");
    setShowDialog(true);
  };

  const handleUpdate = async (
    formData: formData
) => startSubmitThread(async () =>{
    try {
        let imageUrl = formData.image;   
        // Upload only if a new file was selected
        if (formData.image instanceof File) {
            const uploadData = new FormData();
            uploadData.append("file", formData.image);

            const uploadRes = await fetch("/api/uploads", {
                method: "POST",
                body: uploadData,
            });

            const uploadResult = await uploadRes.json();

            if (!uploadRes.ok) {
                throw new Error(
                    uploadResult.message || "Image upload failed"
                );
            }

            imageUrl = uploadResult.url;
        }

        const response = await fetch("/api/category", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: formData.id,
                name: formData.name,
                subTitle: formData.subTitle,
                slug: formData.slug,
                image: imageUrl,
            }),
        });

        const result = await response.json();
        setShowDialog(false)
      setFormData({
        id: "",
        name: "",
        subTitle: "",
        slug: "",
        image: "",
      });
      setType("create")
      if (!response.ok) {
            throw new Error(result.message || "Failed to update category");
        }

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
});

  const getData = async () => startGetterThread(async () =>{
    try {
      const res = await axios.get("/api/category");
      if (res.status === 200) {
        setData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="p-8 py-4 relative">
      {showDialog && (
        <Dialog
          formData={formData}
          handleChange={handleChange}
          handleImageChange={handleImageChange}
          handleSubmit={handleSubmit}
          handleClose={() => setShowDialog(false)}
          handleUpdate={handleUpdate}
          type={type}
          loading={submitThread}
        />
      )}
      <section className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p>Manage your product categories here.</p>
        </div>
        <div>
          <Button onClick={() => setShowDialog(true)} size="lg">
            Add Category <LucidePlus />
          </Button>
        </div>
      </section>
      <div className="flex gap-8 justify-start items-start mt-6 flex-wrap">
        {data.length > 0 ? (
          data.map((item: formData) => (
            <CatCard
            key={item.id}
              formData={item}
              onDelete={askToDelete}
              onEdit={handleEdit}
            />
          ))
        ) : (
          <p className="text-gray-500">No categories found. Please add some.</p>
        )}
      </div>
    </div>
  );
}

export default page;
