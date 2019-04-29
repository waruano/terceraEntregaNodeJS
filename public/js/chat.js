var element = $('.floating-chat');
var myStorage = localStorage;
let socketIo = io();
let interesados = [];

$(document).ready(function () {
    $('.input_msg_write').on('click','.msg_send_btn',function(event){
        enviarMensajeAsesor();
    });
    $('.inbox_chat').on('click', '.chat_list', function (event) {
        $('.chat_list').removeClass('active_chat');
        $(this).addClass('active_chat');
        let interesadoId = $(this).data('user');
        let interesado = interesados.find(itemInteresado => {
            return itemInteresado.id == interesadoId
        });
        actualizarChat(interesado);
    });
    $('#write_msg').keydown(asesorEnter).prop("disabled", false).focus();
});

function actualizarChat(interesado){
    if (interesado) {
        $('#input_msg_write').attr('data-user', interesado.id);
        var contentHistorial = $('.msg_history');
        contentHistorial.html('');
        let historial = interesado.historial;
        historial.forEach(mensaje => {
            let html = '';
            if (mensaje.remitente == 'interesado') {
                addMensajeInteresando(mensaje);
            } else {
                addMensajeAsesor(mensaje);
            }            
        });
    }
}

function addMensajeInteresando(mensaje){
    var contentHistorial = $('.msg_history');
    let html = '<div class="incoming_msg">' +
    '<div class="incoming_msg_img"> <img src="img/studenticon.png"' +
    'alt="sunil"> </div>' +
    '<div class="received_msg">' +
    '<div class="received_withd_msg"><p>' +
    mensaje.mensaje +
    '</p><span class="time_date">' +
    mensaje.fecha +
    '</span> </div></div></div>';
    contentHistorial.append(html);
    contentHistorial.finish().animate({
        scrollTop: contentHistorial.prop("scrollHeight")
    }, 250);
}

function addMensajeAsesor(mensaje){
    var contentHistorial = $('.msg_history');
    let html = '<div class="outgoing_msg">' +
                    '<div class="sent_msg"><p>' +
                    mensaje.mensaje +
                    '</p><span class="time_date">' +
                    mensaje.fecha +
                    '</span></div></div>';
    contentHistorial.append(html);
    contentHistorial.finish().animate({
        scrollTop: contentHistorial.prop("scrollHeight")
    }, 250);
}

function enviarMensajeAsesor(){
    let mensaje = $('#write_msg').val();
    let interesado = $('#input_msg_write').attr('data-user');
    let data = {mensaje,interesado};
    let self = this;
    socketIo.emit('mensajeAsesor',data,function(mensaje){
        self.addMensajeAsesor(mensaje);
        $('#write_msg').val('');
    });
}

if (!myStorage.getItem('chatID')) {
    myStorage.setItem('chatID', createUUID());
}

setTimeout(function () {
    element.addClass('enter');
}, 1000);

element.click(openElement);

function openElement() {
    var messages = element.find('.messages');
    var textInput = element.find('.text-box');
    element.find('>i').hide();
    element.addClass('expand');
    element.find('.chat').addClass('enter');
    var strLength = textInput.val().length * 2;
    textInput.keydown(onMetaAndEnter).prop("disabled", false).focus();
    element.off('click', openElement);
    element.find('.header button').click(closeElement);
    element.find('#sendMessage').click(sendNewMessage);
    messages.scrollTop(messages.prop("scrollHeight"));
}

function closeElement() {
    element.find('.chat').removeClass('enter').hide();
    element.find('>i').show();
    element.removeClass('expand');
    element.find('.header button').off('click', closeElement);
    element.find('#sendMessage').off('click', sendNewMessage);
    element.find('.text-box').off('keydown', onMetaAndEnter).prop("disabled", true).blur();
    setTimeout(function () {
        element.find('.chat').removeClass('enter').show()
        element.click(openElement);
    }, 500);
}

function createUUID() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

function sendNewMessage() {
    var userInput = $('.text-box');
    var newMessage = userInput.html().replace(/\<div\>|\<br.*?\>/ig, '\n').replace(/\<\/div\>/g, '').trim().replace(/\n/g, '<br>');

    if (!newMessage) return;

    var messagesContainer = $('.messages');

    messagesContainer.append([
        '<li class="other">',
        newMessage,
        '</li>'
    ].join(''));

    // clean out old message
    userInput.html('');
    // focus on input
    userInput.focus();

    messagesContainer.finish().animate({
        scrollTop: messagesContainer.prop("scrollHeight")
    }, 250);
    socketIo.emit('message', newMessage);
}

function onMetaAndEnter(event) {
    if (event.keyCode == 13) {
        sendNewMessage();
    }
}

function asesorEnter(event) {
    if (event.keyCode == 13) {
        enviarMensajeAsesor();
    }
}

socketIo.on('message', (message) => {
    var userInput = $('.text-box');
    var messagesContainer = $('.messages');

    messagesContainer.append([
        '<li class="self">',
        message,
        '</li>'
    ].join(''));

    // clean out old message
    userInput.html('');
    // focus on input
    userInput.focus();

    messagesContainer.finish().animate({
        scrollTop: messagesContainer.prop("scrollHeight")
    }, 250);
});

socketIo.on('interesados', (infoInteresados) => {
    interesados = infoInteresados;
    var interesadosContainer = $('.inbox_chat');
    interesadosContainer.html('');
    interesados.forEach(interesado => {
        let ultimoMensaje = interesado.historial[interesado.historial.length - 1];
        interesadosContainer.append(
            '<div class="chat_list" data-user="' + interesado.id + '">' +
            '<div class="chat_people">' +
            '<div class="chat_img"> <img src="img/studenticon.png" alt="sunil"> </div>' +
            '<div class="chat_ib"><h5>' +
            interesado.nombre +
            '<span class="chat_date">' +
            ultimoMensaje.fecha +
            '</span></h5> <p>' +
            ultimoMensaje.mensaje +
            '</p></div></div></div>');
    });
});

socketIo.on('addInteresado', (interesado) => {
    interesados.push(interesado);
    var interesadosContainer = $('.inbox_chat');
    let ultimoMensaje = interesado.historial[interesado.historial.length - 1];
    interesadosContainer.append(
        '<div class="chat_list" data-user="' + interesado.id + '" id ="' + interesado.id + '">' +
        '<div class="chat_people">' +
        '<div class="chat_img"> <img src="img/studenticon.png" alt="sunil"> </div>' +
        '<div class="chat_ib"><h5>' +
        interesado.nombre +
        '<span class="chat_date">' +
        ultimoMensaje.fecha +
        '</span></h5> <p id="last_'+interesado.id+'">' +
        ultimoMensaje.mensaje +
        '</p></div></div></div>');

});

socketIo.on('deleteInteresado', (interesado) => {
    if (interesado) {
        let divInteresado = $('#' + interesado.id);
        divInteresado.remove();
        interesados = interesados.filter(itemInteresado => { return interesado.id != itemInteresado.id });
    }
});

socketIo.on('updateInteresado',(interesado)=>{
    interesadoIndex = interesados.findIndex(interesadoItem => {
        return interesadoItem.id == interesado.id;
    });
    interesados[interesadoIndex] = interesado;
    if($('#input_msg_write').attr('data-user') == interesado.id) {
        actualizarChat(interesado);
    }
    $('#last_'+interesado.id).html(interesado.historial[interesado.historial.length - 1].mensaje);
    
});