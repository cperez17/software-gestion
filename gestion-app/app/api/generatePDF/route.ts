// app/api/generatePDF/route.ts
import puppeteer from 'puppeteer';

export async function POST(req: Request) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3004/informesSolicitud', { waitUntil: 'networkidle2' });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
    });

    await browser.close();

    // En lugar de `res.setHeader`, usa `new Response` con los encabezados directamente
    return new Response(pdfBuffer, {
        headers: {
            'Content-Type': 'application/pdf',
        },
    });
}
