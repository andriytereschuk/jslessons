var FormController = function(pModel){
 
    var model = pModel || new FormModel();
 
    function add_filled(){
    	$('#out').append('<li>' + model.getInputText() + '</li>');
    }
    
    function fill_clicked(){
        model.setInputText('This is an MVC js');
    }
 
    function clear_clicked(){
        model.setInputText('');
        $('#out').empty();
    }
 
    function init(){
 
        $('#fillbutton').click(function(){
        	if (model.getInputText() == '') {fill_clicked()}
        	else add_filled ()     
        });
        
        $('#clearbutton').click(function(){ clear_clicked(); });
    }
 
    return {
        init: init,
        model : model
    };
};