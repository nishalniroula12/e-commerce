export const transpoter =nodemailer.createTranport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS
    }
})
transpoter.verfiy((error,success)=>{
    if(error){
        console.log("SMTP ERROR",error)
    }else{
        console.log("Smtp connect successfully")

    }
})