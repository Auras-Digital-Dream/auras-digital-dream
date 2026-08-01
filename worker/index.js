export default {
  async fetch(request, env) {
    const secure = (response) => {
      const secured = new Response(response.body, response);
      secured.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self' https://formsubmit.co; frame-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://formsubmit.co; object-src 'none'; upgrade-insecure-requests");
      secured.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
      secured.headers.set("X-Content-Type-Options", "nosniff");
      secured.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
      secured.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
      secured.headers.set("Cross-Origin-Opener-Policy", "same-origin");
      secured.headers.set("X-Frame-Options", "DENY");
      return secured;
    };
    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");

    if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
      return secure(response);
    }

    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = "";
    return secure(await env.ASSETS.fetch(new Request(indexUrl, request)));
  },
};
