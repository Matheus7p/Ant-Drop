import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { IProduct } from "@/types/product";

interface PostData {
  url: string
}

const getProductWithUrl = async (data: PostData): Promise<IProduct> => {
  const res = await axios.post<IProduct>("/api/scrape", data);
  return res.data
}

export const useGetProduct = () => {
  return useMutation<IProduct, Error, PostData>({
    mutationFn: getProductWithUrl
  });
}

