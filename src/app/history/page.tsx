"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { IProductResponse } from "@/types/product";
import { truncateText } from "@/utils/truncateText";
import { useState, useEffect } from "react";
import Image from "next/image";
import Loading from "../Loading";
import AOS from "aos";
import "aos/dist/aos.css";


interface IProductAndReclameAqui {
  product: IProductResponse["data"];
  reclameAquiInfo: IProductResponse["reclameAquiInfo"];
}

function History() {
  const [history, setHistory] = useState<IProductAndReclameAqui[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const storedProducts = localStorage.getItem("productAndReclameAqui");
      if (storedProducts) {
        const parsedData: IProductAndReclameAqui[] = JSON.parse(storedProducts);
        setHistory(parsedData);
      }
      setIsLoading(false);
    }, 2000);

    AOS.init({
      duration: 1000, 
      offset: 200, 
      easing: "ease-in-out", 
      once: true, 
    });

    return () => clearTimeout(timeout);
  }, []);

  return (
    <main>
      {isLoading ? (
        <Loading />
      ) : (
        <section className="flex flex-col items-center space-y-6 mt-10">
          <h2 className="text-9xl font-bold text-transparent bg-clip-text select-none dark:[-webkit-text-stroke:2px_theme(colors.zinc.200)] [-webkit-text-stroke:2px_theme(colors.zinc.800)]">
            Histórico
          </h2>
          <p className="text-zinc-400 font-medium select-none">
            Seu histórico de produtos pesquisados!
          </p>
          {history.length > 0 &&
            history.map((item, index) => (
              <section
                className="flex flex-col lg:flex-row justify-center items-start space-y-10 mt-10 gap-6"
                key={index}
              >
                <Card className="flex flex-col md:flex-row w-auto md:w-[700px] h-auto md:h-[470px] justify-between" data-aos="fade-right">
                  <CardHeader className="grid-rows-0 gap-2 w-[400]">
                    <p className="font-semibold text-xl text-zinc-600 dark:text-zinc-400">
                      {item.product?.storeName || "Nome da loja não disponível"}
                    </p>
                    <p className="font-light text-zinc-600 dark:text-zinc-400">
                      <span className="font-semibold text-lg">
                        Nome do Produto:{" "}
                      </span>
                      {item.product?.productName ||
                        "Nome do produto não encontrado"}
                    </p>
                    <p className="font-light text-zinc-600 dark:text-zinc-400">
                      <span className="font-semibold text-lg">Descrição: </span>
                      {truncateText(
                        item.product?.description || "Descrição não disponível",
                        100
                      )}
                    </p>
                    <p className="font-light text-zinc-600 dark:text-zinc-400">
                      <span className="font-semibold text-lg">Preço: </span>{" "}
                      {item.product?.price || "Preço não disponível"}
                    </p>
                    <p className="font-light text-zinc-600 dark:text-zinc-400">
                      <span className="font-semibold text-lg">Envio: </span>
                      {item.product?.estimatedShipping ||
                        "Informação de envio indisponível. Isso pode indicar que o produto não está em estoque ou que eles tercerizam a compra."}
                    </p>
                  </CardHeader>

                  <CardContent>
                    {item.product?.imageUrl && (
                      <Image
                        src={item.product.imageUrl}
                        alt={`Imagem do produto: ${item.product.productName}`}
                        width={300}
                        height={300}
                        className="object-contain mt-4"
                      />
                    )}
                  </CardContent>
                </Card>

                <Card className="flex flex-col w-auto md:w-[700px] h-auto md:h-[470px]" data-aos="fade-left">
                  <CardHeader>
                    <CardTitle>
                      <h4 className="font-light text-zinc-600 dark:text-zinc-400">
                        Reputação da{" "}
                        <span className="text-zinc-400 font-semibold text-lg">
                          {item.product?.storeName}{" "}
                        </span>
                        no Reclame Aqui
                      </h4>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col mb-6">
                      <a className="font-light text-zinc-600 dark:text-zinc-400">
                        <span className="font-semibold text-lg">
                          Reputação:{" "}
                        </span>
                        {item.reclameAquiInfo?.reputation || "Não disponível"}
                      </a>
                      <a className="font-light text-zinc-600 dark:text-zinc-400">
                        <span className="font-semibold text-lg">
                          Reclamações (12 meses):{" "}
                        </span>
                        {item.reclameAquiInfo?.complaintsLast12Months ||
                          "Não disponível"}
                      </a>
                      <a className="font-light text-zinc-600 dark:text-zinc-400">
                        <span className="font-semibold text-lg">
                          Taxa de Resposta:{" "}
                        </span>
                        {item.reclameAquiInfo?.responseRate || "Não disponível"}
                      </a>
                      <a className="font-light text-zinc-600 dark:text-zinc-400">
                        <span className="font-semibold text-lg">
                          Clientes que voltariam:{" "}
                        </span>
                        {item.reclameAquiInfo?.customersWouldReturn ||
                          "Não disponível"}
                      </a>
                    </div>
                    <strong className="text-zinc-600 dark:text-zinc-400 font-bold text-lg">
                      Reclamações relevantes:
                    </strong>
                    <ul>
                      {item.reclameAquiInfo?.latestComplaints?.length > 0 ? (
                        item.reclameAquiInfo.latestComplaints
                          .filter(
                            (complaint) =>
                              complaint && (complaint.title || complaint.text)
                          )
                          .map((complaint, index) => (
                            <div key={index}>
                              <h6 className="text-zinc-600 dark:text-zinc-400 font-bold text-lg">
                                {complaint.title || "Titulo Indisponível"}
                              </h6>
                              <p className="font-light text-zinc-600 dark:text-zinc-400">
                                {complaint.text || "Texto Indisponível"}
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
              </section>
            ))}
        </section>
      )}
    </main>
  );
}

export default History;
