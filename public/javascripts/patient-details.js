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
            }

            $('#docSection').empty();
            var patDocs = $('#docSection');
            if (data.documents.length == 0){
                patDocs.attr('style', 'margin-left: auto; margin-right: auto; margin-top: 20px; margin-bottom: 20px;');
                var noDocTemplate = $('#noDocsLabel');
                patDocs.append(noDocTemplate.html());
            }
        }
        });
    }

    loadDetails();

});