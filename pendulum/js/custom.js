$(document).ready(function(){
	// Custom Javascript for the Pendulum Assignment. 
	// 
	// If you are going to alter this file please follow
	// this. 
	//
	//
	// 
	// .. function declarations ..
	// .. class declarations .. 
	// main() declaration
	// main();

	$("#firstAngle").keyup(function(event) {
		alert(event);
	});

	function theta(int inputs){
		// TODO
	}

	function validateInput(){
		var fa = $("#firstAngle").val();
		var sa = $("#secondAngle").val();

		try {
			fa = parseInt(fa) % 360;
			sa = parseInt(sa) % 360;

			alert()

		} catch (err) {
			alert("The angles have to be integers.");
		}
	}

	function main(){
		validateInput();
	}


	main();

});