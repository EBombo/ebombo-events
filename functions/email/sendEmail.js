const nodemailer = require("nodemailer");
let smtpTransport = require("nodemailer-smtp-transport");
const {config} = require("../config");
const logger = require("../utils/logger");

const SERVICE = config.serverEmail.service;
const HOST = config.serverEmail.host;
const FROM = `${config.serverEmail.from} <config.serverEmail.user>`;
const USER = config.serverEmail.user;
const PASSWORD = config.serverEmail.password;

exports.sendEmail = async (to, subject, template, model) => {
    if (!to) return;

    const transporter = nodemailer.createTransport(smtpTransport({
        service: SERVICE,
        host: HOST,
        auth: {
            user: USER,
            pass: PASSWORD
        },
        secure: true,
        debug: true
    }));

    const mailOptions = {
        from: FROM,
        to: to,
        subject: subject,
        html: html(template, {
            ...model,
            ...config.serverEmail.images,
            "headerLogo": config.serverEmail.headerLogo,
            "footerLogo": config.serverEmail.footerLogo
        }),
    };

    const info = await transporter.sendMail(mailOptions);

    logger.log(info);
    logger.log("sent email");

    return info;
};

const html = (template, model) => template;
