
var messageBoard = {

  init: () =>{
    // messageBoard.bindAMessage();  
    messageBoard.listMessage();
    messageBoard.addMessage();
    messageBoard.deleteSelectedMsg();
    messageBoard.editAMsg();  

    },

  //Edit a message
  editAMsg : () => {
    //Show EDIT button when hower on a message
    $(".list-group").on('mouseover mouseout', '.list-group-item', function(event){
      if (event.type == 'mouseover') {
        //Show EDIT
        $(this).find(".editbtn").show();
      } else {
        $(this).find(".editbtn").hide();
      }      
    });

    //Edit an message
    $(".list-group").on('click', ".editbtn", function(event){
      $(".panel-editAMsg").hide().show();
      let msgID = $(this).siblings(".msgID").text();
      let publisher = $(this).siblings(".publisher").text();
      let msgContent = $(this).siblings(".msgContent").text();
      // debugger;
      console.log("Edit a message", msgID, publisher, msgContent);
      $(".panel-editAMsg .editPublisher").val(publisher);
      $(".panel-editAMsg .editMessageContent").val(msgContent);
      $(".panel-editAMsg .editSubmit").click( () => {
        messageBoard.getJSON('/list/editAMsg', 'put', [msgID,$(".panel-editAMsg .editPublisher").val(),$(".panel-editAMsg .editMessageContent").val()]);
        messageBoard.listMessage();
        // [msgID, publisher, msgContent] = [null,null,null];
        // $(".panel-editAMsg .editPublisher").val("");
        // $(".panel-editAMsg .editMessageContent").val("");
        $(".panel-editAMsg").hide();

      })
    });

  },
  
    //Delete selected messages
  deleteSelectedMsg : () => {
    $(".deleteSelectedMsg").click( () => {
      let messages = $(".list-group .list-group-item input");
      const deleteItems = [];
      messages.each( (index, item) => {
        if ($(item).prop("checked")) {
          let id = $(item).parent().attr("data-id");
          deleteItems.push(id);
          // console.log(id);
          // $(item).parent().remove();
        }
      });
      console.log(deleteItems);
      messageBoard.getJSON("/list/deleteSelectedMsg", 'delete', deleteItems)
      .then( (res) =>{
        console.log(res);
        $("list-group-item").remove;
        messageBoard.listMessage();
      })
      ;
    })
  },
  
    //Bind event on buttons of each message
  bindAMessage : () => {
    
    $(".messageList").on('click', ".list-group-item .delete-a-message", function() {
      debugger;
      console.log('click a delete');
    });
    
  },

  //Add a message
  addMessage: () => {
    // debugger;
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
        // debugger;
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
        // debugger;
        console.log(req);
        if (!req) return false;
        for(let i=0;i<req.length;i++){
          str+=`<li class="list-group-item" data-id="${req[i].key}">
                  <span class="badge editbtn">EDIT</span>        
                  <input type="checkbox"/>
                  <span>ID:</span>
                  <span class="msgID">${req[i].key}</span>
                  <span>, </span>
                  <span class="publisher">${req[i].value[0]}</span>
                  <span> said：</span>
                  <span class="msgContent">${req[i].value[1]}</span>
                                                    
                </li>`
        };
        $(".messageList").html(str);
      }, function(error) {
        console.error('Error when list message', error);
      })
      // .then(() => {
      //   messageBoard.bindAMessage();
      // });
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
  $(".list-group-item .delete-a-message").click(() => {
    debugger;
    console.log('click a delete');
  });
})
