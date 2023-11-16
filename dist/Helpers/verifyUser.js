"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderDeliveredSuccessfully = exports.updateOrderShippedNotification = exports.sellerOrderReceived = exports.OrderPlacedNotification = exports.ReUpdateIdentityVerification = exports.UpdateVerificationSuccessful = exports.UpdateIdentityVerification = exports.closeAccount = exports.replyAdminContact = exports.sendExperience = exports.welcomeSellers = exports.forgotPassword = exports.verifyAdmin = exports.verifyEmail = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const libphonenumber_js_1 = __importDefault(require("libphonenumber-js"));
const twilio_1 = require("twilio");
const baseUrl_1 = __importStar(require("../baseurl/baseUrl"));
const TimeDiff_1 = require("./TimeDiff");
const constant_1 = require("../components/currency/constant");
const currencyRate_1 = require("./currencyRate");
mail_1.default.setApiKey(process.env.SENDGRID_API);
//
const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <style>
    a {
        color: #3dd082;;
    }
    .container {
        background-color: #ffffff;
    }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" >
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <img src="https://res.cloudinary.com/linconstore-test/image/upload/f_auto,q_auto/v1/web-asset_2023-11-07_17_35/foezgis9u2avsc1ojjkq" alt="Logo" style="display: block; width: 80px; height: 80px;">
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <p> We are sorry to see you go 🚶‍♂ 😢. </p>
                    <p> Your account has been successfully deleted from Linconstore database. </p>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 20px 0; font-size:15px; ">
                    <a target="_blank" href="https://linconstore.com/about">About Us</a> |
                    <a target="_blank" href="https://www.linconstore.com/help-center"> Help Center </a> |
                    <a target="_blank" href="https://linconstore.com/buyer-protection"> Buyer's Protection </a>
                </td>
            </tr>
        </table>
        <p style="text-align: center; font-size: 12px; margin-top: 10px;">
            LINCONSTORE LTD is a registered UK company <br> incorporated in Wales and England with the Company Number 14299582
        </p>
    </div>
</body>
</html>

`;
const from = {
    email: process.env.SENDGRIDEMAIL,
    name: "Linconstore"
};
const client = new twilio_1.Twilio(process.env.ACCOUNTSID, process.env.AUTHTOKEN);
const verifyEmail = (phone_no, email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const mes = {
        to: email,
        from,
        subject: 'Email Verification Code',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
            a {
                color: #3dd082;;
            }
            .container {
                background-color: #ffffff;
            }
                @media only screen and (max-width: 600px) {
                    .container {
                        width: 100% !important;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" >
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <img src="https://res.cloudinary.com/linconstore-test/image/upload/f_auto,q_auto/v1/web-asset_2023-11-07_17_35/foezgis9u2avsc1ojjkq" alt="Logo" style="display: block; width: 80px; height: 80px;">
                        </td>
                    </tr>
                    <tr>
                    <td align="center" style="padding: 10px 0;">
                    <p>Your verification code is </p>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <h1> ${otp} </h1>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p> Enter it on Linconstore website to proceed </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 0; font-size:15px; ">
                            <a target="_blank" href="https://linconstore.com/about"> About Us</a> |
                            <a target="_blank" href="https://www.linconstore.com/help-center"> Help Center </a> |
                            <a target="_blank" href="https://linconstore.com/buyer-protection"> Buyer's Protection </a>
                        </td>
                    </tr>
                </table>
                <p style="text-align: center; font-size: 12px; margin-top: 10px;">
                    LINCONSTORE LTD is a registered UK company <br> incorporated in Wales and England with the Company Number 14299582
                </p>
            </div>
        </body>
        </html>
        `
    };
    try {
        yield mail_1.default.send(mes);
    }
    catch (e) {
        console.log(e);
    }
});
exports.verifyEmail = verifyEmail;
const verifyAdmin = (otp, email) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = {
        to: email,
        from,
        subject: 'OTP for verification',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
            a {
                color: #3dd082;;
            }
            .container {
                background-color: #ffffff;
            }
                @media only screen and (max-width: 600px) {
                    .container {
                        width: 100% !important;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" >
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <img src="https://res.cloudinary.com/linconstore-test/image/upload/f_auto,q_auto/v1/web-asset_2023-11-07_17_35/foezgis9u2avsc1ojjkq" alt="Logo" style="display: block; width: 80px; height: 80px;">
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 10px 0;">
                            <p>Your verification code is </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 10px 0;">
                            <h1> ${otp} </h1>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 10px 0;">
                            <p> Enter it on Linconstore website to proceed </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 0; font-size:15px; ">
                            <a target="_blank" href="https://linconstore.com/about">About Us</a> |
                            <a target="_blank" href="https://www.linconstore.com/help-center"> Help Center </a> |
                            <a target="_blank" href="https://linconstore.com/buyer-protection"> Buyer's Protection </a>
                        </td>
                    </tr>
                </table>
                <p style="text-align: center; font-size: 12px; margin-top: 10px;">
                    LINCONSTORE LTD is a registered UK company <br> incorporated in Wales and England with the Company Number 14299582
                </p>
            </div>
        </body>
        </html>
        `
    };
    try {
        yield mail_1.default.send(messages);
    }
    catch (e) {
        console.log(e);
    }
});
exports.verifyAdmin = verifyAdmin;
const forgotPassword = (otp, id, email) => __awaiter(void 0, void 0, void 0, function* () {
    const resetUrl = `${baseUrl_1.default}/user/reset?id=${id}&pass=${otp}`;
    const mes = {
        to: email,
        from,
        subject: 'Reset Password',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
            a {
                color: #3dd082;;
            }
            .container {
                background-color: #ffffff;
            }
                @media only screen and (max-width: 600px) {
                    .container {
                        width: 100% !important;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" >
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <img src="https://res.cloudinary.com/linconstore-test/image/upload/f_auto,q_auto/v1/web-asset_2023-11-07_17_35/foezgis9u2avsc1ojjkq" alt="Logo" style="display: block; width: 80px; height: 80px;">
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 10px 0;"><p>
                        Please click on the following link to  reset your password. </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                         <a href='${resetUrl}'> Reset Password </a>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 0;"><p>
                         Don't recognise this activity? <a target="_black" href="https://www.linconstore.com/help-center/submit-request"> Contact Support </a> immediately</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 0; font-size:15px; ">
                            <a target="_blank" href="https://linconstore.com/about">About Us</a> |
                            <a target="_blank" href="https://www.linconstore.com/help-center"> Help Center </a> |
                            <a target="_blank" href="https://linconstore.com/buyer-protection"> Buyer's Protection </a>
                        </td>
                    </tr>
                </table>
                <p style="text-align: center; font-size: 12px; margin-top: 10px;">
                    LINCONSTORE LTD is a registered UK company <br> incorporated in Wales and England with the Company Number 14299582
                </p>
            </div>
        </body>
        </html>
        ` // text: `Please click on the following link to  reset your password. Don't recognise this activity? contact us immediately.`
    };
    try {
        yield mail_1.default.send(mes);
    }
    catch (e) {
        console.log(e);
    }
});
exports.forgotPassword = forgotPassword;
const welcomeSellers = (phone, email, type) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = type ? 'Thank you for choosing to extend with us' : 'Thank you for choosing to sell on Linconstore';
    const text = type ? 'We are excited to have you extend your time with us.' : `
        Welcome to Linconstore, an online marketplace where sellers like yourself can connect with buyers and reach a wide range of customers. 

        By choosing to sell on Linconstore, you are tapping into a platform that offers numerous benefits and opportunities for your business.
        `;
    const mes = {
        to: email,
        from,
        subject,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
            a {
                color: #3dd082;;
            }
            .container {
                background-color: #ffffff;
            }
                @media only screen and (max-width: 600px) {
                    .container {
                        width: 100% !important;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" >
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <img src="https://res.cloudinary.com/linconstore-test/image/upload/f_auto,q_auto/v1/web-asset_2023-11-07_17_35/foezgis9u2avsc1ojjkq" alt="Logo" style="display: block; width: 80px; height: 80px;">
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 0;"><p>
                        ${text}</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 0; font-size:15px; ">
                            <a target="_blank" href="https://linconstore.com/about">About Us</a> |
                            <a target="_blank" href="https://www.linconstore.com/help-center"> Help Center </a> |
                            <a target="_blank" href="https://linconstore.com/buyer-protection"> Buyer's Protection </a>
                        </td>
                    </tr>
                </table>
                <p style="text-align: center; font-size: 12px; margin-top: 10px;">
                    LINCONSTORE LTD is a registered UK company <br> incorporated in Wales and England with the Company Number 14299582
                </p>
            </div>
        </body>
        </html>
        `
    };
    try {
        yield mail_1.default.send(mes);
    }
    catch (e) {
        console.log(e);
    }
    try {
        if (phone) {
            const body = type ? 'Thank you for choosing to extend your stay with us' : 'Thank you for choosing to sell on Linconstore. We are excited to have you as part of our community.';
            const messages = yield client.messages.create({
                from: process.env.PHONENO,
                to: (0, libphonenumber_js_1.default)(String(phone)).format('E.164'),
                body
            });
        }
    }
    catch (e) {
        console.log(e);
    }
});
exports.welcomeSellers = welcomeSellers;
const sendExperience = (name, message) => __awaiter(void 0, void 0, void 0, function* () {
    const mes = {
        to: 'Feedback@linconstore.com',
        from,
        subject: 'New User Experience',
        html: `${message}`,
        // text: `Please click on the following link to  reset your password. Don't recognise this activity? contact us immediately.`
    };
    try {
        yield mail_1.default.send(mes);
    }
    catch (e) {
        console.log(e);
    }
});
exports.sendExperience = sendExperience;
const replyAdminContact = (to, title, message) => __awaiter(void 0, void 0, void 0, function* () {
    const mes = {
        to: to,
        from: {
            email: "cs-team@linconstore.com",
            name: "Linconstore"
        },
        subject: title,
        html: `${message}`,
        // text: `Please click on the following link to  reset your password. Don't recognise this activity? contact us immediately.`
    };
    try {
        yield mail_1.default.send(mes);
    }
    catch (e) {
        console.log(e);
    }
});
exports.replyAdminContact = replyAdminContact;
const closeAccount = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const mes = {
        to: email,
        from,
        subject: 'Account Status',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
            a {
                color: #3dd082;;
            }
            .container {
                background-color: #ffffff;
            }
                @media only screen and (max-width: 600px) {
                    .container {
                        width: 100% !important;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" >
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <img src="https://res.cloudinary.com/linconstore-test/image/upload/f_auto,q_auto/v1/web-asset_2023-11-07_17_35/foezgis9u2avsc1ojjkq" alt="Logo" style="display: block; width: 80px; height: 80px;">
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <p>We are sorry to see you go 🚶‍♂ 😢. </p>
                            <p>Your account has been successfully deleted from Linconstore database.</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 0; font-size:15px; ">
                            <a target="_blank" href="https://linconstore.com/about">About Us</a> |
                            <a target="_blank" href="https://www.linconstore.com/help-center"> Help Center </a> |
                            <a target="_blank" href="https://linconstore.com/buyer-protection"> Buyer's Protection </a>
                        </td>
                    </tr>
                </table>
                <p style="text-align: center; font-size: 12px; margin-top: 10px;">
                    LINCONSTORE LTD is a registered UK company <br> incorporated in Wales and England with the Company Number 14299582
                </p>
            </div>
        </body>
        </html>
        
        `
    };
    try {
        yield mail_1.default.send(mes);
    }
    catch (e) {
        console.log(e);
    }
});
exports.closeAccount = closeAccount;
const UpdateIdentityVerification = (email, storeName) => __awaiter(void 0, void 0, void 0, function* () {
    const mes = {
        to: email,
        from,
        subject: 'Action Required: Verify your identity',
        html: `
      
<!DOCTYPE html>
<html>
<head>
    <style>
        a {
            color: #3dd082;;
        }
        .container {
            background-color: #ffffff;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                background-color: #ffffff;
            }
            .product-details td {
                padding: 5px;
            }
            .shipping-details td {
                padding: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <img src="${baseUrl_1.logo}" alt="Logo" style="display: block; width: 60px; height: 60px;">
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p style="font-size: 16px; margin: 0;">  🔔  IDENTITY VERIFICATION REQUIRED </p>
                </td>
            </tr>
            <tr class="product-details">
                <td align="left">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 400px; margin: 0 auto;">
                        <tr>
                            <td align="left" width="50%">
                                <p style="display: block; width: 100%; text-align: left; margin: 0; font-weight: bold;"> Dear ${storeName}, </p>
                            </td>
                        </tr>
                        
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p style="font-size: 14px; margin-bottom: 7px; "> To maintain a safe and secure platform for all users, we require your cooperation in verifying your identity on our platform.</p>
                    <p style="font-size: 14px; margin: 0;"> Please use the following link to upload a new document for identity verification</p>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <a href="${baseUrl_1.uploadLink}" style="display: inline-block; padding: 10px 20px; background-color: #3dd082; color: #000000; text-decoration: none; border-radius: 5px;"> Verify Now </a>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p style="font-size: 14px; margin: 0;"> If you encounter any issues during the verification process, please contact our support team for immediate assistance. </p>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p style="font-size: 14px; margin-bottom: 7px; "> Thank you for your prompt attention to this matter. </p>
                </td>
            </tr>
            
            <tr>
                <td align="center" style="padding: 10px 0; font-size: 12px;">
                    <a target="_blank" href="https://linconstore.com/about">About Us</a> |
                    <a target="_blank" href="https://www.linconstore.com/help-center"> Help Center </a> |
                    <a target="_blank" href="https://linconstore.com/buyer-protection">Buyer's Protection</a>
                </td>
            </tr>
        </table>
        <p style="text-align: center; font-size: 12px; margin-top: 3px;">
            LINCONSTORE LTD is a registered UK company <br> incorporated in Wales and England with the Company Number 14299582
        </p>
    </div>
</body>
</html>

    
        `
    };
    try {
        yield mail_1.default.send(mes);
    }
    catch (e) {
        console.log(e);
    }
});
exports.UpdateIdentityVerification = UpdateIdentityVerification;
const UpdateVerificationSuccessful = (email, storeName) => __awaiter(void 0, void 0, void 0, function* () {
    const mes = {
        to: email,
        from,
        subject: 'Identity Verification Successful!',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                a {
                    color: #3dd082;;
                }
                .container {
                    background-color: #ffffff;
                }
                @media only screen and (max-width: 600px) {
                    .container {
                        width: 100% !important;
                        background-color: #ffffff;
                    }
                    .product-details td {
                        padding: 5px;
                    }
                    .shipping-details td {
                        padding: 5px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                        <td align="center" style="padding: 10px 0;">
                            <img src="${baseUrl_1.logo}" alt="Logo" style="display: block; width: 60px; height: 60px;">
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 10px 0;">
                            <p style="font-size: 16px; margin: 0;"> IDENTITY VERIFICATION 🎉 SUCCESSFUL!</p>
                        </td>
                    </tr>
                    <tr class="product-details">
                        <td align="left">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 400px; margin: 0 auto;">
                                <tr>
                                    <td align="left" width="50%">
                                        <p style="display: block; width: 100%; text-align: left; margin: 0; font-weight: bold;"> Dear ${storeName}, </p>
                                    </td>
                                </tr>
                                
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 10px 0;">
                            <p style="font-size: 14px; margin-bottom: 7px; "> We are pleased to inform you that your identity verification on our platform has been successfully completed. Thank you for your cooperation in this process</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 10px 0;">
                            <a href="${baseUrl_1.default}/login" style="display: inline-block; padding: 10px 20px; background-color: #3dd082; color: #000000; text-decoration: none; border-radius: 5px;"> Go To Store </a>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 10px 0;">
                            <p style="font-size: 14px; margin-bottom: 7px; "> If you have any further questions or need assistance with any aspect of our platform, please feel free to reach out to our support team. We are here to help. </p>
                            <p style="font-size: 14px; margin: 0;"> Thank you once again for your cooperation and for being a valued member of our community. </p>
                        </td>
                    </tr>
                    <tr class="product-details">
                        <td align="left">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 400px; margin: 0 auto;">
                                <tr>
                                    <td align="left" width="50%">
                                        <p style="display: block; width: 100%; text-align: left; margin: 0;"> Best regards, </p>
                                    </td>
                                </tr>
                                
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 10px 0; font-size: 12px;">
                            <a target="_blank" href="https://linconstore.com/about">About Us</a> |
                            <a target="_blank" href="https://www.linconstore.com/help-center"> Help Center </a> |
                            <a target="_blank" href="https://linconstore.com/buyer-protection">Buyer's Protection</a>
                        </td>
                    </tr>
                </table>
                <p style="text-align: center; font-size: 12px; margin-top: 3px;">
                    LINCONSTORE LTD is a registered UK company <br> incorporated in Wales and England with the Company Number 14299582
                </p>
            </div>
        </body>
        </html>
        `
    };
    try {
        yield mail_1.default.send(mes);
    }
    catch (e) {
        console.log(e);
    }
});
exports.UpdateVerificationSuccessful = UpdateVerificationSuccessful;
const ReUpdateIdentityVerification = (email, storeName) => __awaiter(void 0, void 0, void 0, function* () {
    const mes = {
        to: email,
        from,
        subject: '🚫 Verification Document Rejected',
        html: `
      
<!DOCTYPE html>
<html>
<head>
    <style>
        a {
            color: #3dd082;;
        }
        .container {
            background-color: #ffffff;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                background-color: #ffffff;
            }
            .product-details td {
                padding: 5px;
            }
            .shipping-details td {
                padding: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <img src="${baseUrl_1.logo}" alt="Logo" style="display: block; width: 60px; height: 60px;">
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p style="font-size: 16px; margin: 0;"> 🚫 VERIFICATION DOCUMENT REJECTED </p>
                </td>
            </tr>
            <tr class="product-details">
                <td align="left">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 400px; margin: 0 auto;">
                        <tr>
                            <td align="left" width="50%">
                                <p style="display: block; width: 100%; text-align: left; margin: 0; font-weight: bold;"> Dear ${storeName}, </p>
                            </td>
                        </tr>
                        
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p style="font-size: 14px; margin-bottom: 7px; "> We hope this email finds you well. We regret to inform you that the document you submitted for identity verification has been rejected. We understand that this might be disappointing, but we are here to assist you through the process. </p>
                    <p style="font-size: 14px; margin: 0;"> The rejection could be due to various reasons such as illegibility, outdated information, or an incomplete document. We apologize for any inconvenience caused. To proceed, we kindly request you to re-upload a new document for identity verification using the link provided below </p>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <a href="${baseUrl_1.uploadLink}" style="display: inline-block; padding: 10px 20px; background-color: #3dd082; color: #000000; text-decoration: none; border-radius: 5px;"> Verify Now </a>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p style="font-size: 14px; margin: 0;"> If you encounter any difficulties during the re-upload process or have any questions, <a target="_black" href="https://www.linconstore.com/help-center/submit-request"> Contact </a> our support team. We are here to assist you every step of the way.</p>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p style="font-size: 14px; margin-bottom: 7px; "> Thank you for your understanding and cooperation. We look forward to resolving this matter promptly and ensuring a safe and reliable community for all our users. </p>
                </td>
            </tr>
            
            <tr>
                <td align="center" style="padding: 10px 0; font-size: 12px;">
                    <a target="_blank" href="https://linconstore.com/about">About Us</a> |
                    <a target="_blank" href="https://www.linconstore.com/help-center"> Help Center </a> |
                    <a target="_blank" href="https://linconstore.com/buyer-protection">Buyer's Protection</a>
                </td>
            </tr>
        </table>
        <p style="text-align: center; font-size: 12px; margin-top: 3px;">
            LINCONSTORE LTD is a registered UK company <br> incorporated in Wales and England with the Company Number 14299582
        </p>
    </div>
</body>
</html>

        `
    };
    try {
        yield mail_1.default.send(mes);
    }
    catch (e) {
        console.log(e);
    }
});
exports.ReUpdateIdentityVerification = ReUpdateIdentityVerification;
const OrderPlacedNotification = (total, email, message, shippingType, shippingAmount, address, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const currency = user.currency;
    const symbol = (_b = (_a = (constant_1.exchangeCurrency.find(c => c.label === currency))) === null || _a === void 0 ? void 0 : _a.symbol) !== null && _b !== void 0 ? _b : "$";
    const mes = {
        to: email,
        from,
        subject: 'ORDER PLACED - CONFIRMATION',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
        <style>
        a {
            color: #3dd082;;
        }
        .container {
            background-color: #ffffff;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                background-color: #ffffff;
            }
            .product-details td {
                padding: 5px;
            }
            .shipping-details td {
                padding: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <img src="${baseUrl_1.logo}" alt="Logo" style="display: block; width: 60px; height: 60px;">
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p style="font-size: 16px; margin: 0;">ORDER PLACED - CONFIRMATION</p>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p style="font-size: 15px; margin-bottom: 7px; ">Your Order has been placed successfully!!!.</p>
                    <p style="font-size: 14px; margin: 0;">We will notify you when your product is shipped by your seller.</p>
                </td>
            </tr>
            <tr class="product-details">
                <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 300px; margin: 0 auto;">
                      ${message}
                    </table>
                </td>
            </tr>
            <tr class="shipping-details">
                <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 300px; margin: 0 auto;">
                        <tr>
                            <td align="left" width="30%">
                                <p style="display: block; width: 100%; text-align: left; margin: 0;"> ${shippingType} </p>
                            </td>
                            <td align="right">
                                <p style="display: block; width: 100%; text-align: right; margin: 0;">${symbol} ${shippingAmount}</p>
                            </td>
                        </tr>
                        <tr>
                            <td align="left" width="30%">
                                <p style="display: block; width: 100%; text-align: left; margin: 0;"> Total </p>
                            </td>
                            <td align="right">
                                <p style="display: block; width: 100%; text-align: right; margin: 0;">${symbol} ${total} </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0; font-size: 12px;">
                    <p style="font-size: 12px; margin: 0;"> Order Date: ${(0, TimeDiff_1.getFormattedDate)()} </p>
                    <p style="font-size: 12px; margin: 0;"> Payment Method: Stripe </p>
                    <p style="font-size: 12px; margin: 0;"> Shipping Address: ${address ? `${address.address}, ${address.city}, ${address.country} (${address.zipCode})` : ''} </p>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p style="font-size: 15px; margin-bottom: 7px; "> Need help with this Order ??? <a target="_black" href="https://www.linconstore.com/help-center/submit-request"> Contact Support </a>  </p>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0; font-size: 12px;">
                    <a target="_blank" href="https://linconstore.com/about">About Us</a> |
                    <a target="_blank" href="https://www.linconstore.com/help-center"> Help Center </a> |
                    <a target="_blank" href="https://linconstore.com/buyer-protection">Buyer's Protection</a>
                </td>
            </tr>
        </table>
        <p style="text-align: center; font-size: 12px; margin-top: 3px;">
            LINCONSTORE LTD is a registered UK company <br> incorporated in Wales and England with the Company Number 14299582
        </p>
    </div>
</body>
</html>
        `
    };
    try {
        yield mail_1.default.send(mes);
    }
    catch (e) {
        console.log(e);
    }
});
exports.OrderPlacedNotification = OrderPlacedNotification;
const sellerOrderReceived = (product, email, shippingType, shippingAmount, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const symbol = (_d = (_c = (constant_1.exchangeCurrency.find(c => c.value === product.productId.owner.currency))) === null || _c === void 0 ? void 0 : _c.symbol) !== null && _d !== void 0 ? _d : "$";
    const mes = {
        to: email,
        from,
        subject: 'NEW ORDER 🎉 - PLACED',
        html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        a {
            color: #3dd082;;
        }
        .container {
            background-color: #ffffff;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                background-color: #ffffff;
            }
            .product-details td {
                padding: 5px;
            }
            .shipping-details td {
                padding: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <img src="${baseUrl_1.logo}" alt="Logo" style="display: block; width: 60px; height: 60px;">
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p style="font-size: 16px; margin: 0;"> NEW ORDER 🎉 - PLACED </p>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p style="font-size: 15px; margin-bottom: 7px; "> Great news! 🎉 The below product has been ordered from your store! </p>
                    <p style="font-size: 14px; margin: 0;"> Remember to ship the product promptly to your buyer.</p>
                </td>
            </tr>
            <tr class="product-details">
            <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 300px; margin: 0 auto;">
                    <tr>
                        <td align="center" width="30%">
                            <img src="${product.photo}" alt="Product Image" style="display: block; width: 100%; height: auto; border-radius: 10px;">
                        </td>
                        <td align="left" style="padding: 10px;">
                            <sub style="font-size: 10px; text-align: left;"> Order ID: ${orderId}</sub>
                            <p style="font-size: 14px; margin: 0;"> ${product.name}</p>
                              ${product.variants.length > 0 ? product.variants.map((y) => { return `<span style="font-size: 12px; margin: 0;">${y.variant} - ${y.option}</span>`; }).join('/') : ''}
                            <p style="font-size: 12px; margin: 0;"> Unit - ${product.quantity}</p>
                            <p style="font-size: 12px; margin: 0;">${symbol} ${product.price * product.quantity}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr class="shipping-details">
            <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 300px; margin: 0 auto;">
                    <tr>
                        <td align="left" width="30%">
                            <p style="display: block; width: 100%; text-align: left; margin: 0;"> ${shippingType} </p>
                        </td>
                        <td align="right">
                            <p style="display: block; width: 100%; text-align: right; margin: 0;"> ${symbol} ${shippingAmount}</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" width="30%">
                            <p style="display: block; width: 100%; text-align: left; margin: 0;"> Total </p>
                        </td>
                        <td align="right">
                            <p style="display: block; width: 100%; text-align: right; margin: 0;"> ${symbol} ${product.price * product.quantity + shippingAmount} </p>
                        </td>
                    </tr>
                </table>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <a href="${`${baseUrl_1.default}/login`}" style="display: inline-block; padding: 10px 20px; background-color: #3dd082; color: #000000; text-decoration: none; border-radius: 5px;"> Go To Store </a>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p style="font-size: 15px; margin-bottom: 7px; "> Have a question ??? <a target="_black" href="https://www.linconstore.com/help-center/submit-request"> Contact Support </a>  </p>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0; font-size: 12px;">
                    <a target="_blank" href="https://linconstore.com/about">About Us</a> |
                    <a target="_blank" href="https://www.linconstore.com/help-center"> Help Center </a> |
                    <a target="_blank" href="https://linconstore.com/buyer-protection">Buyer's Protection</a>
                </td>
            </tr>
        </table>
        <p style="text-align: center; font-size: 12px; margin-top: 3px;">
            LINCONSTORE LTD is a registered UK company <br> incorporated in Wales and England with the Company Number 14299582
        </p>
    </div>
</body>
</html>

        `
    };
    try {
        yield mail_1.default.send(mes);
    }
    catch (e) {
        console.log(e);
    }
});
exports.sellerOrderReceived = sellerOrderReceived;
const updateOrderShippedNotification = (orderId, trackingId, shipper, address, user, product, variants, shippingType, shippingAmount, date, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g, _h, _j, _k, _l;
    const currency = user.currency;
    // console.log(address);
    const symbol = (_f = (_e = (constant_1.exchangeCurrency.find(c => c.label === currency))) === null || _e === void 0 ? void 0 : _e.symbol) !== null && _f !== void 0 ? _f : "$";
    const userRate = yield (0, currencyRate_1.calculateRate)((_h = (_g = user === null || user === void 0 ? void 0 : user.currency) === null || _g === void 0 ? void 0 : _g.toLowerCase()) !== null && _h !== void 0 ? _h : "usd");
    const productRate = yield (0, currencyRate_1.calculateRate)((_l = (_k = ((_j = product === null || product === void 0 ? void 0 : product.owner) === null || _j === void 0 ? void 0 : _j.currency)) === null || _k === void 0 ? void 0 : _k.toLowerCase()) !== null && _l !== void 0 ? _l : "usd");
    const price = (quantity * product.price * productRate / userRate).toFixed(2);
    const mes = {
        to: user === null || user === void 0 ? void 0 : user.email,
        from,
        subject: 'ORDER SHIPPED - CONFIRMATION',
        html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        a {
            color: #3dd082;;
        }
        .container {
            background-color: #ffffff;
        }

        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                background-color: #ffffff;
            }
            .product-details td {
                padding: 5px;
            }
            .shipping-details td {
                padding: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <img src="${baseUrl_1.logo}" alt="Logo" style="display: block; width: 60px; height: 60px;">
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p style="font-size: 16px; margin: 0;">ORDER SHIPPED - CONFIRMATION</p>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p style="font-size: 15px; margin-bottom: 7px; ">Your order has been shipped by the seller.</p>
                    <p style="font-size: 14px; margin: 0;">You can expect the delivery of your product from ${(0, TimeDiff_1.getDateRange)(shippingType)}.</p>
                </td>
            </tr>
            <tr class="product-details">
                <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 300px; margin: 0 auto;">
                                   <tr>
                            <td align="center" width="30%">
                                <img src="${product.photo}" alt="Product Image" style="display: block; width: 100%; height: auto; border-radius: 10px;">
                            </td>
                            <td align="left" style="padding: 10px;">
                                <sub style="font-size: 10px; text-align: left;"> Order ID: ${orderId}</sub>
                                <p style="font-size: 14px; margin: 0;"> ${product.title}</p>
                                
                                  ${variants.length > 0 ? variants.map(y => {
            return `
                            <span style="font-size: 12px; margin: 0;">${y.variant} - ${y.option}</span>
                               `;
        }).join('/') : ''}
                                <p style="font-size: 12px; margin: 0;"> Unit - ${quantity}</p>
                                <p style="font-size: 12px; margin: 0;">${symbol} ${price}</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p style="font-size: 12px; margin: 0;">Tracking ID: ${trackingId}</p>
                    <p style="font-size: 12px; margin: 0;">Shipped By: ${shipper} </p>
                </td>
            </tr>
            <tr class="shipping-details">
                <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 300px; margin: 0 auto;">
                        <tr>
                            <td align="left" width="30%">
                                <p style="display: block; width: 100%; text-align: left; margin: 0;"> ${shippingType} </p>
                            </td>
                            <td align="right">
                                <p style="display: block; width: 100%; text-align: right; margin: 0;"> ${symbol} ${shippingAmount} </p>
                            </td>
                        </tr>
                        <tr>
                            <td align="left" width="30%">
                                <p style="display: block; width: 100%; text-align: left; margin: 0;"> Total </p>
                            </td>
                            <td align="right">
                                <p style="display: block; width: 100%; text-align: right; margin: 0;"> ${symbol} ${product.price * quantity + shippingAmount} </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0; font-size: 12px;">
                    <p style="font-size: 12px; margin: 0;"> Order Date: ${(0, TimeDiff_1.reCreateDate)(date)} </p>
                    <p style="font-size: 12px; margin: 0;"> Payment Method: Stripe </p>
                    <p style="font-size: 12px; margin: 0;"> Shipping Address: ${address ? `${address.address}, ${address.city}, ${address.country} (${address.zipCode})` : ''} </p>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p style="font-size: 15px; margin-bottom: 7px; "> Need help with this Order? <a target="_black" href="https://www.linconstore.com/help-center/submit-request"> Contact Support </a>  </p>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0; font-size: 12px;">
                    <a target="_blank" href="https://linconstore.com/about">About Us</a> |
                    <a target="_blank" href="https://www.linconstore.com/help-center"> Help Center </a> |
                    <a target="_blank" href="https://linconstore.com/buyer-protection">Buyer's Protection</a>
                </td>
            </tr>
        </table>
        <p style="text-align: center; font-size: 12px; margin-top: 3px;">
            LINCONSTORE LTD is a registered UK company <br> incorporated in Wales and England with the Company Number 14299582
        </p>
    </div>
</body>
</html>

        `
    };
    try {
        yield mail_1.default.send(mes);
    }
    catch (e) {
        console.log(e);
    }
});
exports.updateOrderShippedNotification = updateOrderShippedNotification;
const orderDeliveredSuccessfully = (trackingId, shipper, address, user, product, variants, shippingType, shippingAmount, date, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    var _m, _o, _p, _q, _r, _s;
    const currency = user.currency;
    const symbol = (_o = (_m = (constant_1.exchangeCurrency.find(c => c.label === currency))) === null || _m === void 0 ? void 0 : _m.symbol) !== null && _o !== void 0 ? _o : "$";
    const userRate = yield (0, currencyRate_1.calculateRate)((_q = (_p = user === null || user === void 0 ? void 0 : user.currency) === null || _p === void 0 ? void 0 : _p.toLowerCase()) !== null && _q !== void 0 ? _q : "usd");
    const productRate = yield (0, currencyRate_1.calculateRate)((_s = (_r = (product === null || product === void 0 ? void 0 : product.owner.currency)) === null || _r === void 0 ? void 0 : _r.toLowerCase()) !== null && _s !== void 0 ? _s : "usd");
    const price = ((quantity * product.price + shippingAmount) * productRate / userRate).toFixed(2);
    const mes = {
        to: user === null || user === void 0 ? void 0 : user.email,
        from,
        subject: 'ORDER DELIVERY - FEEDBACK',
        html: `
        
<!DOCTYPE html>
<html>
<head>
    <style>
        a {
            color: #3dd082;;
        }
        .container {
            background-color: #ffffff;
        }
        @media only screen and (max-width: 600px) {
        .container {
            width: 100% !important;
            background-color: #ffffff;
        }
        .product-details td {
            padding: 5px;
        }
        .shipping-details td {
            padding: 5px;
        }
    }
</style>
</head>
<body>
    <div class="container">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <img src="${baseUrl_1.logo}" alt="Logo" style="display: block; width: 60px; height: 60px;">
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p style="font-size: 16px; margin: 0;">ORDER DELIVERED - CONFIRMATION</p>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p style="font-size: 15px; margin-bottom: 7px; "> Have you received your product?.</p>
                    <p style="font-size: 14px; margin: 0;">Please consider taking a moment to rate the product, as your feedback will assist other buyers in making more informed decisions about their purchases.</p>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #3dd082; color: #ffffff; text-decoration: none; border-radius: 5px;">Rate Product</a>
                </td>
            </tr>
            <tr class="product-details">
                <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 300px; margin: 0 auto;">
                                <tr>
                            <td align="center" width="30%">
                                <img src="${product.photo}" alt="Product Image" style="display: block; width: 100%; height: auto; border-radius: 10px;">
                            </td>
                            <td align="left" style="padding: 10px;">
                                <sub style="font-size: 10px; text-align: left;"> Product ID: ${product._id}</sub>
                                <p style="font-size: 14px; margin: 0;"> ${product.title}</p>
                                
                                  ${variants.length > 0 ? variants.map(y => {
            return `
                            <span style="font-size: 12px; margin: 0;">${y.variant} - ${y.option}</span>
                               `;
        }).join('/') : ''}
                                <p style="font-size: 12px; margin: 0;"> Unit - ${quantity}</p>
                                <p style="font-size: 12px; margin: 0;">${symbol} ${price}</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p style="font-size: 12px; margin: 0;">Tracking ID: ${trackingId}</p>
                    <p style="font-size: 12px; margin: 0;">Shipped By: ${shipper}</p>
                </td>
            </tr>
            <tr class="shipping-details">
                <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 300px; margin: 0 auto;">
                        <tr>
                            <td align="left" width="30%">
                                <p style="display: block; width: 100%; text-align: left; margin: 0;"> ${shippingType} </p>
                            </td>
                            <td align="right">
                                <p style="display: block; width: 100%; text-align: right; margin: 0;"> ${symbol} ${shippingAmount} </p>
                            </td>
                        </tr>
                        <tr>
                            <td align="left" width="30%">
                                <p style="display: block; width: 100%; text-align: left; margin: 0;"> Total </p>
                            </td>
                            <td align="right">
                                <p style="display: block; width: 100%; text-align: right; margin: 0;">${symbol} ${price} </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0; font-size: 12px;">
                    <p style="font-size: 12px; margin: 0;"> Order Date: ${(0, TimeDiff_1.reCreateDate)(date)} </p>
                    <p style="font-size: 12px; margin: 0;"> Payment Method: Stripe </p>
                    <p style="font-size: 12px; margin: 0;"> Shipping Address: ${address ? `${address.address}, ${address.city}, ${address.country} (${address.zipCode})` : ''} </p>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0;">
                    <p style="font-size: 15px; margin-bottom: 7px; "> Need help with this Order? <a target="_black" href="https://www.linconstore.com/help-center/submit-request"> Contact Support </a>  </p>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 10px 0; font-size: 12px;">
                    <a target="_blank" href="https://linconstore.com/about">About Us</a> |
                    <a target="_blank" href="https://www.linconstore.com/help-center"> Help Center </a> |
                    <a target="_blank" href="https://linconstore.com/buyer-protection">Buyer's Protection</a>
                </td>
            </tr>
        </table>
        <p style="text-align: center; font-size: 12px; margin-top: 3px;">
            LINCONSTORE LTD is a registered UK company <br> incorporated in Wales and England with the Company Number 14299582
        </p>
    </div>
</body>
</html>
        `
    };
    try {
        yield mail_1.default.send(mes);
    }
    catch (e) {
        console.log(e);
    }
});
exports.orderDeliveredSuccessfully = orderDeliveredSuccessfully;
