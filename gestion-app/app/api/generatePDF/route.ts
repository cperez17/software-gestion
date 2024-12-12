import { chromium } from 'playwright';

export async function POST(req: Request) {
  const urlParams = new URL(req.url).searchParams;
  const teacher = urlParams.get('teacher') || '';
  const academicYear = urlParams.get('academicYear') || '';

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const host = req.headers.get('host');

  // Construir la URL con los filtros aplicados
  const url = `http://${host}/informesSolicitud?pdf=true&hideButton=true&teacher=${teacher}&academicYear=${academicYear}`;
  await page.goto(url, { waitUntil: 'networkidle' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: false,
  });

  await browser.close();

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="informe.pdf"',
    },
  });
}
