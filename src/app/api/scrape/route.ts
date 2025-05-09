import { scrapePageContent, extractProductInfo } from "@/services/scrapeProduct";
import { extractProductInGoogleShopping, scrapeProductInGoogleShopping } from "@/services/scrapeProductInGoogleShopping";
import { extractReclameAquiInfo, scrapeReclameAquiContent } from "@/services/scrapeStoreInReclameAqui";
import { IProductResponse } from "@/types/product";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { url } = await req.json();
    if (!url || !url.startsWith("http")) {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    const htmlContent = await scrapePageContent(url);
    const productInfo = await extractProductInfo(htmlContent, url);

    const reclameAquiHtml = await scrapeReclameAquiContent(productInfo.storeName);
    const reclameAquiInfo = await extractReclameAquiInfo(reclameAquiHtml);

    const googleShoppginHtml = await scrapeProductInGoogleShopping(productInfo.productName)
    const relatedProduct = await extractProductInGoogleShopping(googleShoppginHtml, productInfo.productName);

    console.log("product info: ", productInfo)
    console.log("ReclameAquiInfo:", reclameAquiInfo);
    console.log("produtos relacionados:", relatedProduct)

    return NextResponse.json({ 
      success: true, 
      data: {
        storeName: productInfo.storeName,
        productName: productInfo.productName,
        description: productInfo.description,
        imageUrl: productInfo.imageUrl,
        price: productInfo.price,
        estimatedShipping: productInfo.estimatedShipping,
        productUrl: productInfo.productUrl,
      }, 
        reclameAquiInfo: reclameAquiInfo, 
        relatedProduct: relatedProduct
    } as IProductResponse);
}