$(document).ready(function() {


    function loadPatients(){
        $.ajax({
        async: true,
        url: 'patientsInfo/',
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            console.log(data);
            // if user is artist and there are projects
            if ((data.length > 0) ){
            $('#patientSection').empty();
            var patientSection = $('#patientSection');

            for(var i = data.length - 1; i >= 0; i--){
                var patTemplate;
                var idx = (data.length - 1) - i;
                
                patTemplate = $('#patientTemplate');

                patTemplate.find('.card-header').text("Patient #" + (i + 1));
                patTemplate.find('.text-primary').text(data[i].lastname + ", " + data[i].name);
                patTemplate.find('.test').attr('action', '/patient/' + i);
                patTemplate.find('.test2').attr('action', '/deletePatient/' + i);
                patTemplate.find('.edit-btn').attr('id', 'pat' + i);
                patTemplate.find('.patient-gender').text("Gender: " + data[i].gender);
                patTemplate.find('.patient-mobile').text("Mobile: " + data[i].mobile);
                patTemplate.find('.patient-email').text("Email: " + data[i].email);
                patTemplate.find('.patient-age').text("Age: " + data[i].age + " years old");

                patientSection.append(patTemplate.html());
                
            }
            }

        }
        });
    }

    loadPatients();

});