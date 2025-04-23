interface IProductData {
  storeName: string,
  productName: string,
  imageUrl: string,
  price: string,
  estimatedShipping: string,
  sourceUrl: string
}

export interface IProduct {
  success: boolean,
  data: IProductData
}