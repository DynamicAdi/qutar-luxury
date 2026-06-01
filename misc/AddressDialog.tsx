"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent,
    DialogFooter,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AddressEntry } from "@/store/cms";
import { Loader } from "lucide-react";

import { handleKeyDown } from "@/lib/InputKeyDown";

function AddressDialog({ open, setOpen, editing, save, loading, setEditing}: Readonly<{
    open: boolean;
    loading: boolean;
    editing: AddressEntry | null;
    setOpen: (open: boolean) => void;
    setEditing: (entry: AddressEntry | null) => void;
    save: () => void;
}>) {



  return (
          <Dialog open={open || loading} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>New address</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <Field label="Label *"><Input required value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value.slice(0, 100) })} className="rounded-xl" placeholder="Pearl Marina, Doha" /></Field>
              <p className="text-right text-[0.6rem] text-gray-400">{editing.label.length}/100</p>
              <Field label="Street Address *"><Input required value={editing.street} onChange={(e) => setEditing({ ...editing, street: e.target.value })} className="rounded-xl" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="City *"><Input required value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} className="rounded-xl" /></Field>
                <Field label="State *"><Input required value={editing.state} onChange={(e) => setEditing({ ...editing, state: e.target.value })} className="rounded-xl" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Latitude *"><Input required type="number" onKeyDown={(e) => handleKeyDown(e)} value={editing.latitude ?? ""} onChange={(e) => setEditing({ ...editing, latitude: e.target.value ? +e.target.value : undefined })} className="rounded-xl" /></Field>
                <Field label="Longitude *"><Input required type="number" onKeyDown={(e) => handleKeyDown(e)} value={editing.longitude ?? ""} onChange={(e) => setEditing({ ...editing, longitude: e.target.value ? +e.target.value : undefined })} className="rounded-xl" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Gmaps"><Input type="text" value={editing.gmaps ?? ""} onChange={(e) => setEditing({ ...editing, gmaps: e.target.value })} className="rounded-xl" /></Field>
                <Field label="ZipCode *"><Input required type="number" onKeyDown={(e) => handleKeyDown(e)} value={editing.zipCode ?? ""} max={6} maxLength={6} onChange={(e) => setEditing({ ...editing, zipCode: e.target.value ? +e.target.value.slice(0, 6) : undefined })} className="rounded-xl" /></Field>
              </div>
              {/* <Field label="Notes"><Textarea value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} className="rounded-xl" /></Field> */}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={save} className="rounded-xl bg-primary text-primary-foreground shadow-gold">{loading ? <Loader className="animate-spin" /> : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}




export default AddressDialog