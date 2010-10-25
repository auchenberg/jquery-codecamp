	$(document).ready(function() {
		$('button').live('click', onButtonClick);
	});
	
	function onButtonClick() {
	
		$(".content1").barcode("1234567890128", "int25",{barWidth:4, barHeight:100});
		$(".content2").barcode("1234567890128", "int25",{barWidth:4, barHeight:100, output: "svg", color: "#bebebe"});
		$(".content3").barcode("1234567890128", "int25",{barWidth:4, barHeight:100, output: "bmp", color: "#bcbcbc"});
	};
