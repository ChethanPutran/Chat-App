var socket;

//Client side
if(window.location.pathname === '/msg'){
    socket = io("http://localhost:3000");

    /**
     * @listing from server
     * when new usre joins
     * @gets {dats}
     * */
    socket.on('user_connect', async (user) => {
        //update view
        online_user_container[0].innerHTML += USER_ELEMENT(user);
    });

     /**
     * @sending to server
     * new messages
     * need to send user_id whom you wanna send msg
     * */
    $('.msg-send-bottom').click(() => {
        const MSG = $('.msg-input').val();
        const TO_USER = middleHeader[1].id;

        middleMain.innerHTML += RECIVED_MSG(MSG_LOADER);

        socket.emit('SENT_MSG', TO_USER, MSG, (sucess) => {
            if (sucess) {
                middleHeader.lastChild.innerHTML = MSG;
            } else {
                middleHeader.lastChild.innerHTML.remove();
                middleHeader.innerHTML += INFO('message could not be sent try again!');
            }
        });
    });

    /**
     * @listening from server 
     * new messages need to send user_id whom you want to send msg
     */

    socket.on('DELIVER_MSG', (msg) => {
        middleHeader.innerHTML += SENT_MSG(MSG);
    });

     /**
     * @listening from server 
     * when user disconnects
     * @gets {user_id}
     */

    socket.on('user_disconnect', (user_id) => {
        //Update views
        $(`#${user_id}`).parent().remove();
        
    })

    


}
