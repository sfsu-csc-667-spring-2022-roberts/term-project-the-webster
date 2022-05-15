 
console.log('INSIDE OF CHAT')
console.log(socket)

    const input = document.getElementById('chat-text-input')

    const send_button = document.getElementById('send-text')
    const chat_logs = document.getElementById('chat-logs')

       
    socket.emit('ping');
        
    socket.on('testEVENT', ()=> {
        console.log('emit worked from .www')
    })

    send_button.addEventListener("click", async function() {
        const message = (input.value) 
        
        if(message != ""){
         
            
          const x = await getUserInput()
          
         let  url = window.location.href
          console.log("URL IS --> " + url)

            if(url.includes('/game')){
                url = 'game';
            }else if(url.includes('lobby')){
                url = 'lobby';
            }


          socket.emit('chat-message', {
              message: message, 
              sender: x.username, 
              destination: url
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







