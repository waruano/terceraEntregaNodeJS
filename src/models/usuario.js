const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    cedula:{
        type: String,
        require: true,
        trim:true
    },
    nombre:{
        type: String,
        require: true
    },
    correo:{
        type: String,
        require: true,
        trim:true,
        unique: true
    },
    contrasenia:{
        type: String,
        required: false
    },
    telefono:{
        type: String,
        require: true,
        trim:true
    },
    rol:{
        type: String,
        default:'Aspirante'
    }
    
});
usuarioSchema.plugin(uniqueValidator);
const Usuario = mongoose.model('Usuario',usuarioSchema);
module.exports = Usuario;