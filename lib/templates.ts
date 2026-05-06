import { SITE_NAME } from "@/config";

export function meetingEmailTemplate({
  name,
  title,
  location,
  scheduledAt,
}: {
  name: string;
  title: string;
  location: string;
  scheduledAt: Date;
}) {
  return `
<div style="background:#f5f7fb;padding:40px;font-family:Arial,sans-serif;color:#111827">

  <div style="max-width:680px;margin:auto;">

    <!-- HEADER -->
    <div style="text-align:center;margin-bottom:28px;">
      <h1 style="margin:0;font-size:26px;letter-spacing:0.5px;color:#111827;">
        🏢 ${SITE_NAME?.toUpperCase()}
      </h1>

      <p style="margin:8px 0 0;font-size:14px;color:#6b7280;">
        Meeting Notification System
      </p>
    </div>

    <!-- MAIN CARD -->
    <div style="
      background:#ffffff;
      border-radius:18px;
      padding:28px;
      border:1px solid #e5e7eb;
      box-shadow:0 6px 20px rgba(0,0,0,0.06)
    ">

      <p style="font-size:16px;color:#374151;margin-bottom:12px;">
        Hello <b style="color:#111827;font-size:17px;">${name}</b>,
      </p>

      <p style="font-size:14px;color:#6b7280;margin-bottom:18px;line-height:1.6;">
        A new meeting has been scheduled for your lead interaction. Please find the details below.
      </p>

      <!-- DETAILS -->
      <div style="
        background:#f9fafb;
        padding:20px;
        border-radius:14px;
        border:1px solid #e5e7eb;
      ">

        <p style="margin:0 0 12px;font-size:15px;color:#111827;">
          <b>📌 Title:</b> ${title}
        </p>

        <p style="margin:0 0 12px;font-size:15px;color:#111827;">
          <b>📍 Location:</b> ${location}
        </p>

        <p style="margin:0;font-size:15px;color:#111827;">
          <b>🕒 Scheduled At:</b> ${new Date(scheduledAt).toLocaleString()}
        </p>

      </div>

    </div>

    <!-- FOOTER -->
    <p style="
      margin-top:28px;
      font-size:12px;
      color:#9ca3af;
      text-align:center;
      line-height:1.5;
    ">
      This is an automated notification from ${SITE_NAME}.
    </p>

  </div>
</div>
`;
}


export function meetingCancelledEmailTemplate({
  name,
  title,
  location,
  scheduledAt,
}: {
  name: string;
  title: string;
  location: string;
  scheduledAt: Date;
}) {

  return `
<div style="background:#f5f7fb;padding:40px;font-family:Arial,sans-serif;color:#111827">

  <div style="max-width:680px;margin:auto;">

    <!-- HEADER -->
    <div style="text-align:center;margin-bottom:28px;">
      <h1 style="margin:0;font-size:26px;letter-spacing:0.5px;color:#111827;">
        🏢 ${SITE_NAME?.toUpperCase()}
      </h1>

      <p style="margin:8px 0 0;font-size:14px;color:#6b7280;">
        Meeting Notification System
      </p>
    </div>

    <!-- MAIN CARD -->
    <div style="
      background:#ffffff;
      border-radius:18px;
      padding:28px;
      border:1px solid #fee2e2;
      box-shadow:0 6px 20px rgba(0,0,0,0.06)
    ">

      <!-- ALERT BADGE -->
      <div style="margin-bottom:16px;">
        <span style="
          display:inline-block;
          padding:6px 12px;
          font-size:12px;
          border-radius:999px;
          background:#fef2f2;
          color:#dc2626;
          border:1px solid #fecaca;
          font-weight:600;
        ">
          ❌ CANCELLED
        </span>
      </div>

      <p style="font-size:16px;color:#374151;margin-bottom:12px;">
        Hello <b style="color:#111827;font-size:17px;">${name}</b>,
      </p>

      <p style="font-size:14px;color:#6b7280;margin-bottom:18px;line-height:1.6;">
        We want to inform you that the scheduled meeting has been <b style="color:#dc2626;">cancelled</b>.
      </p>

      <!-- DETAILS -->
      <div style="
        background:#f9fafb;
        padding:20px;
        border-radius:14px;
        border:1px solid #e5e7eb;
      ">

        <p style="margin:0 0 12px;font-size:15px;color:#111827;">
          <b>📌 Title:</b> ${title}
        </p>

        <p style="margin:0 0 12px;font-size:15px;color:#111827;">
          <b>📍 Location:</b> ${location}
        </p>

        <p style="margin:0;font-size:15px;color:#111827;">
          <b>🕒 Was Scheduled For:</b> ${new Date(
            scheduledAt
          ).toLocaleString()}
        </p>

      </div>

    </div>

    <!-- FOOTER -->
    <p style="
      margin-top:28px;
      font-size:12px;
      color:#9ca3af;
      text-align:center;
      line-height:1.5;
    ">
      This is an automated notification from ${SITE_NAME}.
    </p>

  </div>
</div>
`;
}