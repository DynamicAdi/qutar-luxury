import { Instrument_Sans,Geist_Mono, Syne, Plus_Jakarta_Sans } from "next/font/google";

export const InstrumentSans = Instrument_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const syne = Syne({
  weight: ['400', '500', '600', '700', '800'],
  variable: "--font-syne",
  subsets: ['latin']
})

export const jakarta = Plus_Jakarta_Sans({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: "--font-jakarta-sans",
  subsets:  ['latin']
})
