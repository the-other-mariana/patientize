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
          $("#udgp").text("DGP: " + data.dgp);
          $("#uemail").text(data.email);
          $("#umobile").text(data.mobile);

          // edit data form with default user info
          $("#upname").prop("defaultValue", data.name);
          $("#upspecialty").prop("defaultValue", data.specialty);
          $("#updgp").prop("defaultValue", data.dgp);
          $("#upemail").prop("defaultValue", data.email);
          $("#upmobile").prop("defaultValue", data.mobile);

          // Info Card
          $("#iusername").val(data.username);
          $("#iname").val(data.name);
          $("#ispecialty").val(data.specialty);
          $("#idgp").val(data.dgp);
          $("#igender").val(data.gender);
          $("#iemail").val(data.email);
          $("#imobile").val(data.mobile);
          $("#ipatients").val(data.patients.length);
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