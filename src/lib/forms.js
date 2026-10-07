// Posts a form to Netlify Forms. The matching hidden <form> lives in index.html.
// There is no form backend in `npm run dev`, so submissions are skipped there.
export async function submitNetlifyForm(formName, fields) {
  if (import.meta.env.DEV) {
    console.info(`[dev] would submit "${formName}"`, fields);
    return;
  }
  const body = new URLSearchParams({ "form-name": formName, ...fields }).toString();
  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Form submit failed (${res.status})`);
}
