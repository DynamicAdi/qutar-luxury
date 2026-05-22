"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent,
    DialogFooter,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { handleKeyDown } from "@/lib/InputKeyDown";
import { AgentEntry } from "@/store/cms";
import { Loader } from "lucide-react";


function AgentDialog({open, setOpen, editing, save, setEditing, loading}: Readonly<{
    open: boolean;
    loading: boolean;
    setOpen: (open: boolean) => void;
    editing: any;
    save: () => void;
    setEditing: (editing: AgentEntry) => void;
}>) {
  return (
      <Dialog open={open || loading} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>New agent</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <Field label="Name"><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="rounded-xl" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Phone"><Input onKeyDown={(e) => handleKeyDown(e)} value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value.slice(0, 10) })} className="rounded-xl" /></Field>
                <Field label="Email"><Input type="email" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} className="rounded-xl" /></Field>
              </div>
              <Field label="Bio"><Textarea value={editing.bio ?? ""} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} className="rounded-xl" /></Field>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={save} className="rounded-xl bg-primary text-primary-foreground shadow-gold">{loading ? <Loader className="animate-spin"/> : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}

export default AgentDialog