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

interface PropertyProposalTemplateProps {
  subject: string;
  body: string;
  attachmentUrl?: string;
}

export function propertyProposalTemplate({
  subject,
  body,
  attachmentUrl,
}: PropertyProposalTemplateProps) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${subject}</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f4f7fb;
    font-family:Inter,Arial,sans-serif;
    color:#111827;
  "
>
  <div
    style="
      width:100%;
      padding:40px 16px;
      box-sizing:border-box;
    "
  >
    <div
      style="
        max-width:680px;
        margin:0 auto;
        background:#ffffff;
        border-radius:28px;
        overflow:hidden;
        border:1px solid #e5e7eb;
        box-shadow:0 12px 40px rgba(15,23,42,0.08);
      "
    >

      <!-- HEADER -->
      <div
        style="
          padding:36px 34px;
          background:linear-gradient(135deg,#0f172a,#111827,#1e293b);
        "
      >
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td align="left">
              <p
                style="
                  margin:0;
                  color:#94a3b8;
                  font-size:12px;
                  letter-spacing:2px;
                  text-transform:uppercase;
                "
              >
                Personalized Property Proposal
              </p>

              <h1
                style="
                  margin:12px 0 0;
                  font-size:30px;
                  line-height:1.2;
                  font-weight:700;
                  color:#ffffff;
                "
              >
                ${subject}
              </h1>
            </td>

            <td align="right" width="72">
              <div
                style="
                  width:60px;
                  height:60px;
                  border-radius:18px;
                  background:rgba(255,255,255,0.08);
                  text-align:center;
                  line-height:60px;
                  font-size:28px;
                "
              >
                🏡
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- CONTENT -->
      <div
        style="
          padding:36px 34px;
        "
      >

        <!-- EMAIL BODY -->
        <div
          style="
            font-size:15px;
            line-height:1.9;
            color:#374151;
            white-space:pre-wrap;
          "
        >
          ${body}
        </div>

        ${
          attachmentUrl
            ? `
        <!-- ATTACHMENT -->
        <div
          style="
            margin-top:34px;
            padding:20px;
            border-radius:20px;
            background:#f8fafc;
            border:1px solid #e5e7eb;
          "
        >
          <table width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td width="56" valign="top">
                <div
                  style="
                    width:48px;
                    height:48px;
                    border-radius:14px;
                    background:#111827;
                    text-align:center;
                    line-height:48px;
                    color:#ffffff;
                    font-size:20px;
                  "
                >
                  📄
                </div>
              </td>

              <td valign="top">
                <p
                  style="
                    margin:0;
                    font-size:14px;
                    font-weight:600;
                    color:#111827;
                  "
                >
                  Property Proposal PDF
                </p>

                <p
                  style="
                    margin:6px 0 14px;
                    font-size:13px;
                    line-height:1.6;
                    color:#6b7280;
                  "
                >
                  Click below to download the attached proposal document.
                </p>

                <a
                  href="${attachmentUrl}"
                  target="_blank"
                  download
                  style="
                    display:inline-block;
                    padding:11px 18px;
                    border-radius:12px;
                    background:#111827;
                    color:#ffffff;
                    text-decoration:none;
                    font-size:13px;
                    font-weight:600;
                  "
                >
                  Download Proposal PDF
                </a>
              </td>
            </tr>
          </table>
        </div>
        `
            : ""
        }

      </div>

      <!-- FOOTER -->
      <div
        style="
          padding:24px 34px;
          border-top:1px solid #eef2f7;
          background:#fafafa;
        "
      >
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td align="left">
              <p
                style="
                  margin:0;
                  font-size:14px;
                  font-weight:600;
                  color:#111827;
                "
              >
                Real Estate Team
              </p>

              <p
                style="
                  margin:4px 0 0;
                  font-size:12px;
                  color:#9ca3af;
                "
              >
                Premium Property Solutions
              </p>
            </td>

            <td align="right">
              <span
                style="
                  display:inline-block;
                  padding:9px 16px;
                  border-radius:999px;
                  background:#111827;
                  color:#ffffff;
                  font-size:12px;
                  font-weight:600;
                "
              >
                Personalized Proposal
              </span>
            </td>
          </tr>
        </table>
      </div>

    </div>
  </div>
</body>
</html>
`;
}