$(document).ready( function() {


	$(".btn-search").click(function(){
		$('.movie-entered').html('');
		var input_movie = $(".input-query").val();
		getRecommendations(input_movie);
	});

	$('.input-query').keydown(function(event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			$('.movie-entered').html('');
			var input_movie = $(".input-query").val();
			getRecommendations(input_movie);
		}
	});



// this function takes the answerer object returned by the StackOverflow request
// and returns new result to be appended to DOM

	function showInputMovies(info) {
		// clone our input-movie template code
		var result = $('.templates .input-movie').clone();

		// Set the movie-title properties in result
		var nameElem = result.find('.movie-title');
		nameElem.text(info.Name);

		return result;
	}

	function showMovieResults(results) {
		// clone our result template code
		var result = $('.templates .result-movie').clone();

		// Set the movie-title properties in result
		var nameElem = result.find('.movie-title');
		nameElem.text(results.Name);

		return result;
	}

	function getRecommendations(movie_name) {
		// the parameters we need to pass in our request to StackOverflow's API
		var request = { 
			q: movie_name,
			type: 'movies',
			k: '220566-Thinkful-Z65T1U0T',
			verbose: 1
			//callback: getData
		};	

		$.ajax({
			url: "https://www.tastekid.com/api/similar",
			data: request,
			dataType: "jsonp",//use jsonp to avoid cross origin issues
			type: "GET"
		})
		.done(function(result){ //this waits for the ajax to return with a succesful promise object
			console.log(result.Similar);
			//$.each is a higher order function. It takes an array and a function as an argument.
			//The function is executed once for each item in the array.
			$.each(result.Similar.Info, function(i, item) {
				var movie = showInputMovies(item);
				$('.movie-entered').append(movie);
			});
			$.each(result.Similar.Results, function(i, item) {
				var movie = showMovieResults(item);
				$('.movie-results').append(movie);
			});			
		})
		.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
			console.log("fail");
			// var errorElem = showError(error);
			// $('.search-results').append(errorElem);
		});

		// function getData(data) {
  //     if (data.ok) {
  //           // do something with the data here
  //           console.log("OK");
  //       } else {
  //           alert(data.error);
  //           console.log("error");
  //     }
		// }

	}

});
