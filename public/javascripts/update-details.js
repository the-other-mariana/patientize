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
                    var id = data.documents[i].ttitle.split(' ').join('');
                    
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
                        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(data.documents[i].tcolor);
                        color = {
                            r: parseInt(result[1], 16),
                            g: parseInt(result[2], 16),
                            b: parseInt(result[3], 16)
                        };
                        factor = 1.5
                        diffColor = { r: parseInt((255 - color.r) / factor), g: parseInt((255 - color.g) / factor), b: parseInt((255 - color.b) / factor) }
                        colorStr = 'rgb(' + (color.r + diffColor.r) + ", " + (color.g + diffColor.g) + ", " + (color.b + diffColor.b) + ")"
                        console.log("got a template");
                        keys = Object.keys(data.documents[i]);
                        console.log(keys);
                        var docStr = '<div id="templateTemplate">'+
                                    '<div class="card text-left" style="margin: 10px; border-color:'+ data.documents[i].tcolor + '; ">'+
                                        '<div class="card-header text-white" style="background-color:'+ data.documents[i].tcolor +';">'+ data.documents[i].ttitle +'</div>'+
                                        '<div class="card-body" style="background-color: '+ colorStr +'">'+
                                            '<form action="/patientDetails" method="get" class="test">'+
                                            '<div class="form-group row">';
                        for(var k = 3; k < keys.length; k++){
                            var fieldtext = keys[k].split('_').join(' ');
                            var fieldGlimpse = data.documents[i][keys[k]];
                            docStr += '<label for = "'+ keys[k] + '" style = "display: block;" class="col-sm-4 col-form-label col-form-label-lg">' + fieldtext + '</label>';
                            docStr += '<div class="col-sm-8">';
                            docStr += '<input type = "text" class="form-control form-control-sm" id = "'+ keys[k] + '" name = "'+ keys[k] + '" value="'+ fieldGlimpse +'" style="border-color: '+ data.documents[i].tcolor +';" disabled></input>';
                            docStr += '</div>';
                        }
                        docStr += '</div>'+
                                    '<div style="float: right; display: inline;">' +
                                        '<button type="button"  id="'+ 'doc'+ i + '" class="btn btn-secondary rounded-btn" data-toggle="modal" data-target="#' + id + 'Edit' + '" style="margin-right: 5px;" onclick="idTemplate(this)">Edit</>' +
                                        '<button type="button" class="btn btn-danger rounded-btn" style="margin-right: 5px;">Delete</button>'+
                                        
                                    '</div>'+
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
                var b = $('<input type="button"  id="tempButton" class="btn text-white rounded-btn" data-toggle="modal" data-target="#' + id + '" onclick="idButton(this)" style="margin-bottom: 28px; margin-right:5px; background-color:'+templates[i].tcolor+'" value="'+ templates[i].ttitle +'"/>');
                // NEW DOC MODAL
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
                    fieldHtml += '<div class="form-group row">';
                    fieldHtml += '<label for="'+ keys[0] + '" class="col-sm-4 col-form-label col-form-label-lg">Custom Template:</label>'+
                                '<div class="col-sm-4">'+
                                '<input type = "text" class="form-control" id = "'+ keys[0] +'" name = "'+ keys[0] +'" value="' + templates[i].ttitle +'"></input>'+
                                '</div>'+
                                '<div class="col-sm-4">'+
                                '<input type="color" class="form-control" id="'+ keys[1] + '" name="'+ keys[1] +'" value="'+ templates[i].tcolor +'"></input>'+
                                '</div>'+
                                '</div>';
                    for (var k = 1; k < keys.length; k++){
                        var fieldtext = keys[k].split('_').join(' ');
                        var fieldtype = templates[i][keys[k]];
                        console.log(fieldtext + " : " + fieldtype);
                        
                        if (fieldtype == "date"){
                            fieldHtml += '<label for="'+ keys[k] + '" style = "display: block;">'+ fieldtext + ':</label>'+
                                '<div class="col-10">'+
                                    '<input class="form-control" type="date" id="' + keys[k] + '" name="' + keys[k] + '"></input>' +
                                '</div>'+
                                '<br/>';
                        }
                        if (fieldtype == "text"){
                            fieldHtml += '<label for = "'+ keys[k] +'" style = "display: block;">'+ fieldtext +':</label>'+
                            '<input type = "text" class="form-control" id = "'+ keys[k] +'" name = "'+ keys[k] +'"></input>'+
                            '<br/>';
                        }
                        if (fieldtype == "text area"){
                            fieldHtml += '<label for = "'+ keys[k] +'" style = "display: block;">'+ fieldtext +':</label>'+
                            '<textarea class="form-control" id="'+ keys[k] +'" name="'+ keys[k] +'" rows="5"></textarea>'+
                            '<br/>';
                        }
                        if (fieldtype == "yes/no"){
                            fieldHtml += '<label for = "'+ keys[k] +'" style = "display: block;">'+ fieldtext +':</label>'+
                            '<select class="form-control typeField" id = "'+keys[k]+'" name = "'+ keys[k] +'" >'+
                                '<option value="Yes">Yes</option>'+
                                '<option value="No">No</option>'+
                            '</select>'+
                            '<br/>';
                        }
                    }
                    modalstr += fieldHtml;
                    modalstr += '</div>'+
                        '<div class="modal-footer">'+
                            '<button type="button" class="btn btn-secondary rounded-btn" data-dismiss="modal">Dismiss</button>'+
                            '<button type="submit" class="btn btn-primary rounded-btn">Save</button>'+
                        '</div>'+
                        '</form>'+
                    '</div>'+
                    '</div>'+
                '</div>';
                document.getElementById("templateModalsSection").insertAdjacentHTML('beforeend', modalstr);
                // EDIT DOC MODAL
                var editmodalstr = '<div class="modal fade bd-example-modal-lg" id="' + id + 'Edit' + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">'+
                    '<div class="modal-dialog modal-lg modal-dialog-centered" role="document">'+
                    '<div class="modal-content">' + 
                        '<div class="modal-header">' +
                        '<h5 class="modal-title" id="exampleModalLongTitle">' + templates[i].ttitle + ' (Edit Mode)'+ '</h5>'+
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                        '</div>'+
                        '<form>'+
                        '<div class="modal-body">';
                    keys = Object.keys(templates[i]);
                    var efieldHtml = "";
                    efieldHtml += '<div class="form-group row">';
                    efieldHtml += '<label for="'+ keys[0] + '" class="col-sm-4 col-form-label col-form-label-lg">Custom Template:</label>'+
                                '<div class="col-sm-4">'+
                                '<input type = "text" class="form-control" id = "'+ keys[0] +'" name = "'+ keys[0] +'" value="' + templates[i].ttitle +'"></input>'+
                                '</div>'+
                                '<div class="col-sm-4">'+
                                '<input type="color" class="form-control" id="'+ keys[1] + '" name="'+ keys[1] +'" value="'+ templates[i].tcolor +'"></input>'+
                                '</div>'+
                                '</div>';
                    for (var k = 1; k < keys.length; k++){
                        var fieldtext = keys[k].split('_').join(' ');
                        var fieldtype = templates[i][keys[k]];
                        console.log(fieldtext + " : " + fieldtype);
                        
                        if (fieldtype == "date"){
                            efieldHtml += '<label for="'+ keys[k] + '" style = "display: block;">'+ fieldtext + ':</label>'+
                                '<div class="col-10">'+
                                    '<input class="form-control" type="date" id="' + keys[k] + '" name="' + keys[k] + '"></input>' +
                                '</div>'+
                                '<br/>';
                        }
                        if (fieldtype == "text"){
                            efieldHtml += '<label for = "'+ keys[k] +'" style = "display: block;">'+ fieldtext +':</label>'+
                            '<input type = "text" class="form-control" id = "'+ keys[k] +'" name = "'+ keys[k] +'"></input>'+
                            '<br/>';
                        }
                        if (fieldtype == "text area"){
                            efieldHtml += '<label for = "'+ keys[k] +'" style = "display: block;">'+ fieldtext +':</label>'+
                            '<textarea class="form-control" id="'+ keys[k] +'" name="'+ keys[k] +'" rows="5"></textarea>'+
                            '<br/>';
                        }
                        if (fieldtype == "yes/no"){
                            efieldHtml += '<label for = "'+ keys[k] +'" style = "display: block;">'+ fieldtext +':</label>'+
                            '<select class="form-control typeField" id = "'+keys[k]+'" name = "'+ keys[k] +'" >'+
                                '<option value="Yes">Yes</option>'+
                                '<option value="No">No</option>'+
                            '</select>'+
                            '<br/>';
                        }
                    }
                    editmodalstr += efieldHtml;
                    editmodalstr += '</div>'+
                        '<div class="modal-footer">'+
                            '<button type="button" class="btn btn-secondary rounded-btn" data-dismiss="modal">Dismiss</button>'+
                            '<button type="submit" class="btn btn-primary rounded-btn" formaction="/patient/editDoc/" formmethod="get" id="' + 'Submit' + id + 'Edit' +'">Save</button>'+
                        '</div>'+
                        '</form>'+
                    '</div>'+
                    '</div>'+
                '</div>';
                document.getElementById("templateModalsSection").insertAdjacentHTML('beforeend', editmodalstr);

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