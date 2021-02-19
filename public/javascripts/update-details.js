$(document).ready(function() {


    function loadDetails(){
        $.ajax({
        async: true,
        url: 'patientDetails/',
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            console.log(data);

            patDetails = $('#patientDetails');

            patDetails.find('.text-primary').text(data.lastname + ", " + data.name);
            
            patDetails.find('.patient-gender').text("Gender: " +  data.gender);
            patDetails.find('.patient-mobile').text("Mobile: " +  data.mobile);
            patDetails.find('.patient-email').text("Email: " +  data.email);
            patDetails.find('.patient-birth').text("Birth Date: " + data.birthdate);
            patDetails.find('.patient-age').text("Age: " + data.age + " years old");

            $('#recordSection').empty();
            var patRecords = $('#recordSection');
            if (data.records.length == 0){
                patRecords.attr('style', 'margin-left: auto; margin-right: auto; margin-top: 20px; margin-bottom: 20px;');
                var noRecTemplate = $('#noRecordsLabel');
                patRecords.append(noRecTemplate.html());
            }else{
                for(var i = 0; i < data.records.length; i++){
                    var recTemplate = $('#recordTemplate');
                    recTemplate.find('.text-primary').text("CR-" + (i + 1) + ": ");
                    var times = (data.records[i].appointment).split('T');
                    recTemplate.find('.cr-timestamp').text(times[0] + " at " + times[1]);

                    patRecords.append(recTemplate.html());
                }
            }

            $('#docSection').empty();
            var patDocs = $('#docSection');
            if (data.documents.length == 0){
                patDocs.attr('style', 'margin-left: auto; margin-right: auto; margin-top: 20px; margin-bottom: 20px;');
                var noDocTemplate = $('#noDocsLabel');
                patDocs.append(noDocTemplate.html());
            }else{
                console.log(data.documents.length);
                for(var i = 0; i < data.documents.length; i++){
                    var docTemplate = "";
                    
                    // FOR PRESCRIPTION DOCS
                    if(data.documents[i].type == "prescription"){
                        docTemplate = $('#prescriptionTemplate');
                        docTemplate.find('.text-primary').text("PRESC-" + (i + 1) + ": ");
                        var times = (data.documents[i].appointment).split('T');
                        docTemplate.find('.p-timestamp').text(times[0] + " at " + times[1]);
                        docTemplate.find('.p-diagnosis').text("Diagnosis: " + data.documents[i].diagnosis);
                        patDocs.append(docTemplate.html());
                    }
                    // FOR TEMPLATE DOCS
                    if(data.documents[i].type == "template"){
                        console.log("got a template");
                        keys = Object.keys(data.documents[i]);
                        console.log(keys);
                        var docStr = '<div id="templateTemplate">'+
                                    '<div class="card text-left" style="margin: 10px;">'+
                                        '<div class="card-header">'+ data.documents[i].ttitle +'</div>'+
                                        '<div class="card-body">'+
                                            '<form action="/patientDetails" method="get" class="test">'+
                                            '<div class="form-group row">';
                        for(var k = 2; k < keys.length; k++){
                            var fieldtext = keys[k].split('_').join(' ');
                            var fieldGlimpse = data.documents[i][keys[k]];
                            docStr += '<label for = "'+ keys[k] + '" style = "display: block;" class="col-sm-4 col-form-label col-form-label-lg">' + fieldtext + '</label>';
                            docStr += '<div class="col-sm-8">';
                            docStr += '<input type = "text" class="form-control" id = "'+ keys[k] + '" name = "'+ keys[k] + '" value="'+ fieldGlimpse +'" disabled></input>';
                            docStr += '</div>';
                        }
                        docStr += '</div>'+'<button type="button" class="btn btn-danger" style="float: right;">Delete</button>'+
                                                    '</form>'+ 
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        document.getElementById("docSection").insertAdjacentHTML('beforeend', docStr);
                        
                    }
                    
                }
            }

        }
        });
    }

    function loadPrescription(){
        $.ajax({
        async: true,
        url: 'doctorDetails/',
        type: 'GET',
        dataType: 'json',
        success: (doctor) => {
            console.log(doctor);

            $("#pdoctor").val("Dr. " + doctor.name);
            $("#pdgp").val(doctor.dgp);
        }
        });
    }

    
    function loadTemplates(){
        $.ajax({
          async: true,
          url: 'templateDetails/',
          type: 'GET',
          dataType: 'json',
          success: (templates) => {
            console.log(templates);
            $('#buttonsSection').empty();
            var buttonsSection = $('#buttonsSection');
            
            for(var i = 0; i < templates.length; i++){
                console.log(templates[i].ttitle);
                var id = templates[i].ttitle.split(' ').join('');
                var b = $('<input type="button"  id="tempButton" class="btn btn-primary" data-toggle="modal" data-target="#' + id + '" onclick="idButton(this)" style="margin-bottom: 28px;" value="'+ templates[i].ttitle +'"/>');
                var modalstr = '<div class="modal fade bd-example-modal-lg" id="' + id + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">'+
                    '<div class="modal-dialog modal-lg modal-dialog-centered" role="document">'+
                    '<div class="modal-content">' + 
                        '<div class="modal-header">' +
                        '<h5 class="modal-title" id="exampleModalLongTitle">' + templates[i].ttitle + '</h5>'+
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                        '</div>'+
                        '<form action="/patient/addDoc" method="post">'+
                        '<div class="modal-body">';
                    keys = Object.keys(templates[i]);
                    var fieldHtml = "";
                    fieldHtml += '<label for="'+ keys[0] + '" style = "display: block;">Custom Template:</label>'+
                                '<input type = "text" class="form-control" id = "'+ keys[0] +'" name = "'+ keys[0] +'" value="' + templates[i].ttitle +'"></input>';
                    for (var k = 1; k < keys.length; k++){
                        var fieldtext = keys[k].split('_').join(' ');
                        var fieldtype = templates[i][keys[k]];
                        console.log(fieldtext + " : " + fieldtype);
                        
                        if (fieldtype == "date"){
                            fieldHtml += '<label for="'+ keys[k] + '" style = "display: block;">'+ fieldtext + ':</label>'+
                                '<div class="col-10">'+
                                    '<input class="form-control" type="date" id="' + keys[k] + '" name="' + keys[k] + '">'+
                                '</div>';
                        }
                        if (fieldtype == "text"){
                            fieldHtml += '<label for = "'+ keys[k] +'" style = "display: block;">'+ fieldtext +':</label>'+
                            '<input type = "text" class="form-control" id = "'+ keys[k] +'" name = "'+ keys[k] +'"></input>';
                        }
                        if (fieldtype == "text area"){
                            fieldHtml += '<label for = "'+ keys[k] +'" style = "display: block;">'+ fieldtext +':</label>'+
                            '<textarea class="form-control" id="'+ keys[k] +'" name="'+ keys[k] +'" rows="5" style="margin-bottom: 10px;"></textarea>';
                        }
                    }
                    modalstr += fieldHtml;
                    modalstr += '</div>'+
                        '<div class="modal-footer">'+
                            '<button type="button" class="btn btn-secondary" data-dismiss="modal">Dismiss</button>'+
                            '<button type="submit" class="btn btn-primary">Save</button>'+
                        '</div>'+
                        '</form>'+
                    '</div>'+
                    '</div>'+
                '</div>';
                document.getElementById("templateModalsSection").insertAdjacentHTML('beforeend', modalstr);
                // TODO: GET TEMPLATE MODAL BY ID AND APPEND FIELDS
                buttonsSection.append(b);
            }
          }
        });
    }

    loadDetails();
    loadPrescription();
    loadTemplates();
    /*
    setInterval(function(){
      // this will run after every 1 second
      //loadDetails();
    }, 6000);
    */

});