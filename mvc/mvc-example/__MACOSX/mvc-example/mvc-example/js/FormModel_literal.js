var FormModel = function(){
 
    function getInputText(){
       return $('#inputtext').val();
    }
 
    function setInputText(value){
       $('#inputtext').val(value);
    }
 
    return {
        getInputText : getInputText,
        setInputText : setInputText
    }
};