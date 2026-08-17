import { fetchFormats, curatedFormats } from "../../shared/bmlt.ts";

export default async function (req: Request): Promise<Response> {
  try {
    const arr = await fetchFormats();
    const formats = curatedFormats(arr);
    return Response.json({ formats });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 502 });
  }
}