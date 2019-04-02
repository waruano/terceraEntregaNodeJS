const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const url = require('url');   
const bodyParser = require('body-parser');
const {crearCurso, cambiarEstadoCurso, eliminarCurso, getCurso, crearEstudiante, eliminarAspirante} = require('./funciones');
require('./helpers');

const directorioPublico = path.join(__dirname,'../public');
const directorioPartials = path.join(__dirname,'../partials');
const dirNode_modules = path.join(__dirname , '../node_modules')

app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

const funciones = require('./funciones');
app.use(express.static(directorioPublico));
app.use(bodyParser.urlencoded({extended:false}));
hbs.registerPartials(directorioPartials);

app.set('view engine','hbs');
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
    console.log(req.body);
    switch (req.body.selectRol){
        case '1':
            res.redirect('/coordinador');
        break;
        case '2':
            res.redirect('/interesado');
        break;
        case '3':
            res.redirect('/aspirante');
        break;
    }
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
    res.render('aspirante',{
        title:'Aspirante'
    });
});

app.get('/interesado',(req,res)=>{
    res.render('interesado',{
        title:'Interesado'
    });
});

app.post('/inscribir',(req,res)=>{    
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
    }
});


app.get('*',(req,res)=>{
    res.render('error');
});



//app.use(express.static(__dirname+'/public'));

app.listen(3000);