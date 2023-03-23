const nodemailer = require("nodemailer");

async function sendInviteEmail(creatorName, creatorUrlSafeName, creatorEncodedEmail, editorsEmail) {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      host: process.env.EMAIL_HOST,
      secure: true,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const protocol = process.env.HTTP_PROTOCOL;
    const baseUrl = process.env.BASE_URL;
    const domain = `${protocol}://${baseUrl}`;

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: editorsEmail,
      subject: "Portfolio Message",
      html: `
                <p>From: ${creatorName}</p>
                <br>
                <div>
                  <p>
                    <a href="${domain}/guest-register/${creatorEncodedEmail}/${creatorUrlSafeName}">Click this link to edit a list with ${creatorName}</a>
                  </p>
                </div>
            `,
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Error sending email..." });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({ message: "Email sent successfully." });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error sending email..." });
  }
}

module.exports = sendInviteEmail;
