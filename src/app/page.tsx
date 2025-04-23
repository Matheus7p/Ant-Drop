"use client"

import Header from "@/components/Header";
import Particles from "@/components/Particles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetProduct } from "@/hooks/useGetProduct";
import { useUrlForm } from "@/hooks/useUrlForm";
import { truncateText } from "@/utils/truncateText";
import Image from "next/image";

export default function Home() {
  const { register, handleSubmit, formState: { errors },  } = useUrlForm();
  const mutation = useGetProduct();

  const onSubmit = (data: { productUrl: string}) => {
    mutation.mutate(
      { url: data.productUrl},
    )
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
            {...register("productUrl", {required: "O link do produto é obrigatorio."})}
          />
          <Button variant="outline" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Verificando..." : "Verificar"}
          </Button>
        </div>

        {errors.productUrl && (
          <p className="text-red-500 text-sm self-start font-semibold">{errors.productUrl.message}</p>
        )}
      </form>

      {mutation.isError && (
        <p className="text-red-500 text-sm font-semibold">
          Erro: {mutation.error?.message || "Algo deu Errado. Tente novamente."}
        </p>
      )}
      
      
      {mutation.isSuccess && mutation.data && mutation.data.data && (
        <a href={mutation.data.data.sourceUrl} >
          <Card>
          <CardHeader>
            <CardTitle>
            {mutation.data.data.storeName || "Nome da loja não disponível"}
            <br />
            {mutation.data.data.productName || "Nome do produto não encontrado"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p>{truncateText(mutation.data.data.description, 50)}</p>

            <p>Preço: {mutation.data.data.price || "Preço não disponível"}</p>
            <p>Entrega: {mutation.data.data.estimatedShipping || "Informação de entrega não disponível"}</p>
            {mutation.data.data.imageUrl && (
            <Image 
            src={mutation.data.data.imageUrl} 
            alt={`Imagem do produto: ${mutation.data.data.storeName}`}
            width={300} 
            height={300} 
            className="object-contain mt-4"
            />
          )}

          <p>{mutation.data.data.sourceUrl}</p>
          </CardContent>
        </Card>
        </a>
      )}

      </section>

      <Particles />
    </main>
  );
}
