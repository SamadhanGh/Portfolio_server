import { createTransport } from 'nodemailer';
import AppError from '../utils/appError.js';
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

// Function to format the email body and handle null values
const getFormattedEmailBody = ({ firstName, lastName, email, phoneNumber, serviceType, message }) => {
    return `
  New Contact Form Submission:
  
  First Name: ${firstName || 'N/A'}
  Last Name: ${lastName || 'N/A'}
  Email: ${email || 'N/A'}
  Phone Number: ${phoneNumber || 'N/A'}
  Service Type: ${serviceType || 'N/A'}
  Message: ${message || 'N/A'}
  
  Best Regards,
  Your Portfolio Website
    `;
};

const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
});

export const sendMail = (req, res, next) => {
    const { firstName, lastName, email, phoneNumber, serviceType, message } = req.body;
    if (!email && !phoneNumber) {
        return next(new AppError("Please provide at least an email or phone number.", 400));
    }
    // mail options no-reply@portfolio.com
    const mailOptions = {
        from: email || 'kecoyi7567@gholar.com',
        to: 'sdghorpade2003@gmail.com',
        subject: `Portfolio - ${firstName || "N/A"} ${lastName || "N/A"} tried contacting`,
        text: getFormattedEmailBody({ firstName, lastName, email, phoneNumber, serviceType, message }),
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return next(new AppError("Something went wrong.", 500));
        }
        res.status(200).json({
            "status": "success",
            "data": "Form submitted successfully!",
        });
    });
};


