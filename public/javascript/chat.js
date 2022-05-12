 

    const input = document.getElementById('chat-text-input')

    const send_button = document.getElementById('send-text')
    const chat_logs = document.getElementById('chat-logs')

       
    socket.emit('ping');
        

    send_button.addEventListener("click", async function() {
        const message = (input.value)
        console.log('CLICKED THE BUTTON!!! ')
            console.log('about to send ==> ' + message)
        if(message != ""){
          console.log('message is not null --> about to send message ')
            
          const x = await getUserInput()
          console.log('not hanging')
          console.log(x)
          
          socket.emit('chat-message', {
              message: message, 
              sender: x.username
          })
          }

    });
      
    async function getUserInput(){
          
      return await fetch('/userInfo').then((result) => {
            console.log("inside user info < ====")


            return result.json()
          }).catch(err => {
              
            console.log(err)
          })
              
          }
    

    socket.on('pong', () => {
        console.log(" 🏓 🏓 🏓  * PINGPONG  * 🏓 🏓 🏓")
    })
   

    socket.on('message_back', data => {
        console.log(data.sender)
        console.log(data.message)

        const _li = document.createElement('li')
        _li.textContent = data.sender + " : " + data.message
        chat_logs.appendChild(_li)
           
    })







