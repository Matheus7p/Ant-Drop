import { IProductResponse } from "@/types/product"
import axios from "axios"

export async function saveProductToLocalStorage(url: string) {
  const res = await axios.post<IProductResponse>("/api/scrape", { url });
  
  const { data } = res.data;

  localStorage.setItem("product", JSON.stringify(data))
}
