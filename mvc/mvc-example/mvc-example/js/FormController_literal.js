var FormController = function(){

    var model = new FormModel();
 
    function addFilled(){
    	$('#out').append('<li>' + model.getInputText() + '</li>');
    }
    
    function fillClicked(){
        model.setInputText(model.startText);
    }
 
    function clearClicked(){
        model.setInputText('');
        $('#out').empty();
    }
 
    function init(){
        $('#fillbutton').click(function(){
        	if (model.getInputText() == '') fillClicked();
        	else addFilled();     
        });
        
        $('#clearbutton').click(function(){
            clearClicked();
        });
    }
 
    return {
        init: init
    };
};