
module.exports = (fname, lname, email,passwordToken) => {
    // const verificationLink = `http://localhost:5173/resetPassword/${passwordToken}`
    const verificationLink = `https://blog-app-frontend-pi.vercel.app/resetPassword/${passwordToken}`
    return(
        `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Password Reset</title>
            <style>
            
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #333;
                    text-align:center;
                }
                h3{
                    margin-right:20px;
                    text-align:right;
                  }
                p {
                    font-size: 16px;
                    line-height: 1.6;
                    color: #666;
                    text-align:center;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #007BFF;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .button:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Password Reset</h1>
                <p>Hi ${fname} ${lname},You have requested to reset your password. Please click the button below to reset your password:</p>
                <p><a class="button" href=${verificationLink}>Reset Password</a></p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <h3>Thank you</h3>
            </div>
        </body>
        </html>
        `
    )

    }