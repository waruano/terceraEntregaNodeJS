const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cursoUsuarioSchema = new Schema({
    idCurso:{
        type: Number,
        require: true
    },
    correoUsuario:{
        type: String,
        require: true
    },
});
const CursoUsuario = mongoose.model('CursoUsuario',cursoUsuarioSchema);
module.exports = CursoUsuario;