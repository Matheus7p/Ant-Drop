import { IProductResponse } from "@/types/product"
import axios from "axios"

export async function saveProductToLocalStorage(url: string) {
  const res = await axios.post<IProductResponse>("/api/scrape", { url });
  
  const { data, reclameAquiInfo } = res.data;

  const existingData = JSON.parse(localStorage.getItem("productAndReclameAqui") || "[]");

  const updateData = Array.isArray(existingData) 
  ? [...existingData, { product: data, reclameAquiInfo}] 
  : [{ product: data, reclameAquiInfo }];

  localStorage.setItem("productAndReclameAqui", JSON.stringify(updateData))
}
