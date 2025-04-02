import Header from "@/components/Header";
import Particles from "@/components/Particles";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main className="h-screen">
      <Header />

      <section className="flex flex-col justify-center items-center gap-12">
       <div className="flex flex-col justify-center items-center gap-6">
       <h1 className="text-9xl font-bold text-transparent bg-clip-text select-none dark:[-webkit-text-stroke:2px_theme(colors.zinc.200)] [-webkit-text-stroke:2px_theme(colors.zinc.800)]">
        Ant-Drop
      </h1>

        <p className="text-zinc-400 font-medium select-none">Detectamos dropshipping para você. Basta colar o link!</p>
       </div>
        <Input placeholder="Cole seu link aqui!" className="w-3xl">
        </Input>
      </section>

      <Particles />
    </main>
  );
}
