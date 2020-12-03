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

    function loadContact(){
      $.ajax({
        async: true,
        url: 'contactInfo/',
        type: 'GET',
        dataType: 'json',
        success: (data) => {
          console.log(data);
          $("#uemail").text(data.email);
          $("#umobile").text(data.mobile);

          // edit data form with default user info
          $("#upemail").prop("defaultValue", data.email);
          $("#upmobile").prop("defaultValue", data.mobile);
        }
      });
    }
    function loadFollows(){
      $.ajax({
        async: true,
        url: 'followInfo/',
        type: 'GET',
        dataType: 'json',
        success: (data) => {
          console.log(data);
          $("#followers").text(data.followers);
          $("#following").text(data.following);
        }
      });
    }

    function loadItems(){
      $.ajax({
        async: true,
        url: 'itemsInfo/',
        type: 'GET',
        dataType: 'json',
        success: (data) => {
          console.log(data);
          // if user is artist and there are projects
          if ((data[data.length - 1] == true) && (data.length > 0) ){
            $('#projSection').empty();
            var projSection = $('#projSection');

            // last element contains user type
            for(var i = 0; i < data.length - 1; i++){
              var projTemplate;
              if (data[i].type == "picture"){
                projTemplate = $('#PicProjTemplate');

                var f = '/uploads/' + data[i].media;
                projTemplate.find('.card-img-top').attr("src", f);
              }
              if (data[i].type == "video"){
                projTemplate = $('#VidProjTemplate');

                var f = '/uploads/' + data[i].media;
                projTemplate.find('.img-fluid').attr("src", f);
              }
              if (data[i].type == "animation"){
                projTemplate = $('#AnimProjTemplate');

                var f = '/uploads/' + data[i].media;
                projTemplate.find('.img-fluid').attr("src", f);
              }
              if (data[i].type == "audio"){
                projTemplate = $('#AudioProjTemplate');

                var f = '/uploads/' + data[i].media;
                projTemplate.find('.my-audio').attr("src", f);
              }
              projTemplate.find('.card-title').text(data[i].title);
              projTemplate.find('.card-text').text(data[i].description);
              projTemplate.find('.proj-id').text(i);
              projTemplate.find('.proj-id').val(i);

              projTemplate.find('.proj-link').text("More Info...");
              projTemplate.find('.proj-link').attr("href", data[i].link);
              if(data[i].link == ""){
                (projTemplate.find('.proj-link')).css("display","none")
              }

              projSection.append(projTemplate.html());
              
            }
          }
          // if user is company and there are vacancies
          if ((data[data.length - 1] == false) && (data.length > 0) ){
            $('#vacSection').empty();
            var vacSection = $('#vacSection');

            // last element contains user type
            for(var i = 0; i < data.length - 1; i++){
              var vacTemplate = $('#vacTemplate');
              vacTemplate.find('.card-title').text(data[i].jobtitle);
              vacTemplate.find('.card-text').text(data[i].description);
              vacTemplate.find('.vac-id').text(i);
              vacTemplate.find('.vac-id').val(i);

              var f = '/uploads/' + data[i].docum;
              vacTemplate.find('.add-doc').attr("href", f);

              var cvSection = $('#applicants');
              $('#applicants').empty();
              for(var c = 0; c < data[i].CVs.length; c++){
                var cvTemplate = $('#cvTemplate');
                var f = '/uploads/' + data[i].CVs[c].cv;

                cvTemplate.find('.cv-class').attr("href", f);
                cvTemplate.find('.cv-class').text(data[i].CVs[c].applicant);
                //cvTemplate.find('.applicant-user').text(data[i].CVs[c].applicant);
                cvSection.append(cvTemplate.html());
                
              }
              
              vacSection.append(vacTemplate.html());
            }
          }

        }
      });
    }

    
  
    loadPic();
    loadContact();
    loadItems();
    loadFollows();
    
    setInterval(function(){
      // this will run after every 1 second
      //loadPic(); 
      //loadContact();
      //loadItems();
      loadFollows();
    }, 6000);
    
  });