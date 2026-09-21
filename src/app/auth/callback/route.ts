import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Only allow same-site, relative redirect targets. Values that start with "//"
 * or "\" are treated as protocol-relative/absolute URLs and rejected.
 */
function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }
  if (value.includes("\\")) return "/dashboard";
  return value;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNextPath(url.searchParams.get("next"));
  const response = NextResponse.redirect(new URL(next, url.origin));

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (items) =>
            items.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            ),
        },
      },
    );
    await supabase.auth.exchangeCodeForSession(code);
  }

  return response;
}