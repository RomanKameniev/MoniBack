const nodemailer = require('nodemailer')

// async..await is not allowed in global scope, must use a wrapper
const sendMailVarify = async (email, id) => {
	if (!email) return 'no email'
	// Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing
	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'moni.wtf.info@gmail.com', // generated ethereal user
			pass: '20002000Batman', // generated ethereal password
		},
	})

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: '"Fred Foo 👻" <info@moni.wtf>', // sender address
		to: email, // list of receivers
		subject: 'Hello ✔', // Subject line
		//text: "Hello world", // plain text body
		html: `
        <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Hello, user</title>
    </head>
    <body>
        <div><b>Recently you was registered on servivce moni.wtf</b></div>
        <div>if that was not you, please, ignore this message</div>
        <div>To complete registration follow link: </div>
        <a href={localhost:80/?verify=${id}}>http://localhost:80/?verify=${id}</a>
    </body>
    </html>
    `,
		amp: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Hello, user</title>
    </head>
    <body>
        <div><b>Recently you was registered on servivce moni.wtf</b></div>
        <div>if that was not you, please, ignore this message</div>
        <div>To complete registration follow link: </div>
    </body>
    </html>`,
	})

	console.log('Message sent: %s', info.messageId)
	// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

	// Preview only available when sending through an Ethereal account
	console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
	// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
//sendMailVarify('roman.kameniev@nure.ua', 15)

exports.sendMail = sendMailVarify
