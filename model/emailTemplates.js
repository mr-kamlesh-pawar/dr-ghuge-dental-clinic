// Simple Email Templates for Aabha Dental Clinic
// Clean, professional design with minimal styling

// Base email wrapper
const emailWrapper = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #dddddd;">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Simple header
const getEmailHeader = (title) => `
  <tr>
    <td style="background:#2c5282;padding:30px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:normal;">
        ${title}
      </h1>
    </td>
  </tr>
`;

// Simple footer
const getEmailFooter = () => `
  <tr>
    <td style="background:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #dddddd;">
      <p style="color:#666666;font-size:14px;margin:0 0 10px 0;font-weight:bold;">
        Dr Rahul Ghuge's Dental clinic
      </p>
      <p style="color:#666666;font-size:13px;margin:0 0 5px 0;">
        Phone: 096043 71344
      </p>
      <p style="color:#666666;font-size:13px;margin:0;">
        Address: railway station, Dharamraj Chowk, near Akurdi, Gurudwara Colony, Akurdi, Pimpri-Chinchwad, Maharashtra 411033
      </p>
    </td>
  </tr>
`;

// Info row helper
const infoRow = (label, value) => `
  <tr>
    <td style="padding:8px 0;border-bottom:1px solid #eeeeee;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="color:#666666;font-size:14px;width:150px;">${label}</td>
          <td style="color:#333333;font-size:14px;font-weight:bold;">${value}</td>
        </tr>
      </table>
    </td>
  </tr>
`;

// ------------------------------------------------------------
// 1. APPOINTMENT BOOKING CONFIRMATION
// ------------------------------------------------------------
export const BOOKING_CONFIRMATION_EMAIL = ({
  patientName,
  appointmentId,
  date,
  time,
  service,
  clinic,
  doctorName = "Our Dental Team",
}) =>
  emailWrapper(`
  ${getEmailHeader("Appointment Booked")}
  
  <tr>
    <td style="padding:30px;">
      <p style="color:#333333;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Dear ${patientName},
      </p>
      
      <p style="color:#333333;font-size:15px;line-height:1.6;margin:0 0 30px;">
        Your appointment at Dr Rahul Ghuge's Dental clinic has been confirmed.
      </p>

      <table width="100%" cellpadding="10" cellspacing="0" style="border:1px solid #dddddd;margin-bottom:30px;">
        <tr>
          <td style="background:#f5f5f5;padding:15px;border-bottom:2px solid #2c5282;">
            <h2 style="color:#2c5282;margin:0;font-size:18px;font-weight:normal;">Appointment Details</h2>
          </td>
        </tr>
        <tr>
          <td style="padding:15px;">
             
            <table width="100%" cellpadding="0" cellspacing="0">
              ${infoRow("Appointment ID:", appointmentId)}
              ${infoRow("Date:", date)}
              ${infoRow("Time:", time)}
              ${infoRow("Service:", service)}
              ${infoRow("Clinic:", `Dr Rahul Ghuge's Dental clinic, ${clinic}`)}
              ${infoRow("Doctor:", doctorName)}
            </table>
          </td>
        </tr>
      </table>

      <table width="100%" cellpadding="15" cellspacing="0" style="background:#fffbea;border:1px solid #f0e68c;margin-bottom:20px;">
        <tr>
          <td>
            <p style="color:#666666;font-size:14px;line-height:1.6;margin:0;">
              <strong>Important:</strong> Please arrive 10 minutes before your appointment time and bring a valid ID.
            </p>
          </td>
        </tr>
      </table>

      <p style="color:#666666;font-size:14px;line-height:1.6;margin:0;text-align:center;">
        For any changes, please contact us at 096043 71344
      </p>
    </td>
  </tr>

  ${getEmailFooter()}
`);

// ------------------------------------------------------------
// 2. APPOINTMENT CONFIRMED (Status Changed)
// ------------------------------------------------------------
export const APPOINTMENT_CONFIRMED_EMAIL = ({
  patientName,
  appointmentId,
  date,
  time,
  clinic,
}) =>
  emailWrapper(`
  ${getEmailHeader("Appointment Confirmed")}
  
  <tr>
    <td style="padding:30px;">
      <p style="color:#333333;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Dear ${patientName},
      </p>
      
      <p style="color:#333333;font-size:15px;line-height:1.6;margin:0 0 30px;">
        Your appointment has been confirmed by our team.
      </p>

      <table width="100%" cellpadding="20" cellspacing="0" style="background:#f0f8f0;border:1px solid #90ee90;margin-bottom:30px;text-align:center;">
        <tr>
          <td>
            <p style="color:#666666;font-size:14px;margin:0 0 10px;">Confirmed For</p>
            <p style="color:#2c5282;font-size:20px;margin:0;font-weight:bold;">${date} at ${time}</p>
            <p style="color:#666666;font-size:14px;margin:10px 0 0;">Location: ${clinic}</p>
            <p style="color:#999999;font-size:12px;margin:10px 0 0;">Appointment ID: ${appointmentId}</p>
          </td>
        </tr>
      </table>

      <p style="color:#666666;font-size:14px;line-height:1.6;margin:0;text-align:center;">
        We look forward to seeing you. Contact us at 096043 71344 for any questions.
      </p>
    </td>
  </tr>

  ${getEmailFooter()}
`);

// ------------------------------------------------------------
// 3. REPORT READY
// ------------------------------------------------------------
export const REPORT_READY_EMAIL = ({ patientName, appointmentId, reportUrl }) =>
  emailWrapper(`
  ${getEmailHeader("Your Report is Ready")}
  
  <tr>
    <td style="padding:30px;">
      <p style="color:#333333;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Dear ${patientName},
      </p>
      
      <p style="color:#333333;font-size:15px;line-height:1.6;margin:0 0 30px;">
        Your dental report has been uploaded and is now available for view and download.
      </p>

      <table width="100%" cellpadding="20" cellspacing="0" style="background:#f5f5f5;border:1px solid #dddddd;margin-bottom:30px;text-align:center;">
        <tr>
          <td>
            <p style="color:#666666;font-size:14px;margin:0 0 10px;">Appointment ID</p>
            <p style="color:#2c5282;font-size:24px;margin:0 0 20px;font-weight:bold;letter-spacing:2px;">${appointmentId}</p>
            <a href="${reportUrl}" style="display:inline-block;background:#2c5282;color:#ffffff;text-decoration:none;padding:12px 30px;font-size:15px;">
              View Report
            </a>
          </td>
        </tr>
      </table>

      <p style="color:#666666;font-size:14px;line-height:1.6;margin:0;text-align:center;">
        For questions about your report, call us at 096043 71344
      </p>
    </td>
  </tr>

  ${getEmailFooter()}
`);

// ------------------------------------------------------------
// 4. APPOINTMENT RESCHEDULED
// ------------------------------------------------------------
export const APPOINTMENT_RESCHEDULED_EMAIL = ({
  patientName,
  appointmentId,
  oldDate,
  oldTime,
  oldService,
  newDate,
  newTime,
  newService,
  clinic,
}) =>
  emailWrapper(`
  ${getEmailHeader("Appointment Rescheduled")}
  
  <tr>
    <td style="padding:30px;">
      <p style="color:#333333;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Dear ${patientName},
      </p>
      
      <p style="color:#333333;font-size:15px;line-height:1.6;margin:0 0 30px;">
        Your appointment has been rescheduled to a new date and time.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:30px;">
        <tr>
          <td width="48%" valign="top">
            <table width="100%" cellpadding="15" cellspacing="0" style="background:#ffe6e6;border:1px solid #ffcccc;">
              <tr>
                <td style="text-align:center;">
                  <p style="color:#999999;font-size:12px;margin:0 0 10px;">Previous Appointment</p>
                  <p style="color:#666666;font-size:16px;margin:0;text-decoration:line-through;">${oldDate}</p>
                  <p style="color:#666666;font-size:14px;margin:5px 0 0;text-decoration:line-through;">${oldTime}</p>
                  <p style="color:#666666;font-size:10px;margin:5px 0 0;text-decoration:line-through;">(${oldService})</p>
                </td>
              </tr>
            </table>
          </td>
          <td width="4%" align="center" valign="middle">
            <p style="font-size:20px;margin:0;color:#666666;">→</p>
          </td>
          <td width="48%" valign="top">
            <table width="100%" cellpadding="15" cellspacing="0" style="background:#e6f7e6;border:1px solid #90ee90;">
              <tr>
                <td style="text-align:center;">
                  <p style="color:#666666;font-size:12px;margin:0 0 10px;">New Appointment</p>
                  <p style="color:#2c5282;font-size:18px;margin:0;font-weight:bold;">${newDate}</p>
                  <p style="color:#2c5282;font-size:16px;margin:5px 0 0;font-weight:bold;">${newTime}</p>
                  <p style="color:#666666;font-size:10px;margin:5px 0 0;text-decoration:line-through;">(${newService})</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <table width="100%" cellpadding="15" cellspacing="0" style="background:#f5f5f5;border:1px solid #dddddd;margin-bottom:20px;">
        <tr>
          <td>
            <p style="color:#666666;font-size:14px;margin:0 0 5px;"><strong>Location:</strong> ${clinic}</p>
            <p style="color:#666666;font-size:14px;margin:0;"><strong>Appointment ID:</strong> ${appointmentId}</p>
          </td>
        </tr>
      </table>

      <p style="color:#666666;font-size:14px;line-height:1.6;margin:0;text-align:center;">
        Contact us at 096043 71344 if you need to make further changes.
      </p>
    </td>
  </tr>

  ${getEmailFooter()}
`);

// ------------------------------------------------------------
// 5. APPOINTMENT CANCELLED
// ------------------------------------------------------------
export const APPOINTMENT_CANCELLED_EMAIL = ({
  patientName,
  appointmentId,
  date,
  time,
  reason = "as per your request",
}) =>
  emailWrapper(`
  ${getEmailHeader("Appointment Cancelled")}
  
  <tr>
    <td style="padding:30px;">
      <p style="color:#333333;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Dear ${patientName},
      </p>
      
      <p style="color:#333333;font-size:15px;line-height:1.6;margin:0 0 30px;">
        Your appointment has been cancelled ${reason}.
      </p>

      <table width="100%" cellpadding="15" cellspacing="0" style="background:#ffe6e6;border:1px solid #ffcccc;margin-bottom:30px;">
        <tr>
          <td>
            <p style="color:#666666;font-size:14px;margin:0 0 10px;text-align:center;">Cancelled Appointment</p>
            <p style="color:#999999;font-size:14px;margin:0;text-decoration:line-through;text-align:center;">
              ${appointmentId} | ${date} at ${time}
            </p>
          </td>
        </tr>
      </table>

      <table width="100%" cellpadding="20" cellspacing="0" style="background:#f5f5f5;border:1px solid #dddddd;margin-bottom:20px;text-align:center;">
        <tr>
          <td>
            <p style="color:#333333;font-size:16px;margin:0 0 15px;font-weight:bold;">Book Another Appointment</p>
            <a href="#" style="display:inline-block;background:#2c5282;color:#ffffff;text-decoration:none;padding:12px 30px;font-size:15px;">
              Book Now
            </a>
          </td>
        </tr>
      </table>

      <p style="color:#666666;font-size:14px;line-height:1.6;margin:0;text-align:center;">
        Questions? Contact us at 096043 71344
      </p>
    </td>
  </tr>

  ${getEmailFooter()}
`);

// ------------------------------------------------------------
// 6. CONTACT MESSAGE RECEIVED (Admin)
// ------------------------------------------------------------
export const CONTACT_MESSAGE_RECEIVED_EMAIL = ({
  name,
  email,
  phone,
  message,
  submittedAt,
}) =>
  emailWrapper(`
  ${getEmailHeader("New Contact Message")}
  
  <tr>
    <td style="padding:30px;">
      <p style="color:#333333;font-size:15px;line-height:1.6;margin:0 0 30px;">
        A new message has been received through your website contact form.
      </p>

      <table width="100%" cellpadding="15" cellspacing="0" style="background:#f5f5f5;border:1px solid #dddddd;margin-bottom:20px;">
        <tr>
          <td>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${infoRow("Name:", name)}
              ${infoRow("Email:", `<a href="mailto:${email}" style="color:#2c5282;">${email}</a>`)}
              ${infoRow("Phone:", `<a href="tel:${phone}" style="color:#2c5282;">${phone}</a>`)}
              ${infoRow("Received:", submittedAt)}
            </table>
          </td>
        </tr>
      </table>

      <table width="100%" cellpadding="15" cellspacing="0" style="background:#ffffff;border:1px solid #dddddd;margin-bottom:20px;">
        <tr>
          <td>
            <p style="color:#666666;font-size:14px;margin:0 0 10px;font-weight:bold;">Message:</p>
            <p style="color:#333333;font-size:14px;line-height:1.6;margin:0;white-space:pre-wrap;">${message}</p>
          </td>
        </tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <a href="mailto:${email}" style="display:inline-block;background:#2c5282;color:#ffffff;text-decoration:none;padding:10px 20px;margin:5px;font-size:14px;">
              Reply via Email
            </a>
            <a href="tel:${phone}" style="display:inline-block;background:#4a5568;color:#ffffff;text-decoration:none;padding:10px 20px;margin:5px;font-size:14px;">
              Call Now
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  ${getEmailFooter()}
`);

// ------------------------------------------------------------
// 7. CONTACT AUTO-REPLY
// ------------------------------------------------------------
export const CONTACT_AUTOREPLY_EMAIL = ({ name }) =>
  emailWrapper(`
  ${getEmailHeader("Message Received")}
  
  <tr>
    <td style="padding:30px;">
      <p style="color:#333333;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Dear ${name},
      </p>
      
      <p style="color:#333333;font-size:15px;line-height:1.6;margin:0 0 30px;">
        Thank you for contacting Dr Rahul Ghuge's Dental clinic. We have received your message and will respond within 24-48 hours.
      </p>

      <table width="100%" cellpadding="15" cellspacing="0" style="background:#fffbea;border:1px solid #f0e68c;margin-bottom:20px;">
        <tr>
          <td>
            <p style="color:#666666;font-size:14px;line-height:1.6;margin:0;">
              <strong>For Urgent Matters:</strong> Please call us directly at 096043 71344
            </p>
          </td>
        </tr>
      </table>

      <p style="color:#666666;font-size:14px;line-height:1.6;margin:0;text-align:center;">
        Working Hours: Monday to Saturday, 9:00 AM - 9:00 PM<br>
      </p>
    </td>
  </tr>

  ${getEmailFooter()}
`);

// ------------------------------------------------------------
// 8. APPOINTMENT REMINDER
// ------------------------------------------------------------
export const APPOINTMENT_REMINDER_EMAIL = ({
  patientName,
  appointmentId,
  date,
  time,
  service,
  clinic,
  doctorName = "Our Dental Team",
}) =>
  emailWrapper(`
  ${getEmailHeader("Appointment Reminder")}
  
  <tr>
    <td style="padding:30px;">
      <p style="color:#333333;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Dear ${patientName},
      </p>
      
      <p style="color:#333333;font-size:15px;line-height:1.6;margin:0 0 30px;">
        This is a reminder that you have an appointment scheduled for tomorrow.
      </p>

      <table width="100%" cellpadding="20" cellspacing="0" style="background:#f5f5f5;border:1px solid #dddddd;margin-bottom:30px;text-align:center;">
        <tr>
          <td>
            <p style="color:#666666;font-size:14px;margin:0 0 10px;">Your Appointment</p>
            <p style="color:#2c5282;font-size:22px;margin:0;font-weight:bold;">${date}</p>
            <p style="color:#2c5282;font-size:18px;margin:5px 0 20px;font-weight:bold;">${time}</p>
            <table width="100%" cellpadding="5" cellspacing="0" style="border-top:1px solid #dddddd;margin-top:15px;padding-top:15px;">
              <tr>
                <td style="color:#666666;font-size:14px;text-align:left;padding:5px 0;"><strong>Service:</strong></td>
                <td style="color:#333333;font-size:14px;text-align:right;padding:5px 0;">${service}</td>
              </tr>
              <tr>
                <td style="color:#666666;font-size:14px;text-align:left;padding:5px 0;"><strong>Doctor:</strong></td>
                <td style="color:#333333;font-size:14px;text-align:right;padding:5px 0;">${doctorName}</td>
              </tr>
              <tr>
                <td style="color:#666666;font-size:14px;text-align:left;padding:5px 0;"><strong>Location:</strong></td>
                <td style="color:#333333;font-size:14px;text-align:right;padding:5px 0;">${clinic}</td>
              </tr>
            </table>
            <p style="color:#999999;font-size:12px;margin:15px 0 0;">Appointment ID: ${appointmentId}</p>
          </td>
        </tr>
      </table>

      <table width="100%" cellpadding="15" cellspacing="0" style="background:#e6f3ff;border:1px solid #b3d9ff;margin-bottom:20px;">
        <tr>
          <td>
            <p style="color:#333333;font-size:14px;margin:0 0 10px;font-weight:bold;">Before You Come:</p>
            <p style="color:#666666;font-size:14px;line-height:1.8;margin:0;">
              • Arrive 10 minutes early<br>
              • Bring your ID and insurance card (if applicable)<br>
              • List any current medications
            </p>
          </td>
        </tr>
      </table>

      <p style="color:#666666;font-size:14px;line-height:1.6;margin:0;text-align:center;">
        Need to reschedule? Call us at 096043 71344
      </p>
    </td>
  </tr>

  ${getEmailFooter()}
`);
