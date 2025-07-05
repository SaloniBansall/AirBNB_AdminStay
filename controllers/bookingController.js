const Listing = require("../models/listing");
const nodemailer = require("nodemailer");

module.exports.renderBookingForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/book.ejs", { listing });
};

module.exports.sendBookingRequest = async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("owner");
  const { name, phone, guests, message } = req.body;

  const emailBody = `
    Hello ${listing.owner.username},

    A new booking request has been submitted for your property: "${listing.title}".

    User Details:
    - Name: ${name}
    - Phone: ${phone}
    - Number of People: ${guests}
    - Message: ${message || "(No message)"}

    Please contact the user to confirm the booking.
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: listing.owner.email,
    subject: "New Booking Request",
    text: emailBody
  });

  req.flash("success", "Booking request sent to the owner!");
  res.redirect(`/listings/${req.params.id}`);
};
