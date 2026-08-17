import { createClientFromRequest } from "npm:@base44/sdk";

const VALID_TYPES = new Set(["In-Person", "Online", "Hybrid"]);
const VALID_OPEN_CLOSED = new Set(["Open", "Closed"]);
const VALID_LISTED = new Set(["Yes", "No", "Not Sure"]);

function cleanString(value: unknown, maxLength = 1000): string {
  if (value === null || value === undefined) return "";
  return String(value).trim().slice(0, maxLength);
}

function optionalString(value: unknown, maxLength = 1000): string | undefined {
  const result = cleanString(value, maxLength);
  return result || undefined;
}

export default async function (req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await req.json().catch(() => ({}));

    const name = cleanString(body?.name, 200);
    const startTime = cleanString(body?.start_time, 20);
    const dayOfWeek = Number(body?.day_of_week);
    const attendanceType = cleanString(body?.attendance_type, 30);

    if (!name || !startTime || !Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
      return Response.json(
        { error: "Meeting name, day, and start time are required." },
        { status: 400 },
      );
    }

    if (!VALID_TYPES.has(attendanceType)) {
      return Response.json({ error: "Invalid attendance type." }, { status: 400 });
    }

    const openClosed = cleanString(body?.open_closed, 20);
    if (openClosed && !VALID_OPEN_CLOSED.has(openClosed)) {
      return Response.json({ error: "Invalid meeting access type." }, { status: 400 });
    }

    const listedLocally = cleanString(body?.listed_locally, 20) || "Not Sure";
    if (!VALID_LISTED.has(listedLocally)) {
      return Response.json({ error: "Invalid local listing value." }, { status: 400 });
    }

    const meetingFormats = Array.isArray(body?.meeting_formats)
      ? body.meeting_formats.map((value: unknown) => cleanString(value, 100)).filter(Boolean).slice(0, 20)
      : [];

    const base44 = createClientFromRequest(req);
    const meeting = await base44.asServiceRole.entities.Meeting.create({
      name,
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: optionalString(body?.end_time, 20),
      timezone: optionalString(body?.timezone, 100),
      attendance_type: attendanceType,
      meeting_formats: meetingFormats,
      open_closed: openClosed || undefined,
      venue_name: optionalString(body?.venue_name, 300),
      address: optionalString(body?.address, 300),
      city: optionalString(body?.city, 150),
      state: optionalString(body?.state, 150),
      postal_code: optionalString(body?.postal_code, 50),
      country: optionalString(body?.country, 100),
      virtual_url: optionalString(body?.virtual_url, 1000),
      virtual_platform: optionalString(body?.virtual_platform, 100),
      virtual_meeting_id: optionalString(body?.virtual_meeting_id, 200),
      virtual_password: optionalString(body?.virtual_password, 200),
      phone: optionalString(body?.phone, 200),
      language: optionalString(body?.language, 100),
      wheelchair_accessible: Boolean(body?.wheelchair_accessible),
      submission_notes: optionalString(body?.submission_notes, 2000),
      listed_locally: listedLocally,
      source: "Find NA community submission",
      source_url: optionalString(body?.source_url, 1000),
      verification_contact: optionalString(body?.verification_contact, 500),
      submitted_at: new Date().toISOString(),
      verification_status: "Community Submitted",
    });

    return Response.json({ ok: true, meeting_id: meeting.id }, { status: 201 });
  } catch (error) {
    console.error("submitMeeting failed", error);
    return Response.json(
      { error: "We couldn't submit this meeting right now. Please try again." },
      { status: 500 },
    );
  }
}
