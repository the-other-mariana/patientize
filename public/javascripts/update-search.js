$(document).ready(function() {
    function loadResults(){
        $.ajax({
          async: true,
          url: 'loadSearchResults/',
          type: 'GET',
          dataType: 'json',
          success: (data) => {
            console.log(data);
            $('#searchResultSection').empty();
            var resultSection = $('#searchResultSection');
            for(var i = 0; i < data.length; i++){
                var resultTemplate = $('#searchResultTemplate');
                resultTemplate.find('.card-title').text(data[i].username);
                resultTemplate.find('.info1').text(data[i].email);
                resultTemplate.find('.info2').text(data[i].mobile);

                var f = '/uploads/' + data[i].profilePic;
                resultTemplate.find('.user-img').attr("src", f);
      
                resultSection.append(resultTemplate.html());
            }
          }
        });
    }
    loadResults();
});