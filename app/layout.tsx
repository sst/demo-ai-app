import config from "@/config";
import type { Metadata } from "next";
import styles from "./layout.module.css";
import { Raleway } from "next/font/google";
import "./globals.css";

const font = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://d2yfvixyyw0ix7.cloudfront.net"),
  title: {
    template: "%s | ❍ Movies",
    default: "❍ Movies",
  },
  openGraph: {
    images: ["/opengraph-image.png"],
  },
  description: "An AI demo built with SST ❍ Ion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${font.className} ${styles.body}`}>
        <main className={styles.content}>{children}</main>
        <footer className={styles.footer}>
          <a href="https://github.com/sst/ion" target="_blank">
            Built with SST ❍ Ion
          </a>
          <a href={config.repo} target="_blank">
            View Source
          </a>
        </footer>
      </body>
    </html>
  );
}
