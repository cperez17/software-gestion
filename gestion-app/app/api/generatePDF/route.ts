import { chromium } from 'playwright';

export async function POST(req: Request) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const host = req.headers.get('host');

    // Añade los parámetros `?pdf=true&hideButton=true` en la URL
    await page.goto(`http://${host}/informesSolicitud?pdf=true&hideButton=true`, { waitUntil: 'networkidle' });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
    });

    await browser.close();

    return new Response(pdfBuffer, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="informe.pdf"',
        },
    });
}
