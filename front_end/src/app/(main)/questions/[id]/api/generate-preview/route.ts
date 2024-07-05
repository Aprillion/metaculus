import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

import { ENFORCED_THEME_PARAM } from "@/constants/global_search_params";
import { getAlphaAccessToken } from "@/utils/alpha_access";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 1200,
      height: 630,
    },
    args: [
      `--window-size=1200,630`,
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
  });
  const page = await browser.newPage();

  // Get the alpha access token
  const alphaAccessToken = await getAlphaAccessToken();
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Set the x-alpha-auth-token header for all requests
  console.log(
    "\n\n\n\n------------\n\n\n",
    String(alphaAccessToken),
    origin,
    "\n\n\n\n------------\n\n\n"
  );
  await page.setExtraHTTPHeaders({
    "x-alpha-auth-token": String(alphaAccessToken),
  });

  const url = `${origin}/embed/questions/${params.id}?${ENFORCED_THEME_PARAM}=dark&non-interactive=true`;

  await page.setCookie({
    name: "alpha_token",
    value: String(alphaAccessToken),
    domain: origin, // Adjust the domain as needed
  });

  const c = await page.cookies(origin);
  console.log("-", c, "-");
  await page.goto(url, { waitUntil: "networkidle0" });
  const element = await page.$("#id-used-by-screenshot-donot-change");

  if (!element) {
    await browser.close();
    return new NextResponse("Element not found", { status: 404 });
  }

  const screenshot = await element.screenshot({ type: "png" });

  await browser.close();

  return new NextResponse(screenshot, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
