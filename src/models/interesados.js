class Interesados{
    constructor() {
        this.interesados = [];
    }
    
    agregarInteresado(id,nombre) {
        let historial = [];
        let interesado = {id,nombre,historial};        
        this.interesados.push(interesado);
        return this.interesados;
    }

    getInteresados(){
        return this.interesados;
    }
    
    getInteresado(id){
        let busqueda = this.interesados.find(item=>{
            return item.id == id;
        });
        return busqueda;
    }

    borrarUsuario(id){
        let borrado = this.getInteresado(id);
        this.interesados  = this.interesados.filter(item=>{
            return item.id != id
        });
        return borrado;
    }

    agregarMensaje(id,remitente,mensaje){
        let date = new Date();
        var monthNames = [
            "Enero", "Febrero", "Marzo",
            "Abril", "Mayo", "Junio", "Julio",
            "Agosto", "Septiembre", "Octubre",
            "Noviembre", "Diciembre"
          ];
        let fecha = date.getHours()+':'+ date.getMinutes()+' | '+monthNames[date.getMonth()]+' '+date.getDate();
        let interesado = this.getInteresado(id);
        let itemHistorial = {remitente,mensaje, fecha};
        interesado.historial.push(itemHistorial);
        return interesado;
    }

}

module.exports = {
    Interesados
}