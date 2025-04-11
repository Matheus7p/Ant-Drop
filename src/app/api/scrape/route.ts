import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || !url.startsWith('http')) {
      return NextResponse.json({ error: 'URL inválida.' }, { status: 400 });
    }

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      locale: 'pt-BR',
    });
    const page = await context.newPage();

    await page.goto(url, {
      timeout: 60000,
      waitUntil: 'domcontentloaded',
    });

    await page.waitForTimeout(3000);

    const productName = (
      await Promise.any([
        page.locator('[itemprop="name"]').textContent(),
        page.locator('h1').textContent(),
        page.locator('.product-title').textContent(),
      ]).catch(() => null)
    )?.trim();

    const imageUrl = (
      await Promise.any([
        page.locator('[itemprop="image"]').getAttribute('src'),
        page.locator('.product-gallery img').getAttribute('src'),
        page.locator('.product-image img').getAttribute('src'),
        page.locator('img').first().getAttribute('src'),
      ]).catch(() => null)
    )?.trim();

    const normalizedImageUrl =
      imageUrl && !imageUrl.startsWith('http')
        ? new URL(imageUrl, url).href
        : imageUrl;

    const priceLocator = page.locator(
      '[itemprop="price"], .price, .product-price, .value, .product-value, .sale, .sale-price'
    ).first();
    const hasPrice = (await priceLocator.count()) > 0;
        
    let price: string | null = hasPrice ? await priceLocator.textContent() : null;
    if (price) {
      price = price
      .replace(/\s+/g, ' ')
      .trim(); 
      const match = price.match(/R\$ ?[\d.,]+/);
      price = match ? match[0] : null; 
    }

    if (!price) {
      console.error('Falha ao formatar o preço. Texto original:', await priceLocator.textContent());
    }

    const estimatedShipping = (
      await page.locator('text=/Entrega|Envio/i').first().textContent().catch(() => null)
    )?.trim();

    const { hostname } = new URL(url);
    const storeName = hostname.replace('www.', '');

    await browser.close();

    return NextResponse.json({
      success: true,
      data: {
        storeName,
        productName,
        imageUrl: normalizedImageUrl,
        price,
        estimatedShipping: estimatedShipping || null,
        sourceUrl: url,
      },
    });
  } catch (error) {
    console.error('Erro ao acessar página:', error);
    return NextResponse.json({ error: 'Falha ao acessar a página.' }, { status: 500 });
  }
}
