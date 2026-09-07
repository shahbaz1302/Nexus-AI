const ALLOWED_HOSTS = ["res.cloudinary.com"];

export async function GET(request: Request) {
  const imageUrl = new URL(request.url).searchParams.get("url");

  if (!imageUrl) {
    return new Response("Missing image URL.", { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    return new Response("Invalid image URL.", { status: 400 });
  }

  if (!ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
    return new Response("Image host is not allowed.", { status: 400 });
  }

  const imageResponse = await fetch(parsedUrl);
  if (!imageResponse.ok) {
    return new Response("Unable to download the image.", {
      status: imageResponse.status,
    });
  }

  return new Response(imageResponse.body, {
    headers: {
      "Content-Disposition": 'attachment; filename="background-removed.png"',
      "Content-Type": imageResponse.headers.get("content-type") ?? "image/*",
    },
  });
}
