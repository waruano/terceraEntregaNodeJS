const fs = require('fs');
const guardar = (datos, fileName)=>{
    let strDatos = JSON.stringify(datos);
    fs.writeFile(fileName,strDatos,(err)=>{
        if(err)throw err;
        console.log('Archivo creado');
    });
}

const listar = (fileName)=>{
    try{
        //JSON.parse(fs.readFileSync(fileName));
        lista =  require('./../'+fileName);
        return lista;
    }catch(error){
        console.log(error);
        return [];
    }
};

const pushArchivo = (fileName,item)=>{
    data = listar(fileName);
    data.push(item);
    guardar(data,fileName);
}

module.exports = {
    guardar, listar, pushArchivo
}