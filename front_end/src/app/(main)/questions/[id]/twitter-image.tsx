export const runtime = "edge";
export const contentType = "image/png";
export const alt = "community predictions";
export const size = { width: 1200, height: 630 };

export default async function Image({ params }: { params: { id: number } }) {
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return await fetch(`${origin}/questions/${params.id}/api/generate-preview`, {
    headers: {
      "image-preview-request": "true",
    },
  });
}
