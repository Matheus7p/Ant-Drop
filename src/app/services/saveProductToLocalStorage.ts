import { IProduct } from "@/types/product"
import axios from "axios"

export async function saveProductToLocalStorage(url: string) {
  const res = await axios.post<IProduct>("/api/scrape", { url });
  
  const { data } = res.data;

  localStorage.setItem("product", JSON.stringify(data))
}
