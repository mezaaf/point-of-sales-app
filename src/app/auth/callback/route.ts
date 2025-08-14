import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) next = "/";

  if (!code) return NextResponse.redirect(`${origin}/auth/auth-code-error`);

  const supabase = await createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
    code
  );

  if (exchangeError) return NextResponse.redirect(`${origin}/error`);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return NextResponse.redirect(`${origin}/error`);

  // fetch profile
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // insert jika belum ada
  if (!profile) {
    const { data: newProfile } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        name: user.user_metadata?.full_name ?? "",
        role: "cashier",
        avatar_url: user.user_metadata?.avatar_url ?? "",
      })
      .select()
      .single();
    profile = newProfile;
  }

  // update role jika null
  if (profile.role === null) {
    const { data: updatedProfile } = await supabase
      .from("profiles")
      .update({ role: "cashier" })
      .eq("id", profile.id)
      .select()
      .single();
    profile = updatedProfile;
  }

  // attach cookie dan redirect
  const response = NextResponse.redirect(
    process.env.NODE_ENV === "development"
      ? `${origin}${next}`
      : request.headers.get("x-forwarded-host")
      ? `https://${request.headers.get("x-forwarded-host")}${next}`
      : `${origin}${next}`
  );

  response.cookies.set({
    name: "user_profile",
    value: JSON.stringify(profile),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
