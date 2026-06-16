export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  if (!title) {
    return Response.json({ error: 'Missing title' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://www.themoviedb.org/search?query=${encodeURIComponent(title)}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'zh-CN,en;q=0.9',
        },
        next: { revalidate: 86400 },
      }
    );

    const html = await res.text();

    const match = html.match(/class="poster[^"]*"[^>]*src="([^"]+)"/);
    if (!match) {
      return Response.json({ poster: null }, { status: 200 });
    }

    const thumbUrl = match[1];
    const posterUrl = thumbUrl.replace(/w\d+(_and_h\d+)?_face/, 'w500');
    return Response.json({ poster: posterUrl });
  } catch {
    return Response.json({ poster: null }, { status: 200 });
  }
}
