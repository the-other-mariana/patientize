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

        }
        });
    }

    loadDetails();

});