import Navbar from "@/components/client/global/Navbar";
import Footer from "@/components/client/global/Footer";
import { Toaster } from "sonner";
import Foot from "@/components/client/global/Foot";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Foot />
    </>
  );
}