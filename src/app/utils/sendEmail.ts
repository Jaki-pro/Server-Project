import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: config.NODE_ENV === 'production', // Use `true` for port 465, `false` for all other ports
    auth: {
      user: 'mdjak8980@gmail.com',
      pass: 'pucu ftri lxgc aljs',
    },
  });
  await transporter.sendMail({
    from: 'mdjak8980@gmail.com', // sender address
    to: to, // list of receivers
    subject: 'Password changing alert', // Subject line
    text: 'Reset your password within 10 minutes', // plain text body
    html: html, // html body
  });
};
