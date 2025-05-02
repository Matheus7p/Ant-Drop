import { IProductResponse } from "../types/product";

//codigo para saber a confiabilidade de um produto, sim vai ter comentario pra eu nn esquecer como o calculo ta sendo feito
export function calculateProductReliability(productResponse: IProductResponse): string {
  if (!productResponse.success) return "0.00"; 

  const { data, reclameAquiInfo } = productResponse;

  let score = 100; // o score ou melhor confiabiliade começa em 100% :p

  //aq se a loja/produto nn tiver uma informação de envio quer dizer q eles nn tem o produto, são penalizados em -30%
  if (!data.estimatedShipping || data.estimatedShipping.trim() === "") {
    score -= 30; 
  }

  // aqui atraves da reputação da loja no reclame aq adicionamos ou reduzimos o score
  if (reclameAquiInfo) {
    const reputationScores: Record<string, number> = {
      "Ótima": 20,
      "Boa": 15,
      "Regular": 0,
      "Ruim": -20,
      "Péssima": -40,
    };

    score += reputationScores[reclameAquiInfo.reputation] || 0;

    // em relação a taxa de retorno dos clientes, para cada 1% de retorno recebe 0.2% de confiabilidade
    const customersReturnRate = parseFloat(reclameAquiInfo.customersWouldReturn.replace('%', '')) || 0;
    score += customersReturnRate * 0.2; 

    // penalidade para a taxa de clientes que NÃO voltariam (assumindo que a informação existe)
    // Se a informação direta não existir, podemos inferir:
    const customersNotReturnRate = 100 - customersReturnRate;
    score -= customersNotReturnRate * 0.1;

    // em relação a taxa de respostas, para cada 1% de retorno recebe 0.1% de confiabilidade
    const responseRate = parseFloat(reclameAquiInfo.responseRate.replace('%', '')) || 0;
    score += responseRate * 0.1; 

    //penalidades por numero de queixas, cada queixa vai diminuir em 0.5%
    const complaints = parseInt(reclameAquiInfo.complaintsLast12Months) || 0;
    score -= complaints * 0.005;
  } 
  score = Math.max(0, Math.min(100, score));

  return score.toFixed(2);
}
