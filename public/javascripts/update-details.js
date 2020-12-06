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
                for(var i = 0; i < data.records.length; i++){
                    var docTemplate;
                    if(data.documents[i].type == "prescription"){
                        docTemplate = $('#prescriptionTemplate');
                        docTemplate.find('.text-primary').text("PRESC-" + (i + 1) + ": ");
                        var times = (data.documents[i].appointment).split('T');
                        docTemplate.find('.p-timestamp').text(times[0] + " at " + times[1]);
                        docTemplate.find('.p-diagnosis').text("Diagnosis: " + data.documents[i].diagnosis);
                    }
                    
                    patDocs.append(docTemplate.html());
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

    loadDetails();
    loadPrescription();
    /*
    setInterval(function(){
      // this will run after every 1 second
      //loadDetails();
    }, 6000);
    */

});