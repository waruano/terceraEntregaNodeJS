const fs = require('fs');
const cursosFile = 'cursos.json';
const estudiantesFile = 'estudiantes.json';
let cursos = [];
let estudiantes = [];

const guardarCursos = ()=>{
    let strDatos = JSON.stringify(cursos);
    fs.writeFile(cursosFile,strDatos,(err)=>{
        if(err)throw err;
        console.log('Archivo creado');
    });
}

const guardarEstudiantes = ()=>{
    let strDatos = JSON.stringify(estudiantes);
    fs.writeFile(estudiantesFile,strDatos,(err)=>{
        if(err)throw err;
        console.log('Archivo creado');
    });
}

const listarCursos = ()=>{
    try{
        cursos = require('./../'+cursosFile);
    }catch(error){
        console.log(error);
        cursos = [];
    }
};

const listarEstudiantes = ()=>{
    try{
        estudiantes = require('./../'+estudiantesFile);
    }catch(error){
        console.log(error);
        estudiantes = [];
    }
};

const crearCurso = (cursoNuevo)=>{
    listarCursos();
    let curso = cursos.find(curso=>{
        return curso.id == cursoNuevo.id;
    });
    if(!curso){        
        cursos.push(cursoNuevo);
        guardarCursos();
        return true;
    }
    return false;
};

const crearEstudiante = (estudiante, idCurso)=>{
    /*listarEstudiantes();
    let estudiante = estudiantes.find(estudiante=>{
        return estudiante.cedula == estudianteNuevo.cedula;
    });*/
    let curso = getCurso(idCurso);    
    if(!curso){
        console.log('Curso');
        return false;
    }
    //if(!estudiante){ 
        //estudiante.cursos.push(idCurso);
        //estudiantes.push(estudiante);        
        estudiante.save((err,result)=>{
            if(err){
                console.log('Error',err);
                return false;
            }
            console.log('Exito',result);
            return true;
        });
        
    /*}else{
        let idCursoFind = estudiante.cursos.find(idCursoItem =>{return idCursoItem == idCurso});
        if(idCursoFind){
            console.log('cursoFind');
            return false;
        }else{
            estudiante['cursos'].push(idCurso);
            guardarEstudiantes();
            return true;
        }
    }*/
};

const eliminarAspirante = (cedula,idCurso)=>{
    listarEstudiantes();
    estudiante = estudiantes.find(estudiante=>{
        return estudiante.cedula == cedula;
    });
    if(estudiante){
        let cursos = estudiante.cursos;
        let cursosNuevo = cursos.filter(idCursoItem =>{
            return idCursoItem != idCurso;
        });
        if(cursos.length == cursosNuevo.length){
            return false;
        }
        estudiante.cursos = cursosNuevo;
        guardarEstudiantes();
        return true;
    }
    return false;
};

const cambiarEstadoCurso = (idCurso)=>{
    listarCursos();
    let curso = cursos.find(curso=>{
        return curso.id == idCurso;
    });
    if(curso){
        if(curso.estado=='Disponible'){
            curso.estado = 'Cerrado';
        }else{
            curso.estado = 'Disponible';
        }
        guardarCursos();
        return true;
    }
    return false;
};

const eliminarCurso = (idCurso)=>{
    listarCursos();
    let lstCursosNuevo = cursos.filter(curso=>{
        return curso.id != idCurso;
    });
    if(cursos.length > lstCursosNuevo.length){
        cursos = lstCursosNuevo;
        guardarCursos();
        return true;
    }
    return false;
};

const getCurso = (idCurso)=>{
    listarCursos();
    let curso = cursos.find(curso=>{
        return curso.id == idCurso;
    });
    return curso;
};


module.exports = {
    crearCurso, cambiarEstadoCurso, cursos, listarCursos, eliminarCurso, getCurso,
    crearEstudiante, listarEstudiantes, estudiantes, eliminarAspirante
}