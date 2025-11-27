export { auth as middleware } from "./auth"

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads).*)"],
}

// Make middleware work on Cloudflare edge
export const runtime = 'experimental-edge'
