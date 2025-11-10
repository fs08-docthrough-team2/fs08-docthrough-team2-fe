import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // URL 유효성 검사
    new URL(url);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    // 타임아웃을 위한 AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      // 메타 태그를 가져오기 위한 fetch
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();

      // 메타 태그 파싱
      const metaTags = {
        title: '',
        description: '',
        image: '',
        siteName: '',
        url: url,
      };

      // og:title 또는 title 태그
      const ogTitleMatch = html.match(
        /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i,
      );
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      metaTags.title = ogTitleMatch?.[1] || titleMatch?.[1] || '';

      // og:description 또는 meta description
      const ogDescMatch = html.match(
        /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i,
      );
      const descMatch = html.match(
        /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i,
      );
      metaTags.description = ogDescMatch?.[1] || descMatch?.[1] || '';

      // og:image
      const ogImageMatch = html.match(
        /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
      );
      if (ogImageMatch?.[1]) {
        const imageUrl = ogImageMatch[1];
        // 상대 경로를 절대 경로로 변환
        metaTags.image = imageUrl.startsWith('http') ? imageUrl : new URL(imageUrl, url).toString();
      }

      // og:site_name
      const siteNameMatch = html.match(
        /<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i,
      );
      metaTags.siteName = siteNameMatch?.[1] || '';

      clearTimeout(timeoutId);
      return NextResponse.json(metaTags);
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error('Link preview error:', error);

    // 타임아웃 에러인지 확인
    if (error.name === 'AbortError' || error.message?.includes('aborted')) {
      return NextResponse.json(
        {
          error: 'Request timeout',
          message: '링크 미리보기를 가져오는 데 시간이 너무 오래 걸렸습니다.',
        },
        { status: 408 },
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch link preview',
        message: error.message,
      },
      { status: 500 },
    );
  }
}
