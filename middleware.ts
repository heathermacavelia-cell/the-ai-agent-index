import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const accept = request.headers.get('accept') || ''

  if (accept.includes('text/markdown')) {
    const url = request.nextUrl.clone()
    url.pathname = '/api/markdown'
    url.searchParams.set('path', request.nextUrl.pathname)
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/agents/:path*', '/compare/:path*', '/alternatives/:path*', '/resources/guides/:path*', '/definitions/:path*'],
}