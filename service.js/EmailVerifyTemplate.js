
module.exports = (fname, lname, email,id) => {
    const verificationLink = `http://localhost:5173/emailVerification/${id}` ;
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        h2 {
            color: #007BFF;
            text-align:center;
        }

        p {
            font-size: 16px;
            line-height: 1.6;
            color: #333333;
            text-align:center;
        }
       

        a.btn {
            display: inline-block;
            background-color: #007BFF;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s;
            
        }

        a.btn:hover {
            background-color: #0056b3;
        }

        .footer {
            margin-top: 20px;
            font-size: 14px;
            text-align: center;
            color: #777777;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Email Verification</h2>
        <p> your email :- ${email}</p>
        <p>Thank you ${fname} ${lname}, for signing up for our service. Please verify your email address by clicking the link below:</p>
        <p class="button">
            <a href=${verificationLink} class="btn">Verify Your Email</a>
        </p>
        <p>If you didn't sign up for our service, you can safely ignore this email.</p>
        <div class="footer">
            <p>Best Regards,</p>
            <p>Your Company Name</p>
        </div>
    </div>
</body>
</html>`;

    }