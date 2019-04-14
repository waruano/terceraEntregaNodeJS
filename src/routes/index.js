const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const url = require('url');
const { crearCurso, cambiarEstadoCurso, eliminarCurso, getCurso, crearEstudiante, eliminarAspirante } = require('./../funciones');
require('./../helpers/helpers');
const Usuario = require('../models/usuario');
const Curso = require('./../models/curso');
const CursoUsuario = require('./../models/cursoUsuario');
const directorioPartials = path.join(__dirname, '../../template/partials');
const directorioViews = path.join(__dirname, '../../template/views');
const bcrypt = require('bcrypt');

app.set('view engine', 'hbs');
app.set('views', directorioViews);
hbs.registerPartials(directorioPartials);



app.get('/', (req, res) => {
    Curso.find({ estado: 'Disponible' }, (err, result) => {
        if (err) {
            return res.render('genMenError', { mensaje: 'Error - ' + err });
        }
        let html = '';
        if (result.length > 0) {
            html = '<table class="table table-hover">';
            html += '<thead class="thead-dark"><tr>' +
                '<th scope="col">Nombre</th><th scope="col">Valor</th><th scope="col">Acciones</th></tr></thead>';
            html += '<tboddy>'
            result.forEach(curso => {
                html += '<tr>';
                html += '<td>' + curso.nombre + '</td>';
                html += '<td>' + curso.valor + '</td>';
                html += '<td><a class="btn btn-primary" data-toggle="collapse" href="#" role="button" aria-expanded="false" data-target=".curso' + curso.id + '">Ver</a></td>';
                html += '</tr>';
                html += '<tr class="collapse curso' + curso.id + '">';
                html += '<td colspan="4">';
                html += '<div class="card card-body">';
                html += '<div class="row"><div class="col-md-2"><strong>Descripción:</strong></div><div class="col-md-10">' + curso.descripcion + '</div></div><div class="row"><div class="col-md-2"><strong>Modalidad: </strong></div><div class="col-md-4">' + curso.modalidad + '</div><div class="col-md-2"><strong>Intensidad Horaria: </strong></div><div class="col-md-4">' + (curso.intensidad? curso.intensidad:'Sin Especificar') + '</div></div>';
                html += '</div>';
                html += '</div></td></tr>';
            });
            html += '</tboddy></table>';
        }
        else {
            html += '<div class="alert alert-primary" role="alert">No hay Cursos Disponibles</div>';
        }
        return res.render('index', {
            title: 'Inicio',
            cursosHtml: html
        });
    });
});
app.post('/calculos', (req, res) => {

    res.render('calculos', {
        nota1: parseInt(req.body.nota1),
        nota2: parseInt(req.body.nota2),
        nota3: parseInt(req.body.nota3)
    });
});
app.post('/login', (req, res) => {
    Usuario.findOne({ correo: req.body.txtCorreo }, (err, result) => {
        if (err) {
            return res.render('genMenError', { mensaje: 'Error - ' + err });
        }
        if (!result) {
            return res.render('genMenError', { mensaje: 'Usuario no encontrado' });
        }
        if (!bcrypt.compareSync(req.body.txtPassword, result.contrasenia)) {
            return res.render('genMenError', { mensaje: 'Contraseña Incorrecta' });
        }
        if (result.rol == req.body.selectRol) {
            console.log(result);
            req.session.usuario = result._id;
            req.session.correo = result.correo;
            switch (req.body.selectRol) {
                case 'Coordinador':
                    res.redirect('/coordinador');
                    break;
                case 'Aspirante':
                    res.redirect('/aspirante');
                    break;
            }
        } else {
            return res.render('genMenError', { mensaje: 'No tiene permisos para acceder con este rol' });
        }
    });
});

app.get('/registro', (req, res) => {
    res.render('registro', {
        title: 'Registro'
    });
});
app.post('/registro', (req, res) => {
    let salt = bcrypt.genSaltSync();
    let estudiante = new Usuario({
        cedula: req.body.txtId,
        nombre: req.body.txtNombre,
        correo: req.body.txtCorreo,
        telefono: req.body.txtTelefono,
        contrasenia: bcrypt.hashSync(req.body.txtPassword, salt)
    });
    estudiante.save((err, result) => {
        if (err) {
            res.render('genMenError', { mensaje: 'Error al Realizar el registro - ' + err });
        }
        console.log(result);
        res.render('genMenSuccess', { mensaje: 'Usuario Creado Exitosamente' });
    });
});

app.get('/coordinador', (req, res) => {

    Curso.find({}, (err, result) => {
        if (err) {
            return res.render('coorMenError', { mensaje: 'Error - ' + err });
        }
        let html = '';
        if (result.length > 0) {
            html = '<table class="table table-hover">';
            html += '<thead class="thead-dark"><tr><th scope="col">Id</th>' +
                '<th scope="col">Nombre</th><th scope="col">Descripción</th><th scope="col">Valor</th><th scope="col">Estado</th><th scope="col">Acciones</th></tr></thead>';
            html += '<tboddy>'
            result.forEach(curso => {
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
        } else {
            html += '<div class="alert alert-primary" role="alert">No hay Curos Creados</div>';
        }
        return res.render('coordinador', {
            title: 'Coordinador',
            cursosHtml: html
        });
    });


});
app.get('/nuevoCurso', (req, res) => {
    res.render('nuevoCurso', {
        title: 'Coordinador'
    });
});
app.post('/crearCurso', (req, res) => {

    let curso = new Curso({
        id: req.body.txtId,
        nombre: req.body.txtNombre,
        descripcion: req.body.txtDescripcion,
        valor: req.body.txtValor,
        intensidad: req.body.txtIntensidad,
        modalidad: req.body.cbxModalidad
    });

    curso.save((err, result) => {
        if (err) {
            return res.render('coorMenError', { mensaje: 'Error - ' + err });
        }
        return res.render('coorMenSuccess', { mensaje: 'Curso Creado Exitosamente!' });
    });

});
app.get('/cambiarEstadoCurso', (req, res) => {
    let idCurso = req.query.id;

    Curso.findOne({ id: idCurso }, (err, curso) => {
        if (err) {
            return res.render('coorMenError', { mensaje: 'Error - ' + err });
        }
        if (curso) {
            if (curso.estado == 'Disponible') {
                curso.estado = 'Cerrado';
            } else {
                curso.estado = 'Disponible';
            }
            Curso.findOneAndUpdate({ _id: curso._id }, { estado: curso.estado }, (errCurso, result) => {
                if (errCurso) {
                    return res.render('coorMenError', { mensaje: 'Error - ' + errCurso });
                }

                return res.redirect('/coordinador');

            });
        } else {
            return res.render('coorMenError', { mensaje: 'Error al Guardar el Curso' });
        }
    });    
});

app.get('/eliminarCurso', (req, res) => {
    let idCurso = req.query.id;
    if (eliminarCurso(idCurso)) {
        res.render('coorMenSuccess', { mensaje: 'Curso Eliminado Exitosamente' });
    } else {
        res.render('coorMenError', { mensaje: 'Error al Eliminar el Curso' });
    }
});

app.get('/interesados', (req, res) => {
    let idCurso = req.query.id;
    Curso.findOne({ id: idCurso }, (errCurso, curso) => {
        if (errCurso) {
            return res.render('coorMenError', { mensaje: 'Error - ' + errCurso });
        }
        if (!curso) {
            return res.render('coorMenError', { mensaje: 'No se lograron obtener los datos del curso' });
        }

        CursoUsuario.find({ idCurso: idCurso }, (errCursoUsuario, cursoUsuarios) => {
            if (errCursoUsuario) {
                return res.render('coorMenError', { mensaje: 'Error - ' + errCursoUsuario });
            }
            if (cursoUsuarios.length > 0) {
                let correos = cursoUsuarios.map(item => {
                    return item.correoUsuario;
                });
                Usuario.find({ correo: { $in: correos } }, (errUsuario, usuarios) => {
                    if (errUsuario) {
                        return res.render('coorMenError', { mensaje: 'Error - ' + errUsuario });
                    }
                    let html = '';
                    if (usuarios.length > 0) {
                        html = '<table class="table table-hover">';
                        html += '<thead class="thead-dark"><tr><th scope="col">Cédula</th>' +
                            '<th scope="col">Nombre</th><th scope="col">Correo</th><th scope="col">Telefono</th><th scope="col">Acciones</th></tr></thead>';
                        html += '<tboddy>'
                        usuarios.forEach(estudiante => {
                            html += '<tr>';
                            html += '<td>' + estudiante.cedula + '</td>';
                            html += '<td>' + estudiante.nombre + '</td>';
                            html += '<td>' + estudiante.correo + '</td>';
                            html += '<td>' + estudiante.telefono + '</td>';
                            html += '<td><a class="btn btn-danger" href="/eliminarAspirante?correo=' + estudiante.correo + '&idCurso=' + idCurso + '" role="button">Eliminar</a></td>';
                            html += '</tr>';
                        });
                        html += '</tboddy></table>';
                    } else {
                        html += '<div class="alert alert-primary" role="alert">No hay Interesados</div>';
                    }
                    return res.render('coorInteresados', { curso: curso, interesadosHtml: html });
                });
            } else {
                let html = '<div class="alert alert-primary" role="alert">No hay Interesados</div>';
                return res.render('coorInteresados', { curso: curso, interesadosHtml: html });
            }
        });

    });
});

app.get('/eliminarAspirante', (req, res) => {
    let idCurso = req.query.idCurso;
    let correo = req.query.correo;

    CursoUsuario.findOneAndDelete({ idCurso: idCurso, correoUsuario: correo }, (err, restult) => {
        if (err) {
            return res.render('coorMenError', { mensaje: 'Error al Eliminar el Aspirante' });
        }
        return res.redirect(url.format({
            pathname: "/interesados",
            query: {
                "id": idCurso
            }
        }));
    });
});

app.get('/aspirante', (req, res) => {
    Usuario.findById(req.session.usuario, (err, result) => {
        if (err) {
            return res.render('genMenError', { mensaje: 'Error - ' + err });
        }
        if (!result) {
            return res.render('genMenError', { mensaje: 'La sesion ha expirado' });
        }

        Curso.find({estado:'Disponible'}, (err, cursos) => {
            if (err) {
                return res.render('genMenError', { mensaje: 'Error - ' + err });
            }
            let html = '';
            if (cursos.length > 0) {
                cursos.forEach(curso => {
                    html += '<option value ="' + curso.id + '">' + curso.nombre + '</option>'
                });
            }
            return res.render('aspirante', {
                title: 'Aspirante',
                usuario: result,
                cursosHtml: html
            });
        });


    })
});

app.get('/interesado', (req, res) => {
    res.render('interesado', {
        title: 'Interesado'
    });
});

app.post('/inscribir', (req, res) => {
    let idCurso = req.body.cbxIdCurso;
    if (!idCurso) {
        return res.render('aspMenError', { mensaje: 'No se ha seleccionado un curso' });
    }
    Usuario.findOneAndUpdate({ correo: req.body.txtCorreo },
        {
            nombre: req.body.txtNombre,
            cedula: req.body.txtId,
            telefono: req.body.txtTelefono
        },
        { new: true },
        (errEstudiante, estudiante) => {
            if (errEstudiante) {
                return res.render('aspMenError', { mensaje: 'Error al Realizar la Inscripción' });
            }
            CursoUsuario.find({ idCurso: idCurso, correoUsuario: estudiante.correo }, (errCursoUsuario, cursoUsuario) => {
                if (errCursoUsuario) {
                    return res.render('aspMenError', { mensaje: 'Error al Realizar la Inscripción' });
                }
                console.log('CursoUsuario', cursoUsuario);
                if (cursoUsuario.length > 0) {
                    return res.render('aspMenError', { mensaje: 'Ya se encuentra registrado en este curso' });
                }
                let cursoUsuarioNuevo = new CursoUsuario(
                    { idCurso: idCurso, correoUsuario: estudiante.correo }
                );
                cursoUsuarioNuevo.save((err, result) => {
                    if (err) {
                        return res.render('aspMenError', { mensaje: 'Error al asociar el estudiante al curso' });
                    }
                    return res.render('aspMenSuccess', { mensaje: 'Aspirante Actualizado Exitosamente!' });
                });
            });
        });
});


app.get('*', (req, res) => {
    res.render('error');
});

module.exports = app