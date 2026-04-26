import { useState } from "react";
import { z } from "zod";
import { Property } from "@/lib/properties";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(6, "Enter a valid phone").max(20),
  budget: z.string().max(50).optional().or(z.literal("")),
  note: z.string().max(1000).optional().or(z.literal("")),
});

const EnquiryForm = ({ property }: { property: Property }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", budget: "", note: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    toast.success("We will be in touch soon")
    // toast({
    //   title: "Enquiry sent",
    //   description: `We'll be in touch about ${property.title}.`,
    // });
    setForm({ name: "", email: "", phone: "", budget: "", note: "" });
  };

  const field = (name: keyof typeof form, label: string, type = "text", placeholder = "") => (
    <div>
      <label className="block font-display text-sm text-muted-foreground mb-1">{label}</label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        placeholder={placeholder}
        className="w-full bg-background border border-border px-3 py-2.5 font-body text-foreground outline-none focus:border-emerald transition-colors"
      />
      {errors[name] && <p className="mt-1 text-xs text-destructive">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={submit} className="bg-card border border-border p-6 shadow-card">
      <p className="font-display tracking-[0.3em] text-emerald text-xs mb-2">ENQUIRE</p>
      <h3 className="font-display text-3xl leading-none mb-1">TALK TO US</h3>
      <p className="text-sm text-muted-foreground mb-5">No commitment. A specialist will reach out within 24 hours.</p>

      <div className="space-y-4">
        {field("name", "Full Name", "text", "Your name")}
        {field("email", "Email", "email", "you@example.com")}
        {field("phone", "Phone", "tel", "+974 …")}
        {field("budget", "Budget (optional)", "text", "e.g. 5M – 8M QAR")}
        <div>
          <label className="block font-display text-sm text-muted-foreground mb-1">Note (optional)</label>
          <textarea
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            rows={3}
            maxLength={1000}
            className="w-full bg-background border border-border px-3 py-2.5 font-body text-foreground outline-none focus:border-emerald transition-colors resize-none"
            placeholder="Anything specific?"
          />
          {errors.note && <p className="mt-1 text-xs text-destructive">{errors.note}</p>}
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-emerald text-primary-foreground font-display text-xl tracking-widest py-4 hover:bg-emerald-deep transition-colors"
      >
        SEND ENQUIRY
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">By submitting you agree to our terms.</p>
    </form>
  );
};

export default EnquiryForm;
