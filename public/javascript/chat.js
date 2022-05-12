 

    const input = document.getElementById('chat-text-input')

    const send_button = document.getElementById('send-text')
    const chat_logs = document.getElementById('chat-logs')

       
    socket.emit('ping');
        

    send_button.addEventListener("click", async function() {
        const message = (input.value) 
        
        if(message != ""){
         
            
          const x = await getUserInput()
          
          
          socket.emit('chat-message', {
              message: message, 
              sender: x.username
          })
          }

    });
      
    async function getUserInput(){
          
      return await fetch('/userInfo').then((result) => {
           

            return result.json()

          }).catch(err => {
              
            console.log(err)
          })
              
          }
    

    socket.on('pong', () => {
        console.log(" 🏓 🏓 🏓  * PINGPONG  * 🏓 🏓 🏓")
    })
   

    socket.on('message_back', data => {
    
        const _li = document.createElement('li')
        _li.textContent = data.sender + " : " + data.message
        chat_logs.appendChild(_li)
           
    })







