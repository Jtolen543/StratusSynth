import {Footer, Header} from "@/components"
import { Outlet } from "react-router";

export function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}