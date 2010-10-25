 var auchenberg = function() {
 
    var handlers = {
    
        dataloaded : function(data, status) {

            //debugger
            $.each(data, function() { 
                $(document.body).append($('<p>').text(this.text));
            });
                
        }
        
    };
    
    function doTheMagic() {

        $.getJSON('http://twitter.com/statuses/user_timeline/danielovich.json', handlers.dataloaded);
    
    };
    
	return {
		initialise : function() {
			doTheMagic();
		}
	};
	
}();


$(document).ready(function () {
            
    auchenberg.initialise();

});



 





