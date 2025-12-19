"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAcc = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const authToken_1 = require("./authToken");
dotenv_1.default.config();
const verifyAcc = async (user) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
        const randomHash = (0, authToken_1.generateToken)(user);
        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: user.email,
            subject: "Verification of email for TNC account",
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verify Your Email - TNC</title>
                    <style>
                        /* Base Reset */
                        body, html {
                            margin: 0;
                            padding: 0;
                            width: 100%;
                            height: 100%;
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                            background-color: #121212;
                            color: #E0E0E0;
                        }

                        /* Container */
                        .email-wrapper {
                            width: 100%;
                            background-color: #ffffff;
                            padding: 40px 0;
                        }

                        .email-content {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #121212;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
                            border: 1px solid #333333;
                        }

                        /* Header */
                        .header {
                            padding: 30px;
                            text-align: center;
                            border-bottom: 1px solid #333333;
                            background-color: #1E1E1E;
                        }

                        .logo {
                            font-size: 24px;
                            font-weight: 700;
                            color: #FFFFFF;
                            letter-spacing: 1px;
                            text-decoration: none;
                        }

                        .logo span {
                            color: #10B981; /* Green Accent for Verification/Success feel */
                        }

                        /* Body */
                        .body-content {
                            padding: 40px 30px;
                            text-align: left;
                        }

                        h1 {
                            margin: 0 0 20px;
                            font-size: 24px;
                            color: #FFFFFF;
                            font-weight: 600;
                        }

                        p {
                            margin: 0 0 20px;
                            font-size: 16px;
                            line-height: 1.6;
                            color: #B0B0B0;
                        }

                        /* Button */
                        .btn-container {
                            text-align: center;
                            margin: 30px 0;
                        }

                        .btn {
                            display: inline-block;
                            background-color: #10B981; /* Green for Positive Action */
                            color: #FFFFFF;
                            text-decoration: none;
                            padding: 14px 32px;
                            border-radius: 6px;
                            font-weight: 600;
                            font-size: 16px;
                            transition: background-color 0.2s ease;
                        }

                        .btn:hover {
                            background-color: #059669; /* Slightly darker green on hover */
                        }

                        /* Link fallback */
                        .link-fallback {
                            font-size: 14px;
                            color: #888888;
                            margin-top: 30px;
                            word-break: break-all;
                        }

                        .link-fallback a {
                            color: #10B981;
                            text-decoration: none;
                        }

                        .link-fallback a:hover {
                            text-decoration: underline;
                        }

                        /* Footer */
                        .footer {
                            padding: 20px 30px;
                            background-color: #161616;
                            text-align: center;
                            font-size: 12px;
                            color: #666666;
                            border-top: 1px solid #333333;
                        }

                        .footer p {
                            margin: 5px 0;
                            font-size: 12px;
                            color: #666666;
                        }

                        /* Mobile Responsive */
                        @media screen and (max-width: 600px) {
                            .email-content {
                                width: 100%;
                                border-radius: 0;
                                border: none;
                            }
                            .body-content {
                                padding: 30px 20px;
                            }
                        }
                    </style>
                </head>
                <body>

                    <div class="email-wrapper">
                        <div class="email-content">
                            <!-- Logo / Header -->
                            <div class="header">
                                <a href="#" class="logo">TNC<span>.Account</span></a>
                            </div>

                            <!-- Main Content -->
                            <div class="body-content">
                                <h1>Verify Your Email Address</h1>
                                <p>Welcome to TNC!</p>
                                <p>Thanks for signing up. We're excited to have you on board. Before you get started, we just need to confirm that this is your email address.</p>
                                
                                <p>Click on the button below to verify your TNC account:</p>

                                <!-- Call to Action Button -->
                                <div class="btn-container">
                                    <a href="http://localhost:${process.env.PORT}/api/auth/verify-acc?hash=${randomHash}" class="btn">Verify Account</a>
                                </div>

                                <p>If you didn't create an account with TNC, you can safely ignore this email.</p>
                                
                                <div class="link-fallback">
                                    <p>If the button above doesn't work, copy and paste this link into your browser:</p>
                                    <a>http://localhost:${process.env.PORT}/api/auth/verify-acc?hash=${randomHash}</a>
                                </div>
                            </div>

                            <!-- Footer -->
                            <div class="footer">
                                <p>&copy; 2024 TNC Inc. All rights reserved.</p>
                                <p>123 Tech Avenue, Silicon Valley, CA 94000</p>
                                <p>Questions? <a href="#" style="color: #666; text-decoration: underline;">Contact Support</a></p>
                            </div>
                        </div>
                    </div>

                </body>
                </html>
            `,
        });
    }
    catch (error) {
        console.log(`${error}`);
        throw new Error(`While sending account verification email`);
    }
};
exports.verifyAcc = verifyAcc;
