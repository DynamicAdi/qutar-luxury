"use client";

import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FileText, Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

function Documents({ p, upd }: { p: any; upd: any }) {
  const [docName, setDocName] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handlePdfUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    replaceIndex?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const req = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const res = await req.json();

    if (!res.url) {
      toast.error("Upload failed");
      return;
    }

    const updatedDocs = [...(p.documents || [])];

    const finalName = docName.trim() || file.name.replace(".pdf", "");

    if (replaceIndex !== undefined) {
      updatedDocs[replaceIndex] = {
        name: finalName,
        file: res.url,
      };
    } else {
      updatedDocs.push({
        name: finalName,
        file: res.url,
      });
    }

    upd("documents", updatedDocs);
    setDocName("");
    e.target.value = "";
    toast.success("PDF uploaded");
  };

  const removeDocument = (index: number) => {
    const ask = window.confirm("Delete this document?");
    if (!ask) return;

    const updated = p.documents.filter((_: any, i: number) => i !== index);
    upd("documents", updated);
    toast.success("Document removed");
  };

  return (
    <Card className="rounded-2xl p-5 shadow-card border-0 space-y-5">
      <Field label="Property Documents">
        <p className="text-xs text-gray-500 mb-3">
          Upload brochures, floor plans, ownership papers, legal PDFs and more.
        </p>

        {/* uploaded docs preview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {p.documents?.map((doc: any, i: number) => (
            <div
              key={i}
              className="relative group rounded-xl border bg-card aspect-video flex flex-col items-center justify-center text-center p-3"
            >
              <FileText className="h-8 w-8 mb-2 text-emerald" />

              <p className="text-xs font-medium line-clamp-2">{doc.name}</p>

              <a
                href={doc.file}
                target="_blank"
                className="text-[10px] text-muted-foreground underline mt-1"
              >
                View PDF
              </a>

              <button
                onClick={() => removeDocument(i)}
                className="absolute top-2 right-2 rounded-full bg-card/90 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {/* hidden input */}
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            hidden
            id="pdfUploader"
            onChange={handlePdfUpload}
          />

          {/* add tile */}
          <label
            htmlFor="pdfUploader"
            className="rounded-xl border-2 border-dashed border-border aspect-video flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
          >
            <Upload className="h-5 w-5 mb-1" />
            <span className="text-xs">Add PDF</span>
          </label>
        </div>

        {/* document name */}
        <Input
          value={docName}
          onChange={(e) => setDocName(e.target.value)}
          placeholder="Document title (optional e.g. Brochure / Floor Plan)"
          className="rounded-xl"
        />
      </Field>
    </Card>
  );
}

export default Documents;
