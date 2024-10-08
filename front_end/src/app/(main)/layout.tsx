import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import type { Metadata } from "next";

import FeedbackFloat from "./(home)/components/feedback_float";
import Footer from "./components/footer";
import Header from "./components/header";

config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Metaculus",
  description: "Metaculus rewrite",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-grow pt-12">{children}</div>
      <FeedbackFloat />
      <Footer />
    </div>
  );
}
