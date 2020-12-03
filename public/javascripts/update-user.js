$(document).ready(function() {

    function loadPic(){
      $.ajax({
        async: true,
        url: 'profpic/',
        type: 'GET',
        dataType: 'text',
        success: (data) => {
          console.log(data);
          var f = '/uploads/' + data;
          $("#profilePic").attr("src", f);
          
        }
      });
    }

    function loadMainInfo(){
      $.ajax({
        async: true,
        url: 'mainInfo/',
        type: 'GET',
        dataType: 'json',
        success: (data) => {
          console.log(data);

          // main info 
          $("#uname").text(data.name);
          $("#uspecialty").text(data.specialty);
          $("#uemail").text(data.email);
          $("#umobile").text(data.mobile);

          // edit data form with default user info
          $("#upname").prop("defaultValue", data.name);
          $("#upspecialty").prop("defaultValue", data.specialty);
          $("#upemail").prop("defaultValue", data.email);
          $("#upmobile").prop("defaultValue", data.mobile);
          
        }
      });
    }

    

    
  
    loadPic();
    loadMainInfo();
    /*
    setInterval(function(){
      // this will run after every 1 second
      //loadPic(); 
      //loadContact();
      //loadItems();
      loadFollows();
    }, 6000);
    */
  });