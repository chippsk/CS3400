
		$(document).ready(function(){
			function searchArtist( name ){
			console.log("Searching for "+ name);
			$.ajax({
			  url: "http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=" + name + "&api_key=2a33de328909a28aefd0c197f7668a0f&limit=4&format=json",
			  cache: true
			})
			  .done(function( jsonObj ) {
			  	$("#results").html("");
			    
			    for ( i = 0; i < jsonObj.results.artistmatches.artist.length ; i++){
			    	console.log();
			    	$("#results").html(
			    		$("#results").html() + 
			    		"<div class=\"searchResult\">" + 
			    		"<img src=\"" + jsonObj.results.artistmatches.artist[i].image[2]["#text"] + "\">" +
			    		"<p>"+ jsonObj.results.artistmatches.artist[i].name + "</p>" + 
			    		"</div>"
			    	);
			    }
			  });
			}

			$("#searchArtist").click(function(event) {
				searchArtist($("#searchBox").val());
			});


		});