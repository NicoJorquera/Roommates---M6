const fs = require("fs");
const http = require("http");
//desde aqui, en nuestro servidor, destructuramos el module en usuarios.js
const {nuevoUsuario, guardar} = require("./usuarios");

http.createServer((req, res)=>{
    //creamos nuestra primera ruta raiz
    if(req.url == "/" && req.method == "GET"){
        //devolvemos la aplicacion cliente
        res.setHeader("content-type", "text/html")
        res.end(fs.readFileSync("index.html", "utf8"));
    }
    //crear un ruta correspodiente a usuario
    if(req.url.startsWith("/usuario") && req.method == "POST"){
        //esta ruta ejecutara una funcion para hacer una funcion asincrona atraves del axios en API
        //para esto creamos un modulo, llamado usuarios.js
        nuevoUsuario().then(async(usuario)=>{
            //aqui dentro del caso exitoso de la funcion asincrona agregamos el guardarUsuario externo del servidor
            //que espera el nuevo usuario
            guardar(usuario)
            res.end(JSON.stringify(usuario))
        }).catch(e =>{
            res.statusCode = 500; //un error en el servidor
            res.end(); //va detener la consulta
            console.log("Error en el registro en el usuario random", e);
        });
    }
    /*Para que la aplicacion cliente reciba todos los usuarios que vamos estar almacenando en el servidor
    creamos otra ruta*/
    if(req.url.startsWith("/usuarios") && req.method == "GET"){
        //especifica el contenido del json
        res.setHeader("Content-Type", "application/json");
        //devolvemos a los usuarios, visualizados en el json, para el html
        res.end(fs.readFileSync("usuarios.json", "utf8"));
    }
    //creamos la ruta para premio
    /*si vemos en el html, en la parte premio se nota la sincronizacion que debemos usar */
    if(req.url.startsWith("/premio") && req.method == "GET"){
        res.setHeader("Content-Type", "application/json");
        res.end(fs.readFileSync("premio.json", "utf8"));
    }
    if(req.url.startsWith("/premio") && req.method == "PUT"){
        //va recibir un payload (un elemento que tiene dos atributos)
        let body = "";
        req.on("data", (chunk)=>{
            body = chunk.toString() //aqui se transforma en un string
        });
        //en el evento end se ejecuta una funcion callback con su constante nuevoPremio
        req.on("end", ()=>{
            const nuevoPremio = JSON.parse(body) //con el parse y la transformacion anterior, es posible mapearla
            /*metodo writeFile no asincrono
            son tres parametros. En el tercero ocupamos un callback donde se puede manipular lo que sea de exito
            o fracaso */
            fs.writeFile("premio.json", JSON.stringify(nuevoPremio, null,2), (err)=>{
                //es true o contiene informacion del error
                //es false o no contiene informacion del error
                err ? console.log("Ha ocurrido un error"): console.log("OK")
                res.end("Premio editado con exito")
            })
        });
    }
    //creamos la ruta para saber quien ganara de los usuarios random
    if(req.url.startsWith("/ganador") && req.method == "GET"){
        /*usuarios.json tiene una propiedad usuarios. Esta propiedad contiene un arreglo por eso el ".usuarios" */
        const usuarios = JSON.parse(fs.readFileSync("usuarios.json", "utf8")).usuarios
        const total = usuarios.length //estamos obetiendo la longitud del arreglo
        const ganador = usuarios[Math.floor(Math.random() * (total - 0)) + 0];
        res.end(JSON.stringify(ganador));
    }
}).listen(3000, ()=>console.log("Puerto 3000 conectado"))