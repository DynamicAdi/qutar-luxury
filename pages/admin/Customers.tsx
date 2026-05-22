"use client";

import Pagination from "@/components/Pagination";
import { PageHeader } from "@/components/qlp/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { usePaginatedFetch } from "@/components/usePaginationFetch";
import { CUSTOMER_STATUS } from "@/generated/prisma/enums";
import { handleKeyDown } from "@/lib/InputKeyDown";
import { cn } from "@/lib/utils";
import LoaderScreen from "@/misc/LoaderScreen";
import { Customer, formatPrice } from "@/store/cms";
import axios from "axios";
import {
    Banknote,
    Check,
    Edit2,
    Loader,
    Mail,
    Phone,
    Plus,
    Trash2,
    WalletCards
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export default function Customers() {
  const [openLink, setOpenLink] = useState(false);
  const [open, setOpen] = useState(false);
  const [linkFor, setLinkFor] = useState<Customer | null>(null);
  const [form, setForm] = useState({
    customId: "",
    name: "",
    email: "",
    phone: "",
    nationality: "Qatari",
    propertyIds: [""],
    status: "",
    dealAmount: 0,
    paymentMethod: "",
    closingDate: "",
    note: "",
  });
  const [formType, setFormType] = useState<"EDIT" | "NEW">("NEW");
  const [avaprop, setAvaprop] = useState([]);
  const [search, startSearch] = useTransition();
  const [saveProcess, startSaveProcess] = useTransition();
  // const [customerSearch, startcustomerSearch] = useTransition();
  const [deleteThread, startDeleteThread] = useTransition();
  const [panigation, setPanigation] = useState([]);
  // const [customers, setCustomers] = useState<Customer[]>([]);

  const availableProperties = () => {
    startSearch(async () => {
      const req = await axios.get(
        `/api/properties?customers=${Boolean("true")}`
      );
      if (req.status === 200) {
        setAvaprop(req.data.data);
      }
    });
  };

  // const getCustomers = () =>
  //   startcustomerSearch(async () => {
  //     const req = await axios.get(`/api/customers`);
  //     if (req.status === 200) {
  //       setCustomers(req.data.data);
  //       setPanigation(req.data.panigation);
  //       console.log(req.data);
  //     }
  //   });
  const {
    rows: customers,
    pagination,
    loading: customerSearch,
    page,
    pageNumbers,

    nextPage,
    prevPage,
    goToPage,
    refresh,
  } = usePaginatedFetch<Customer>({
    url: "/api/customers",
    limit: 10,
  });
  const deleteCustomer = (id: string) =>
    startDeleteThread(async () => {
      const del = await axios.delete(`/api/customers?id=${id}`);
      if (del.status === 200) {
        // getCustomers();
        refresh();
      }
    });

  const updateCustomer = async () => {
    startSaveProcess(async () => {
      const req = await axios.put(`/api/customers`, {
        id: form.customId,
        name: form.name,
        email: form.email,
        phone: form.phone,
        status: form.status,
        nationality: form.nationality,
        propertyIds: form.propertyIds,
        dealAmount: form.dealAmount,
        paymentMethod: form.paymentMethod,
        closingDate: new Date(form.closingDate),
        note: form.note,
      });

      if (req.status === 200) {
        toast.success("Customer updated");
        setForm({
          customId: "",
          name: "",
          email: "",
          phone: "",
          nationality: "Qatari",
          propertyIds: [],
          status: "",
          dealAmount: 0,
          paymentMethod: "",
          closingDate: "",
          note: "",
        });
        setOpen(false);
        refresh();
      }
    });
  };

  const saveCustomer = () =>
    startSaveProcess(async () => {
      const req = await axios.post("/api/customers", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        status: form.status,
        nationality: form.nationality,
        propertyIds: form.propertyIds,
        dealAmount: form.dealAmount,
        paymentMethod: form.paymentMethod,
        closingDate: new Date(form.closingDate),
        note: form.note,
      });

      if (req.status === 201) {
        toast.success("Customer added & property linked");
        setForm({
          customId: "",
          name: "",
          email: "",
          phone: "",
          nationality: "Qatari",
          propertyIds: [],
          status: "",
          dealAmount: 0,
          paymentMethod: "",
          closingDate: "",
          note: "",
        });
        setOpen(false);
        refresh();
      }
    });

  const submit = (e: React.SubmitEvent, cId?: string) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone)
      return toast.error("Name and email required");
    if (form.propertyIds.length === 0)
      return toast.error("Please link at least one property");
    formType === "NEW" ? saveCustomer() : updateCustomer();
  };

  useEffect(() => {
    if (open || (openLink && avaprop.length === 0)) {
      availableProperties();
    }
  }, [open, openLink]);

  // useEffect(() => {
  //   getCustomers();
  // }, []);

  if (customerSearch) {
    return <LoaderScreen />;
  }
  return (
    <>
      <PageHeader
        eyebrow="clients"
        title="Customers"
        subtitle="Manage your client portfolio. Every customer must own at least one property — linking auto-marks it as Sold."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl py-5 bg-gradient-gold text-primary-foreground shadow-gold">
                <Plus className="h-4 w-4 mr-1.5" /> Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle>{formType} Customer</DialogTitle>
              </DialogHeader>
              <form onSubmit={submit} className="space-y-2 h-auto">
                <div>
                  <Label>
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    className="rounded-xl my-1 "
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="email"
                    className="rounded-xl my-3"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>
                      Phone <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="number"
                      className="rounded-xl my-3"
                      onKeyDown={(e) => handleKeyDown(e)}
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value.slice(0, 10) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Nationality</Label>
                    <Input
                      className="rounded-xl my-3"
                      value={form.nationality}
                      onChange={(e) =>
                        setForm({ ...form, nationality: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>
                      Deal Amount <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="number"
                      className="rounded-xl my-3"
                      onKeyDown={(e) => handleKeyDown(e)}
                      value={form.dealAmount}
                      onChange={(e) =>
                        setForm({ ...form, dealAmount: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>
                      Payment Method <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={form.paymentMethod || "Bank Transfer"}
                      onValueChange={(e) =>
                        setForm({ ...form, paymentMethod: e })
                      }
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Bank Transfer",
                          "Cash",
                          "Mortgage",
                          "Installments",
                          "Cheque",
                        ].map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>
                      Closing Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="date"
                      className="rounded-xl my-3"
                      onKeyDown={(e) => handleKeyDown(e)}
                      value={form.closingDate}
                      onChange={(e) =>
                        setForm({ ...form, closingDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Note</Label>
                    <Input
                      className="rounded-xl my-3"
                      value={form.note}
                      onChange={(e) =>
                        setForm({ ...form, note: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/*  */}

                <CustomerStatusSelect
                  value={form.status}
                  onChange={(v) =>
                    setForm((prev: any) => ({
                      ...prev,
                      status: v,
                    }))
                  }
                />
                <PropertySelect
                  avaprop={avaprop}
                  form={form}
                  setForm={setForm}
                  search={search}
                  formatPrice={formatPrice}
                />
                <DialogFooter>
                  <Button
                    type="submit"
                    className="rounded-xl bg-gradient-gold text-primary-foreground"
                  >
                    {saveProcess ? (
                      <Loader size={14} className="animate-spin" />
                    ) : formType === "EDIT" ? (
                      "Update Customer"
                    ) : (
                      "Add Customer"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="overflow-hidden border-none py-0 border-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-gold text-xs uppercase tracking-wider text-white">
              <tr>
                <th className="text-left px-4 py-3.5">Customer</th>
                <th className="text-left px-4 py-3.5 hidden md:table-cell">
                  Contact
                </th>
                <th className="text-left px-4 py-3.5 hidden sm:table-cell">
                  Deal Amount
                </th>
                <th className="text-left px-4 py-3.5">Closing Date</th>
                <th className="text-left px-4 py-3.5">Status</th>
                <th className="text-left px-4 py-3.5">Linked Properties</th>
                <th className="text-left px-4 py-3.5">Nationality</th>
                <th className="text-left px-4 py-3.5">Note</th>
                <th className="text-right px-4 py-3.5">Actions</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((c, i) => (
                <tr
                  key={c.id}
                  className="border-t border-border hover:bg-secondary/30 animate-fade-in-up"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-gold text-primary-foreground flex items-center justify-center text-xs font-semibold">
                        {c.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>

                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Joined {new Date(c.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {c.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {c.phone}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 hidden sm:table-cell text-muted-foreground">
                    <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Banknote className="h-3 w-3" /> {c.dealAmount}
                      </span>
                      <span className="flex items-center gap-1">
                        <WalletCards className="h-3 w-3" /> {c.paymentMethod}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 hidden sm:table-cell text-muted-foreground">
                    {c.closingDate?.split("T")[0]}
                  </td>

                  <td className="px-4 py-3.5 hidden sm:table-cell text-muted-foreground">
                    {c.status.charAt(0) + c.status.slice(1).toLowerCase()}
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {c.properties.length === 0 && (
                        <span className="text-xs text-muted-foreground">
                          None linked
                        </span>
                      )}

                      {c.properties.map((pr) => (
                        <Badge
                          key={pr.id}
                          className="rounded-md gap-1 bg-green-400/15 text-[hsl(142_55%_28%)] hover:bg-success/15 border border-green-400/30 pr-1"
                        >
                          {pr.title.slice(0, 24)}
                        </Badge>
                      ))}
                    </div>
                  </td>

                  <td className="px-4 py-3.5 hidden sm:table-cell text-muted-foreground">
                    {c.nationality}
                  </td>

                  <td className="px-4 py-3.5 hidden sm:table-cell text-muted-foreground">
                    {c.note || "-"}
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => {
                          setFormType("EDIT");
                          setOpen(true);

                          setForm({
                            customId: c.id,
                            name: c.name,
                            email: c.email,
                            nationality: c.nationality,
                            phone: c.phone,
                            status: c.status,
                            propertyIds: c.properties?.map((p) => p.id) ?? [],
                            dealAmount: c.dealAmount as number,
                            paymentMethod: c.paymentMethod as string,
                            closingDate: c.closingDate?.split("T")[0] as string,
                            note: c.note as string,
                          });
                        }}
                        className="rounded-lg p-2 hover:text-yellow-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => deleteCustomer(c.id)}
                        className="rounded-lg p-2 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {customers.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No customers yet. Add your first.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        {/* {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <button
              onClick={prevPage}
              disabled={!pagination?.hasPrevPage}
              className="px-3 py-1 rounded-md border disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>

            <div className="flex items-center gap-2">
              {pageNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => goToPage(num)}
                  className={`h-9 w-9 rounded-md border text-sm transition ${
                    page === num
                      ? "bg-primary text-white border-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              onClick={nextPage}
              disabled={!pagination?.hasNextPage}
              className="px-3 py-1 rounded-md border disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )} */}
        <Pagination
          page={page}
          totalPages={pagination?.totalPages ?? 0}
          hasPrevPage={pagination?.hasPrevPage ?? false}
          hasNextPage={pagination?.hasNextPage ?? false}
          onPrev={prevPage}
          onNext={nextPage}
          onPageChange={goToPage}
        />
      </Card>
    </>
  );
}

type Property = {
  id: string;
  title: string;
  price: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
};

function PropertySelect({
  avaprop,
  form,
  setForm,
  search,
  formatPrice,
}: Readonly<{
  avaprop: Property[];
  form: any;
  setForm: (v: any) => void;
  search: boolean;
  formatPrice: (price: number) => string;
}>) {
  const [open, setOpen] = useState(false);

  const toggleProperty = (id: string) => {
    const exists = form.propertyIds.includes(id);

    setForm({
      ...form,
      propertyIds: exists
        ? form.propertyIds.filter((p: string) => p !== id)
        : [...form.propertyIds, id],
    });
  };

  const removeProperty = (id: string) => {
    setForm({
      ...form,
      propertyIds: form.propertyIds.filter((p: string) => p !== id),
    });
  };

  const selectedProperties = avaprop.filter((p) =>
    form.propertyIds.includes(p.id)
  );

  return (
    <div className="w-full">
      <Label>
        Linked Properties <span className="text-destructive">*</span>
      </Label>

      {/* SELECT BUTTON */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            // variant="outline"
            role="combobox"
            disabled={search}
            className="w-full justify-between my-3 rounded-xl py-2 px-4 h-auto"
          >
            {search ? (
              "Loading Properties..."
            ) : selectedProperties.length > 0 ? (
              <div className="flex flex-col items-start text-left gap-1">
                <span className="font-medium">
                  {selectedProperties.length} selected
                </span>

                <div className="flex flex-wrap gap-1">
                  {selectedProperties.map((p) => (
                    <span
                      key={p.id}
                      className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md text-xs"
                    >
                      {p.title}

                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          removeProperty(p.id);
                        }}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </div>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="">Select properties to link</div>
            )}

            {/* <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" /> */}
          </button>
        </PopoverTrigger>

        {/* DROPDOWN */}
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search property..." />

            <CommandList>
              <CommandEmpty>No properties found.</CommandEmpty>

              {avaprop.length > 0 ? (
                avaprop.map((p) => {
                  const isSelected = form.propertyIds.includes(p.id);

                  return (
                    <CommandItem
                      key={p.id}
                      value={`${p.title} ${p.address.city} ${p.address.state}`}
                      onSelect={() => toggleProperty(p.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />

                      <div className="flex flex-col">
                        <span>
                          {p.title} — {formatPrice(p.price)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {p.address.street}, {p.address.city},{" "}
                          {p.address.state}, {p.address.zipCode}
                        </span>
                      </div>
                    </CommandItem>
                  );
                })
              ) : (
                <div className="p-2 text-sm text-muted-foreground">
                  No Properties Available
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <p className="text-[11px] text-muted-foreground my-3">
        Required. Properties will be marked as Sold.
      </p>
    </div>
  );
}

function CustomerStatusSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: CUSTOMER_STATUS) => void;
}) {
  return (
    <div className="w-full">
      <Label>Customer Status</Label>

      <Select
        value={value}
        onValueChange={(v) => onChange(v as CUSTOMER_STATUS)}
      >
        <SelectTrigger className="my-3 w-full rounded-xl">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value={CUSTOMER_STATUS.PURCHASED}>Purchased</SelectItem>
          <SelectItem value={CUSTOMER_STATUS.INTERESTED}>Interested</SelectItem>
          <SelectItem value={CUSTOMER_STATUS.BOOKED}>Booked</SelectItem>
          <SelectItem value={CUSTOMER_STATUS.INPROGRESS}>
            In Progress
          </SelectItem>
          <SelectItem value={CUSTOMER_STATUS.LOST}>Lost</SelectItem>
          <SelectItem value={CUSTOMER_STATUS.PAID_HALF}>Paid Half</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
