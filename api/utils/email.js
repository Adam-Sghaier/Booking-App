//create transporter to send email 
import nodemailer from "nodemailer";

export const sendVerification =async(email,subject,text)=>{
  try {
    // to communicate with a certain thread or process , we should know in advance the host(ip address of the machine which we'll communicate with) and its port
    const transporter = nodemailer.createTransport({
      // host or server address
      host:process.env.HOST,
      service:process.env.SERVICE,
      port:Number(process.env.EMAIL_PORT),
      secure:Boolean(process.env.SECURE),
      auth:{
        user:process.env.USER,
        pass:process.env.PASS
      }
    });

    await transporter.sendMail({
      from:process.env.USER,
      to:email,
      subject:subject,
      html:text
      
    })
    console.log("Email sent Successfully !");
  } catch (error) {
    console.log("Email not sent :(");
    console.log(error);
  }

}