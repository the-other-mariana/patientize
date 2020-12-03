$(document).ready(function() {
    function loadProfileInfo(){
        $.ajax({
          async: true,
          url: 'searchProfileInfo/',
          type: 'GET',
          dataType: 'json',
          success: (data) => {
                console.log(data);

                var f = '/uploads/' + data.whom.profilePic;
                $("#profilePic").attr("src", f);

                $("#followers").text(data.whom.followers.length);
                $("#following").text(data.whom.following.length);
                $("#uemail").text(data.whom.email);
                $("#umobile").text(data.whom.mobile);

                console.log("who: " + data.who);
                if(data.whom.followers.includes(data.who) == true){
                    $("#followBtn").prop( "disabled", true);
                }else{
                    $("#followBtn").prop( "disabled", false);
                }
                
                // if user is artist and there are projects
                if ((data.whom.usertype == "artist") && (data.whom.projects.length > 0) ){
                    $('#projSection').empty();
                    var projSection = $('#projSection');

                    for(var i = 0; i < data.whom.projects.length; i++){
                        var projTemplate;
                        if (data.whom.projects[i].type == "picture"){
                            projTemplate = $('#PicProjTemplate');

                            var f = '/uploads/' + data.whom.projects[i].media;
                            projTemplate.find('.card-img-top').attr("src", f);
                        }
                        if (data.whom.projects[i].type == "video"){
                            projTemplate = $('#VidProjTemplate');

                            var f = '/uploads/' + data.whom.projects[i].media;
                            projTemplate.find('.img-fluid').attr("src", f);
                        }
                        if (data.whom.projects[i].type == "animation"){
                            projTemplate = $('#AnimProjTemplate');

                            var f = '/uploads/' + data.whom.projects[i].media;
                            projTemplate.find('.img-fluid').attr("src", f);
                        }
                        if (data.whom.projects[i].type == "audio"){
                            projTemplate = $('#AudioProjTemplate');

                            var f = '/uploads/' + data.whom.projects[i].media;
                            projTemplate.find('.my-audio').attr("src", f);
                        }
                        projTemplate.find('.card-title').text(data.whom.projects[i].title);
                        projTemplate.find('.card-text').text(data.whom.projects[i].description);
                        projTemplate.find('.proj-id').text(i);
                        projTemplate.find('.proj-id').val(i);

                        projTemplate.find('.proj-link').text("More Info...");
                        projTemplate.find('.proj-link').attr("href", data.whom.projects[i].link);
                        if(data.whom.projects[i].link == ""){
                            (projTemplate.find('.proj-link')).css("display","none")
                        }
                                    
                        projSection.append(projTemplate.html());
                    }
                }
                // if user is company and there are vacancies
                if ((data.whom.usertype == "company") && (data.whom.vacancies.length > 0)){
                    $('#vacancySection').empty();
                    
                    var vacSection = $('#vacancySection');

                    for(var i = 0; i < data.whom.vacancies.length; i++){
                        console.log("there are vacancies");
                        var vacTemplate = $('#vacancyTemplate');
                        vacTemplate.find('.card-title').text(data.whom.vacancies[i].jobtitle);
                        vacTemplate.find('.card-text').text(data.whom.vacancies[i].description);

                        vacTemplate.find('.vac-index').text(i);
                        vacTemplate.find('.vac-index').val(i);
                        vacTemplate.find('.test').text(i);
                        vacTemplate.find('.test').val(i);
                        console.log(i);


                        var f = '/uploads/' + data.whom.vacancies[i].docum;
                        vacTemplate.find('.add-doc').attr("href", f);
                
                        vacSection.append(vacTemplate.html());
                    }
                }
            }
        });
    }
    loadProfileInfo();
});