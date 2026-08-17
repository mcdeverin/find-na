import { searchMeetings } from "../../shared/bmlt.ts";

export default async function (req: Request): Promise<Response> {
  try {
    const body = await req.json().catch(() => ({}));
    const result = await searchMeetings(body || {});
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 502 });
  }
}