"use client"

import Header from "@/components/Header";
import Particles from "@/components/Particles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUrlForm } from "@/hooks/useUrlForm";

export default function Home() {
  const { register, handleSubmit, formState: { errors },  } = useUrlForm();

  const onSubmit = (data: { productUrl: string}) => {
    console.log("URL enviada", data.productUrl);
  }


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
        
       <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-2 w-full max-w-lg">
        <div className="flex w-full items-center gap-2">
          <Input
            placeholder="Cole o link do produto aqui!"
            className="flex-1"
            {...register("productUrl")}
          />
          <Button variant="outline" type="submit">Verificar</Button>
        </div>

        {errors.productUrl && (
          <p className="text-red-500 text-sm self-start font-semibold">{errors.productUrl.message}</p>
        )}
      </form>

      </section>

      <Particles />
    </main>
  );
}
