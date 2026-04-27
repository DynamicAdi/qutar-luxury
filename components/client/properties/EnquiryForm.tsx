import { useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Property } from "@/store/cms";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { getCookie, setCookie } from "cookies-next";


const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(6, "Enter a valid phone").max(20),
  budget: z.string().max(50).optional().or(z.literal("")),
  note: z.string().max(1000).optional().or(z.literal("")),
});

const EnquiryForm = ({ property }: { property: string }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", budget: "", note: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [transition, startTransition] = useTransition()
  const [userFingers, setUserFingers] = useState<string | null>(null)
  const [isSubmitted, setSubmitted] = useState<boolean>(false)
const submitLead = () =>
  startTransition(async () => {
    try {
      const req = await axios.post("/api/leads", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        budget: form.budget,
        note: form.note,
        propertyId: property,
        fingerprint: userFingers,
      });

      if (req.status === 201) {
        toast.success(
          "Your enquiry has been received\nWe will connect with you shortly"
        );

        setForm({
          name: "",
          email: "",
          phone: "",
          budget: "",
          note: "",
        });
      }

      if (req.status === 403) {
        toast.error(req.data.data)
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.data || "Something went wrong";

      toast.error(message);
    }
  });


  const checkFingerprint = (fingerprint: string) => startTransition(async() => {
    const req = await axios.get(`/api/fingerprint?fingerprint=${fingerprint}`)
    if (req.status === 200) {
      setSubmitted(req.data.success)
    }
  })
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
    submitLead()
  };

    useEffect(() => {
    let id = getCookie("userId");
    if (!id) {
      id = crypto.randomUUID();
      setCookie("userId", id, { maxAge: 60 * 60 * 24 * 365 }); // 1 year
    }
    checkFingerprint(id as string)
    setUserFingers(id as string);
  }, []);


  const field = (name: keyof typeof form, label: string, type = "text", placeholder = "", required: boolean) => (
    <div>
      <label className="block font-display text-sm text-muted-foreground mb-1">{label}</label>
      <input
        type={type}
        required={required}
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
        {field("name", "Full Name", "text", "Your name", true)}
        {field("email", "Email", "email", "you@example.com", true)}
        {field("phone", "Phone", "tel", "+974 …", true)}
        {field("budget", "Budget (optional)", "text", "e.g. 5M – 8M QAR", false)}
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
        disabled={isSubmitted || transition}
        className="mt-6 w-full bg-emerald text-primary-foreground font-display text-lg font-medium uppercase disabled:bg-emerald-deep tracking-widest disabled:cursor-not-allowed py-4 hover:bg-emerald-deep transition-colors grid place-items-center"
      >
        {transition ? <LoaderCircle className="animate-spin" size={16}/> : isSubmitted ? "Already submitted" : "SEND ENQUIRY"}
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">By submitting you agree to our terms.</p>
    </form>
  );
};

export default EnquiryForm;
