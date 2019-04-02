const hbs = require('hbs');

hbs.registerHelper('listarCursosCoordinador', () => {
    cursos = [];
    cursos = require('./../cursos.json');
    let html = '';
    if (cursos.length > 0) {
        html = '<table class="table table-hover">';
        html += '<thead class="thead-dark"><tr><th scope="col">Id</th>' +
            '<th scope="col">Nombre</th><th scope="col">Descripción</th><th scope="col">Valor</th><th scope="col">Estado</th><th scope="col">Acciones</th></tr></thead>';
        html += '<tboddy>'
        cursos.forEach(curso => {
            html += '<tr>';
            html += '<td>' + curso.id + '</td>';
            html += '<td>' + curso.nombre + '</td>';
            html += '<td>' + curso.descripcion + '</td>';
            html += '<td>' + curso.valor + '</td>';
            html += '<td>' + curso.estado + '</td>';
            html += '<td><a class="btn btn-info" href="/interesados?id=' + curso.id + '" role="button">Iteresados</a>';
            html += curso.estado == 'Cerrado' ? '<a class="btn btn-success" href="/cambiarEstadoCurso?id=' + curso.id + '" role="button">Abrir</a>' : '<a class="btn btn-warning" href="/cambiarEstadoCurso?id=' + curso.id + '" role="button">Cerrar</a></td>';
            html += '</tr>';
        });
        html += '</tboddy></table>';
    }else{
        html += '<div class="alert alert-primary" role="alert">No hay Curos Creados</div>';
    }
    return html;
});

hbs.registerHelper('listarCursosInteresados', () => {
    cursos = [];
    cursos = require('./../cursos.json');
    let cursosDisponibles = cursos.filter(curso => { return curso.estado == 'Disponible' });
    let html = '';
    if (cursosDisponibles.length > 0) {
        html = '<table class="table table-hover">';
        html += '<thead class="thead-dark"><tr>' +
            '<th scope="col">Nombre</th><th scope="col">Valor</th><th scope="col">Acciones</th></tr></thead>';
        html += '<tboddy>'
        cursosDisponibles.forEach(curso => {
            html += '<tr>';
            html += '<td>' + curso.nombre + '</td>';
            html += '<td>' + curso.valor + '</td>';
            html += '<td><a class="btn btn-primary" data-toggle="collapse" href="#" role="button" aria-expanded="false" data-target=".curso' + curso.id + '">Ver</a></td>';
            html += '</tr>';
            html += '<tr class="collapse curso' + curso.id + '">';
            html += '<td colspan="4">';
            html += '<div class="card card-body">';
            html += '<div class="row"><div class="col-md-2"><strong>Descripción:</strong></div><div class="col-md-10">' + curso.descripcion + '</div></div><div class="row"><div class="col-md-2"><strong>Modalidad: </strong></div><div class="col-md-4">' + curso.modalidad + '</div><div class="col-md-2"><strong>Intensidad Horaria: </strong></div><div class="col-md-4">' + curso.intensidad + '</div></div>';
            html += '</div>';
            html += '</div></td></tr>';
        });
        html += '</tboddy></table>';
    }
    else {
        html += '<div class="alert alert-primary" role="alert">No hay Cursos Disponibles</div>';
    }
    return html;
});

hbs.registerHelper('listarCursosOptions', () => {
    cursos = [];
    cursos = require('./../cursos.json');
    let cursosDisponibles = cursos.filter(curso => { return curso.estado == 'Disponible' });
    let html = '';
    cursosDisponibles.forEach(curso => {
        html += '<option value ="' + curso.id + '">' + curso.nombre + '</option>'
    });
    return html;
});

hbs.registerHelper('listarInteresados', (idCurso) => {
    let estudiantes = [];
    estudiantes = require('./../estudiantes.json');
    let estudiantesInteresados = estudiantes.filter(estudiante => {
        let curso = estudiante.cursos.find(idCursoItem => { return idCursoItem == idCurso });
        if (curso) {
            return true;
        }
        return false;
    });
    let html = '';
    if (estudiantesInteresados.length > 0) {
        html = '<table class="table table-hover">';
        html += '<thead class="thead-dark"><tr><th scope="col">Cédula</th>' +
            '<th scope="col">Nombre</th><th scope="col">Correo</th><th scope="col">Telefono</th><th scope="col">Acciones</th></tr></thead>';
        html += '<tboddy>'
        estudiantesInteresados.forEach(estudiante => {
            html += '<tr>';
            html += '<td>' + estudiante.cedula + '</td>';
            html += '<td>' + estudiante.nombre + '</td>';
            html += '<td>' + estudiante.correo + '</td>';
            html += '<td>' + estudiante.telefono + '</td>';
            html += '<td><a class="btn btn-danger" href="/eliminarAspirante?cedula=' + estudiante.cedula + '&idCurso=' + idCurso + '" role="button">Eliminar</a></td>';
            html += '</tr>';
        });
        html += '</tboddy></table>';
    } else {
        html += '<div class="alert alert-primary" role="alert">No hay Interesados</div>';
    }
    return html;
});