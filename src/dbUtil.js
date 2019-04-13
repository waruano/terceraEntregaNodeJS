var mongoGuardarEstudiante = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('cursos');
    // Insert some documents
    collection.insertMany([
      {a : 1}, {a : 2}, {a : 3}
    ], function(err, result) {
        if(err){
            console.log("Error al guardar el registro");
        }
      console.log("Inserted 3 documents into the collection");
      callback(result);
    });
  }
  module.exports = {mongoGuardarEstudiante}