const hbs = require('hbs');

hbs.registerHelper('obtenerPromedio',(nota1,nota2,nota3)=>{
    return (nota1+nota2+nota3)/3;
});

hbs.registerHelper('listar',()=>{
    listaEstudiantes = require('./datos.json');
    let texto = 'Lista de estudiantes <br>';
    listaEstudiantes.forEach(estudiante => {
        texto = texto+
        'Nombre: '+estudiante.nombre+'<br>'
        +'Matematicas: '+estudiante.matematicas+'<br>'
        +'Ingles: '+estudiante.ingles+'<br>'
        +'Programacion: '+estudiante.programacion+'<br>';
    });
    return texto;
});