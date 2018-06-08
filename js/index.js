var messageBoard = {

  init: () =>{
      messageBoard.listMessage();
      messageBoard.addMessage();
    },

  //Add a message
  addMessage: () => {
    $(".btn-box .submit").click(()=>{
      let _name =$(".name").val(),_message = $(".message").val();
      if(_name=="" || _message==""){
        alert('Name or message can not be empty.');
      }else {
        $(".name,.message").val("");
        appendMessage(_name,_message);
      }
    });

    let appendMessage = (name,message)=> {
      messageBoard.getJSON("/list/add",'post', {name: name, message: message})
      .then(function(req) {
        debugger;
        if(req.code=='200'){
          messageBoard.listMessage();
        }
      }, function(error) {
        console.error('Error when adding message', error);
      });
    };
  },

  listMessage: () => {
      var str ="";
      messageBoard.getJSON("/list/get",'get')
      .then(function(req) {
        debugger;
        console.log(req);
        if (!req) return false;
        for(let i=0;i<req.length;i++){
          str+=`<li class="list-group-item">${req[i].key}<span> said：</span>${req[i].value}</li>`
        };
        $(".messageList").html(str);
      }, function(error) {
        console.error('Error when list message', error);
      });
  },

  //Common method to communicate with the server
  getJSON : (url,type, data) => {
    const promise = new Promise(function(resolve, reject){
      const handler = function() {
        if (this.readyState !== 4) {
          return;
        };
        if (this.status === 200) {
          resolve(this.response);
        } else {
          reject(new Error(this.statusText));
        }
      };
      const client = new XMLHttpRequest();
      client.open(type, url);
      client.onreadystatechange = handler;
      client.responseType = "json";
      if(type =='get'){
        client.send();
      }else {
        client.setRequestHeader("Content-Type", "application/json");
        client.send(JSON.stringify(data));
      }
    });
    return promise;
  },  
}


$(function(){
  messageBoard.init();
})
