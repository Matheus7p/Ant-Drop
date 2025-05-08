"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetProduct } from "@/hooks/useGetProduct";
import { useUrlForm } from "@/hooks/useUrlForm";
import { truncateText } from "@/utils/truncateText";
import Image from "next/image";
import { saveProductToLocalStorage } from "../services/saveProductToLocalStorage";
import { calculateProductReliability } from "@/utils/calculateProductReliability";
import Loading from "@/app/Loading";

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useUrlForm();
  const mutation = useGetProduct();

  const onSubmit = (data: { productUrl: string }) => {
    mutation.mutate({ url: data.productUrl });
    saveProductToLocalStorage(data.productUrl);
  };

  return (
    <main>
      {mutation.isPending &&( <Loading /> )}
      <section className="flex flex-col justify-center items-center gap-6">
        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text select-none dark:[-webkit-text-stroke:2px_theme(colors.zinc.200)] [-webkit-text-stroke:2px_theme(colors.zinc.800)]">
            Ant-Drop
          </h1>
          <p className="text-zinc-400 font-medium select-none">
            Te ajudamos á avaliar a confiabilidade de um produto. Basta colar o
            link!
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-2 w-full max-w-lg"
        >
          <div className="flex w-full items-center gap-2">
            <Input
              placeholder="Cole o link do produto aqui!"
              className="flex-1"
              {...register("productUrl", {
                required: "O link do produto é obrigatorio.",
              })}
            />
            <Button
              variant="outline"
              type="submit"
              disabled={mutation.isPending}
            >
             Verificar
            </Button>
          </div>
          {errors.productUrl && (
            <p className="text-red-500 text-sm self-start font-semibold">
              {errors.productUrl.message}
            </p>
          )}
        </form>
        {mutation.isError && (
          <p className="text-red-500 text-sm font-semibold">
            Erro:{" "}
            {mutation.error?.message || "Algo deu Errado. Tente novamente."}
          </p>
        )}
        {mutation.isSuccess && mutation.data && (
          <div>
            <p className="text-sm font-semibolid text-zinc-600 dark:text-zinc-400">
              <span className="font-semibold text-lg">Confiabilidade: </span>
              {calculateProductReliability(mutation.data)}% confiável
            </p>
          </div>
        )}
      </section>

      <section className="flex flex-col lg:flex-row justify-center items-start space-y-10 mt-10 gap-6">
        {mutation.isSuccess && mutation.data && (
          <Card className="flex flex-col md:flex-row w-auto md:w-[700px] h-auto md:h-[470px] justify-between">
            <CardHeader className="grid-rows-0 gap-2 w-[400]">
              <p className="font-semibold text-xl text-zinc-600 dark:text-zinc-400">
                {mutation.data?.data?.storeName ||
                  "Nome da loja não disponível"}
              </p>
              <p className="font-light text-zinc-600 dark:text-zinc-400">
                <span className="font-semibold text-lg">Nome do Produto: </span>
                {mutation.data.data.productName ||
                  "Nome do produto não encontrado"}
              </p>
              <p className="font-light text-zinc-600 dark:text-zinc-400">
                <span className="font-semibold text-lg">Descrição: </span>
                {truncateText(
                  mutation.data.data.description || "Descrição não disponível",
                  100
                )}
              </p>
              <p className="font-light text-zinc-600 dark:text-zinc-400">
                <span className="font-semibold text-lg">Preço: </span>{" "}
                {mutation.data.data.price || "Preço não disponível"}
              </p>
              <p className="font-light text-zinc-600 dark:text-zinc-400">
                <span className="font-semibold text-lg">Envio: </span>
                {mutation.data.data.estimatedShipping ||
                  "Informação de envio indisponível. Isso pode indicar que o produto não está em estoque ou que eles tercerizam a compra."}
              </p>
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
        )}
        {mutation.data?.reclameAquiInfo && mutation.data.data?.storeName && (
          <Card className="flex flex-col w-auto md:w-[700px] h-auto md:h-[470px] ">
            <CardHeader>
              <CardTitle>
                <h4 className="font-light text-zinc-600 dark:text-zinc-400">
                  Reputação da{" "}
                  <span className="text-zinc-400 font-semibold text-lg">
                    {mutation.data.data.storeName}{" "}
                  </span>
                  no Reclame Aqui
                </h4>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col mb-6">
                <p className="font-light text-zinc-600 dark:text-zinc-400">
                  <span className="font-semibold text-lg">Reputação: </span>
                  {mutation.data.reclameAquiInfo.reputation || "Não disponível"}
                </p>
                <p className="font-light text-zinc-600 dark:text-zinc-400">
                  <span className="font-semibold text-lg">
                    Reclamações (12 meses):{" "}
                  </span>
                  {mutation.data.reclameAquiInfo.complaintsLast12Months ||
                    "Não disponível"}
                </p>
                <p className="font-light text-zinc-600 dark:text-zinc-400">
                  <span className="font-semibold text-lg">
                    Taxa de Resposta:{" "}
                  </span>
                  {mutation.data.reclameAquiInfo.responseRate ||
                    "Não disponível"}
                </p>
                <p className="font-light text-zinc-600 dark:text-zinc-400">
                  <span className="font-semibold text-lg">
                    Clientes que voltariam:{" "}
                  </span>
                  {mutation.data.reclameAquiInfo.customersWouldReturn ||
                    "Não disponível"}
                </p>
              </div>
              <strong className="text-zinc-600 dark:text-zinc-400 font-bold text-lg">
                Reclamações relevantes:
              </strong>
              <ul>
                {mutation.data.reclameAquiInfo.latestComplaints?.length > 0 ? (
                  mutation.data.reclameAquiInfo.latestComplaints
                    ?.filter(
                      (complaint) =>
                        complaint && (complaint.title || complaint.text)
                    )
                    .map((complaint, index) => (
                      <div key={index}>
                        <h6 className="text-zinc-600 dark:text-zinc-400 font-bold text-lg">
                          {complaint.title}
                        </h6>
                        <p className="font-light text-zinc-600 dark:text-zinc-400">
                          {complaint.text}
                        </p>
                      </div>
                    ))
                ) : (
                  <p className="font-light text-zinc-600 dark:text-zinc-400">
                    Nenhuma reclamação disponível
                  </p>
                )}
              </ul>
            </CardContent>
          </Card>
        )}
      </section>

      {mutation.data?.relatedProduct && (
        <h1 className="text-4xl font-bold text-center bg-clip-text select-none dark:text-zinc-400 text-zinc-800">
          Produtos Relacionados no Google Shopping
        </h1>
      )}
      <section className="flex flex-col md:flex-row justify-center items-stretch mt-10 gap-6">
        {mutation.data?.relatedProduct?.map((product, index) => (
          <Card
            key={index}
            className="w-full md:w-[350px] h-auto flex"
          >
            <CardHeader className="grid-rows-0 gap-2">
              <p className="font-semibold text-lg text-zinc-600 dark:text-zinc-400 truncate">
                {product?.storeName || "Nome da loja não disponível"}
              </p>
              <p className="font-light text-zinc-600 dark:text-zinc-400 truncate">
                <span className="font-semibold text-md">Nome: </span>
                {product?.productName || "Nome não encontrado"}
              </p>
              <p className="font-light text-zinc-600 dark:text-zinc-400 truncate">
                <span className="font-semibold text-md">Desc: </span>
                {truncateText(product?.description || "Sem descrição", 60)}
              </p>
              <p className="font-light text-zinc-600 dark:text-zinc-400">
                <span className="font-semibold text-md">Preço: </span>{" "}
                {product?.price || "Preço indisponível"}
              </p>
              <p className="font-light text-zinc-600 dark:text-zinc-400 truncate">
                <span className="font-semibold text-md">Envio: </span>
                {product?.estimatedShipping || "Envio indisponível"}
              </p>
            </CardHeader>

            <CardContent className="flex justify-center items-center">
              {product?.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={`Imagem de ${product?.productName}`}
                  width={150}
                  height={150}
                  className="object-contain"
                />
              )}
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
