import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { IProductResponse } from "@/types/product";


interface PostData {
  url: string;
}

const getProductWithUrl = async (data: PostData): Promise<IProductResponse> => {
  const res = await axios.post<IProductResponse>("/api/scrape", data);
  return res.data;
};

export const useGetProduct = () => {
  return useMutation<IProductResponse, Error, PostData>({
    mutationFn: getProductWithUrl,
  });
};