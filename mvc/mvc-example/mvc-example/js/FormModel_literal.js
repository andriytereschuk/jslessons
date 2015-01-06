var FormModel = function(){
    var self = this;

    function _constructor() {
        self.startText = 'Some text';
        self.getInputText = getInputText;
        self.setInputText = setInputText;
    }

    var getInputText =  function() {
        return $('#inputtext').val();
    }

    var setInputText = function(value) {
        return $('#inputtext').val(value);
    }

    _constructor();
    return this;
};