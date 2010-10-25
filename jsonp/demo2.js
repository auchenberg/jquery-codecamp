 var auchenberg = function() {
 
    var handlers = {
    
        dataloaded : function(data, status) {

            //debugger
            $('div.loader').remove();
            
            $.each(data, function() { 
                $(document.body).append($('<p>').text(this.text));
            });
                
        }
        
    };
    
    function doTheMagic() {

        $.getJSON('http://twitter.com/statuses/user_timeline/danielovich.json?callback=?', handlers.dataloaded);
    
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



 





