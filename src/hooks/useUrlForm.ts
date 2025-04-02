"use client"

import { urlSchema, UrlFormData } from "@/lib/valitadion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function useUrlForm () {
  const form = useForm<UrlFormData>({
    resolver: zodResolver(urlSchema),
  });

  return form;
}
