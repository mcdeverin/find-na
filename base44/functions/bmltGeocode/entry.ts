import { geocode } from "../../shared/bmlt.ts";

export default async function (req: Request): Promise<Response> {
  try {
    const body = await req.json().catch(() => ({}));
    const query = body && body.query ? String(body.query) : "";
    if (!query) {
      return Response.json({ error: "query is required" }, { status: 400 });
    }
    const result = await geocode(query);
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 502 });
  }
}