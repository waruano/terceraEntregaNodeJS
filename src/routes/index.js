const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const url = require('url');   
const {crearCurso, cambiarEstadoCurso, eliminarCurso, getCurso, crearEstudiante, eliminarAspirante} = require('./../funciones');
require('./../helpers/helpers');
const Usuario = require('../models/usuario');
const directorioPartials = path.join(__dirname,'../../template/partials');
const directorioViews = path.join(__dirname,'../../template/views');
const bcrypt = require('bcrypt');

app.set('view engine','hbs');
app.set('views',directorioViews);
hbs.registerPartials(directorioPartials);



app.get('/',(req,res)=>{
    res.render('index',{
        title:'Inicio'
    });
});
app.post('/calculos',(req,res)=>{
    
    res.render('calculos',{
        nota1: parseInt(req.body.nota1),
        nota2: parseInt(req.body.nota2),
        nota3: parseInt(req.body.nota3)
    });
});
app.post('/login',(req,res)=>{    
    Usuario.findOne({correo:req.body.txtCorreo},(err,result)=>{
        if(err){
            return res.render('genMenError',{mensaje:'Error - '+err});
        }
        if(!result){
            return res.render('genMenError',{mensaje:'Usuario no encontrado'});
        }
        if(!bcrypt.compareSync(req.body.txtPassword, result.contrasenia)){
            return res.render('genMenError',{mensaje:'Contraseña Incorrecta'});
        }
        if(result.rol == req.body.selectRol){
            console.log(result);
            req.session.usuario = result._id;
            req.session.correo = result.correo;
            switch (req.body.selectRol){
                case 'Coordinador':
                    res.redirect('/coordinador');
                break;
                case 'Aspirante':
                    res.redirect('/aspirante');
                break;
            }
        }else{
            return res.render('genMenError',{mensaje:'No tiene permisos para acceder con este rol'});
        }
    });
});

app.get('/registro',(req,res)=>{
    res.render('registro',{
        title:'Registro'
    });
});
app.post('/registro',(req,res)=>{    
    let salt = bcrypt.genSaltSync();
    let estudiante = new Usuario({
        cedula:req.body.txtId,
        nombre:req.body.txtNombre,
        correo:req.body.txtCorreo,
        telefono:req.body.txtTelefono,
        contrasenia: bcrypt.hashSync(req.body.txtPassword,salt)
    });
    estudiante.save((err,result)=>{
        if(err){
            res.render('genMenError',{mensaje:'Error al Realizar el registro - '+err});
        }
        console.log(result);
        res.render('genMenSuccess',{mensaje:'Usuario Creado Exitosamente'});
    });
});

app.get('/coordinador',(req,res)=>{
    res.render('coordinador',{
        title:'Coordinador'
    });
});
app.get('/nuevoCurso',(req,res)=>{
    res.render('nuevoCurso',{
        title:'Coordinador'
    });
});
app.post('/crearCurso',(req,res)=>{    
    let cursoNuevo = {
        id:req.body.txtId,
        nombre:req.body.txtNombre,
        descripcion:req.body.txtDescripcion,
        valor:req.body.txtValor,
        intensidad:req.body.txtIntensidad,
        modalidad:req.body.cbxModalidad,
        estado:'Disponible'
    };
    if(crearCurso(cursoNuevo)){
        res.render('coorMenSuccess',{mensaje:'Curso Creado Exitosamente!'});
    }
    res.render('coorMenError',{mensaje:'Curso ya registrado'});
});
app.get('/cambiarEstadoCurso',(req,res)=>{
    let idCurso = req.query.id;
    if(cambiarEstadoCurso(idCurso)){
        res.redirect('/coordinador');
    }
    else{
        res.render('coorMenError',{mensaje:'Error al Guardar el Curso'});
    }
});

app.get('/eliminarCurso',(req,res)=>{
    let idCurso = req.query.id;
    if(eliminarCurso(idCurso)){
        res.render('coorMenSuccess',{mensaje:'Curso Eliminado Exitosamente'});
    }else{
        res.render('coorMenError',{mensaje:'Error al Eliminar el Curso'});
    }    
});

app.get('/interesados',(req,res)=>{
    let idCurso = req.query.id;
    let curso = getCurso(idCurso);
    if(curso){
        res.render('coorInteresados',{curso:curso}); 
    }else{
        res.render('coorMenError',{mensaje:'Error al Obtener los Datos del Curso'});
    }
});

app.get('/eliminarAspirante',(req,res)=>{
    let idCurso = req.query.idCurso;
    let cedula = req.query.cedula;
    if(eliminarAspirante(cedula,idCurso)){
        res.redirect(url.format({
            pathname:"/interesados",
            query: {
               "id": idCurso
             }
          }));
    }else{
        res.render('coorMenError',{mensaje:'Error al Eliminar el Aspirante'});
    }    
});

app.get('/aspirante',(req,res)=>{
    Usuario.findById(req.session.usuario,(err,result)=>{
        if(err){
            return res.render('genMenError',{mensaje:'Error - '+err});
        }
        if(!result){
            return res.render('genMenError',{mensaje:'La sesion ha expirado'});
        }
        return res.render('aspirante',{
            title:'Aspirante',
            usuario: result
        });
    })
});

app.get('/interesado',(req,res)=>{
    res.render('interesado',{
        title:'Interesado'
    });
});

app.post('/inscribir',(req,res)=>{    
    let estudiante = new Estudiante({
        cedula:req.body.txtId,
        nombre:req.body.txtNombre,
        correo:req.body.txtCorreo,
        telefono:req.body.txtTelefono,
    });
    Estudiante.findOneAndUpdate({cedula:req.body.txtId},{
        nombre:req.body.txtNombre,
        correo:req.body.txtCorreo,
        telefono:req.body.txtTelefono}
    ,{new:true},
    (err,result)=>{
        if(err){
            res.render('aspMenError',{mensaje:'Error al Realizar la Inscripción'});
        }
        res.render('aspMenSuccess',{mensaje:'Aspirante Actualizado Exitosamente!'});
    });


    /*Estudiante.find({cedula:estudiante.cedula}).exec((err,result)=>{
        if(err){
            res.render('aspMenError',{mensaje:'Error al Realizar la Busqueda'});
        }
        console.log(result);
        if(result.length>0){            
        }
        estudiante.save((err,result)=>{
            if(err){
                res.render('aspMenError',{mensaje:'Error al Realizar la Inscripción'});
            }
            res.render('aspMenSuccess',{mensaje:'Aspirante Inscrito Exitosamente!'});
        });
    });
    
    let idCurso = req.body.cbxIdCurso;
    let estudianteNuevo = {
        cedula:req.body.txtId,
        nombre:req.body.txtNombre,
        correo:req.body.txtCorreo,
        telefono:req.body.txtTelefono,
        cursos:[]
    };
    if(crearEstudiante(estudianteNuevo, idCurso)){
        res.render('aspMenSuccess',{mensaje:'Aspirante Inscrito Exitosamente!'});
    }else{
        res.render('aspMenError',{mensaje:'Error al Realizar la Inscripción'});
    }*/
});


app.get('*',(req,res)=>{
    res.render('error');
});

module.exports = app