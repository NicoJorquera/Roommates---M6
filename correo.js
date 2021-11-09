//NO ESTA TERMINADO

const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: "desafio.edutecno@gmail.com",
        pass: "Ni4l3k2j1",
    },
});
//crear una funcion asincrona
const send = async(ganador, correo, premio)=>{
    //dentro de la funcion, creamos una variable
    let mailOptions = {
        from: "desafio.edutecno@gmail.com",
        to: ["desafio.edutecno@gmail.com"].concat(correo),
        subjetc: `${ganador.nombre} ha logrado el premio!`,
        html: `<h3> Anuncio: El ganador de "¿Quien ganara?" fue ${ganador.nombre} y ha ganado ${premio}. </br>
        Gracias a todos por participar</h3>`
    };
    try{
        const result = await transporter.sendMail(mailOptions);
        return result;
    }catch(e){
        throw e;
    }
};

send("Ganador de prueba", [], "Premio de prueba");


module.exports = {send};

