const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const {listar,pushArchivo} = require('./funciones');
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
        break;
        case '3':
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
app.get('*',(req,res)=>{
    res.render('error');
});

app.post('/crearCurso',(req,res)=>{    
    let lstCursos = listar('cursos.json');
    console.log('cursos',lstCursos);
    let curso = lstCursos.find(curso=>{
        return curso.id == req.body.txtId;
    });
    if(!curso){
        let cursoNuevo = {
            id:req.body.txtId,
            descripcion:req.body.txtDescripcion,
            valor:req.body.txtValor,
            intensidad:req.body.txtIntensidad,
            modalidad:req.body.cbxModalidad,
            estado:'Disponible'
        };
        pushArchivo('cursos.json',cursoNuevo);
        res.render('coorMenSuccess',{mensaje:'Curso Creado Exitosamente!'});
    }
    res.render('coorMenError',{mensaje:'Curso ya registrado'});
});
//app.use(express.static(__dirname+'/public'));

app.listen(3000);