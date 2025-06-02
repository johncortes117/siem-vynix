import Dashboard from "@/components/dashboard"
import Image from "next/image";

export default function Home() {
  return (
    <>
      <header className="flex items-center p-4">
        <Image src="/logo-centinela.png" alt="Centinela Logo" width={50} height={50} />
        <h1 className="text-2xl font-bold ml-2">Centinela</h1>
      </header>
      <Dashboard />
    </>
  )
}
