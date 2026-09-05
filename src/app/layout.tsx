import { Noto_Sans } from "next/font/google";
import { FC, ReactNode } from "react";

import "./globals.css";

import ToasterProvider from "@/common/ToasterProvider";
import ReduxProvider from "@/redux/ReduxProviders";
import { Providers } from "./provider";
import { ModalProvider } from "@/utils/ContextProvider";

const style = Noto_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Waxcraft Client",
  description: "User panel created with Next JS",
  icons: {
    icon: [{ url: "/wax_craft_logo.jpeg", type: "image/jpeg" }],
    shortcut: "/wax_craft_logo.jpeg",
    apple: "/wax_craft_logo.jpeg",
  },
};

interface RootLayoutProps {
  children: ReactNode; // Use ReactNode to type the children prop
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${style.className} antialiased`} suppressHydrationWarning>
        <Providers>
          <div className="min-h-screen w-full overflow-x-hidden bg-background">
            <ToasterProvider>
              <ReduxProvider>
                <ModalProvider>{children}</ModalProvider>
              </ReduxProvider>
            </ToasterProvider>
          </div>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
