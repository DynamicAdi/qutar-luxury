import Navbar from "@/components/client/global/Navbar";
import { Footer } from "react-day-picker";
import { Toaster } from "sonner";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      {/* <Toaster /> */}
    </>
  );
}