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
import { saveProductToLocalStorage } from "./services/saveProductToLocalStorage";

export default function Home() {
  const { register, handleSubmit, formState: { errors },  } = useUrlForm();
  const mutation = useGetProduct();

  const onSubmit = (data: { productUrl: string}) => {
    mutation.mutate({ url: data.productUrl})
    saveProductToLocalStorage(data.productUrl)
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
      
      
        {mutation.isSuccess && mutation.data &&  (
          <a>
            <Card className="flex flex-row w-[700px] justify-between">
              <CardHeader className="w-[400]">
                <p className="font-light text-zinc-600 dark:text-zinc-400"><span className="font-semibold text-lg">Nome da Loja: </span>{mutation.data?.data?.storeName || "Nome da loja não disponível"}</p>
                <p className="font-light text-zinc-600 dark:text-zinc-400"><span className="font-semibold text-lg">Nome do Produto: </span>{mutation.data.data.productName || "Nome do produto não encontrado"}</p>
                <p className="font-light text-zinc-600 dark:text-zinc-400"><span className="font-semibold text-lg">Descrição: </span>{truncateText(mutation.data.data.description || "Descrição não disponível", 100)}</p>
                <p className="font-light text-zinc-600 dark:text-zinc-400"><span className="font-semibold text-lg">Preço: </span> {mutation.data.data.price || "Preço não disponível"}</p>
                <p className="font-light text-zinc-600 dark:text-zinc-400"><span className="font-semibold text-lg">Entrega: </span>{mutation.data.data.estimatedShipping || "Informação de entrega não disponível, sinal de que eles não tem o produto!!!".toUpperCase()}</p>
              </CardHeader>

              <CardContent>
                {mutation.data.data.imageUrl && (
                <Image 
                src={mutation.data.data.imageUrl} 
                alt={`Imagem do produto: ${mutation.data.data.storeName}`}
                width={300} 
                height={300} 
                className="object-contain mt-4"
                />
              )}
              </CardContent>
          </Card>
          </a>
        )}
      </section>

      <section className="flex justify-center items-center space-y-10 mt-10">
        {mutation.data?.reclameAquiInfo && mutation.data.data?.storeName &&(
          <a>
            <Card className="flex flex-col w-[700px] justify-between">
              <CardHeader>
                <CardTitle>
                  <h4 className="font-light text-zinc-600 dark:text-zinc-400">Reputação da <span className="text-zinc-400 font-semibold text-lg">{mutation.data.data.storeName} </span>no Reclame Aqui</h4>
                </CardTitle>
              </CardHeader>
              <CardContent>
               <div className="flex flex-col mb-6">
                <a className="font-light text-zinc-600 dark:text-zinc-400"><span className="font-semibold text-lg">Reputação: </span>{mutation.data.reclameAquiInfo.reputation || "Não disponível"}</a>
                <a className="font-light text-zinc-600 dark:text-zinc-400"><span className="font-semibold text-lg">Reclamações (12 meses): </span>{mutation.data.reclameAquiInfo.complaintsLast12Months || "Não disponível"}</a>
                <a className="font-light text-zinc-600 dark:text-zinc-400"><span className="font-semibold text-lg">Taxa de Resposta: </span>{mutation.data.reclameAquiInfo.responseRate || "Não disponível"}</a>
                <a className="font-light text-zinc-600 dark:text-zinc-400"><span className="font-semibold text-lg">Clientes que voltariam: </span>{mutation.data.reclameAquiInfo.customersWouldReturn || "Não disponível"}</a>
               </div>
                  <strong className="text-zinc-600 dark:text-zinc-200 font-bold text-lg">Últimas Reclamações:</strong>
                  <ul>
                      {mutation.data.reclameAquiInfo.latestComplaints?.map((complaint, index) => (
                        <div key={index}>
                          <h6 className="text-zinc-600 dark:text-zinc-400 font-bold text-lg">{complaint.title} - {complaint.date}</h6> 
                          <p className="font-light text-zinc-600 dark:text-zinc-400">{complaint.text}</p>
                        </div>
                      )) || "Nenhuma reclamação disponível"}
                </ul>
              </CardContent>
            </Card>
          </a>
        )}
      </section>

      <Particles />
    </main>
  );
}
