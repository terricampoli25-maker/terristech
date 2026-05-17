const FROM_ADDRESS = "Terristech Feedback <onboarding@resend.dev>";
const RESEND_API_URL = "https://api.resend.com/emails";

export async function onRequestPost(context) {
  let body;
  try {
    body = await context.request.json();
  } catch {
    return Response.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  if (body.website && body.website.trim() !== "") {
    return Response.json({ ok: true }, { status: 200 });
  }

  const app      = (body.app      || "").trim();
  const feedback = (body.feedback || "").trim();
  const name     = (body.name     || "").trim();
  const email    = (body.email    || "").trim();

  if (!app || !feedback) {
    return Response.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }

  const RESEND_API_KEY    = context.env.RESEND_API_KEY;
  const FEEDBACK_TO_EMAIL = context.env.FEEDBACK_TO_EMAIL;

  if (!RESEND_API_KEY || !FEEDBACK_TO_EMAIL) {
    return Response.json({ ok: false, error: "Server not configured" }, { status: 500 });
  }

  const who = name && email ? `${name} <${email}>`
            : name          ? name
            : email         ? email
            : "Anonymous";

  const text = [
    `App: ${app}`,
    "",
    `From: ${who}`,
    "",
    "Feedback:",
    feedback,
  ].join("\n");

  const payload = {
    from:    FROM_ADDRESS,
    to:      [FEEDBACK_TO_EMAIL],
    subject: `[Feedback: ${app}] from ${name || "Anonymous"}`,
    text,
    ...(email ? { reply_to: email } : {}),
  };

  try {
    const res = await fetch(RESEND_API_URL, {
      method:  "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return Response.json({ ok: true }, { status: 200 });
    }
    return Response.json({ ok: false, error: "Could not send" }, { status: 500 });
  } catch {
    return Response.json({ ok: false, error: "Could not send" }, { status: 500 });
  }
}

export async function onRequest(context) {
  if (context.request.method === "POST") {
    return onRequestPost(context);
  }
  return Response.json({ ok: false, error: "Method not allowed" }, { status: 405 });
}
