import { IReclameAquiInfo } from "./reclameAqui"

export interface IProductBasic {
  storeName: string,
  productName: string,
  description: string,
  imageUrl: string,
  price: string,
  estimatedShipping: string,
  productUrl: string,
}

export interface IProductResponse {
  success: boolean,
  data: IProductBasic
  reclameAquiInfo: IReclameAquiInfo,
}