function loadTemplates(){
    $.ajax({
    async: true,
    url: 'templatesInfo/',
    type: 'GET',
    dataType: 'json',
    success: (templates) => {
        console.log(templates);

        // if there are templates
        if ((templates.length > 0) ){
        $('#templatesSection').empty();

        for(var i = 0; i < templates.length; i++){
            keys = Object.keys(templates[i]);
            var templateStr = '<div id="templateTemplate">'+
                                    '<div class="card text-left" style="margin-top: 20px; border-color:' + templates[i].tcolor + ';">'+
                                        '<div class="card-header text-white" style="background-color:' + templates[i].tcolor + ';">' + templates[i].ttitle +'</div>'+
                                        '<div class="card-body">' +
                                            '<form action="/patientDetails" method="get" class="test">'+
                                            '<div class="form-group row">';
            
            for (var k = 2; k < keys.length; k++){
                var fieldtext = keys[k].split('_').join(' ');
                var fieldtype = templates[i][keys[k]];
                templateStr += '<label for = "'+ keys[k] + '" style = "display: block;" class="col-sm-4 col-form-label col-form-label-lg">' + fieldtext + '</label>';
                templateStr += '<div class="col-sm-8">';
                templateStr += '<input type = "text" class="form-control" id = "'+ keys[k] + '" name = "'+ keys[k] + '" value="'+ fieldtype +'" disabled style="border-color: '+ templates[i].tcolor +'"></input>';
                templateStr += '</div>';
            }
            //templateStr +=  '<button type="submit" class="btn btn-primary">Details</button>'+
            templateStr += '</div>'+'<button type="button" class="btn btn-danger" style="float: right;">Delete</button>'+
                        '</form>'+ 
                    '</div>'+
                '</div>'+
            '</div>';
            document.getElementById("templatesSection").insertAdjacentHTML('beforeend', templateStr);
        }
        }

    }
    });
}

loadTemplates();