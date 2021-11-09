const axios = require("axios");
const {v4: uuidv4} = require ("uuid");
const fs = require("fs");

const nuevoUsuario = async ()=>{
    //ya que vamos hacer una consulta a la API se ocupa el try catch
    try{
        /*cuando consultamos la API, contiene results y dentro del obejto random tenemos los modelos de datos */
        const {data} = await axios.get("https://randomuser.me/api")
        const usuario = data.results[0]
        const user = {
            id: uuidv4().slice(28),
            correo: usuario.email,
            nombre: `${usuario.name.title} ${usuario.name.first} ${usuario.name.last}`,
            foto: usuario.picture.large,
            pais: usuario.location.country,
        };
        //para que este objeto termine llegando al servidor
        return user;
    /*En caso que suceda algun tipo de error */    
    }catch(e){
        
        throw e;
    }
};

const guardar = (usuario)=>{
    /* Obtener el usuario.JSON para ocupar js, atraves del metodo PUSH vamos a agregar
    al arreglo vacio, el usuario que estamos obteniendo de la consulta a la API*/
    const usuarioJSON = JSON.parse(fs.readFileSync("usuarios.json", "utf8"));
    //accedemos al atributo usuarios y ocupamos metodo PUSH con el paramtero usuario
    usuarioJSON.usuarios.push(usuario);
    //sobreescribiremos el usuarios.json
    fs.writeFileSync("usuarios.json", JSON.stringify(usuarioJSON, null,2));
};

//como este archivo es externo al servidor ocupamos module
module.exports = {nuevoUsuario, guardar};