import "@/app/globals.css"
import { Header } from "@/components";
import { Footer } from "@/components";

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {

  return (
    <div>
      <Header />
      {children}     
      <Footer />    
    </div>
  );
}
