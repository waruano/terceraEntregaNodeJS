const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const cursoSchema = new Schema({
    id:{
        type: Number,
        require: true,
        unique: true
    },
    nombre:{
        type: String,
        require: true
    },
    descripcion:{
        type: String,
        require: true
    },
    valor:{
        type: Number,
        require: true
    },
    intensidad:{
        type: Number
    },
    modalidad:{
        type: String,
        enum:['Sin Especificar','presencial','virtual']
    },
    estado:{
        type: String,
        default: 'Disponible'
    },
    imagen:{
        type: Buffer,
        required: true
    }
});
cursoSchema.plugin(uniqueValidator);
const Curso = mongoose.model('Curso',cursoSchema);
module.exports = Curso;