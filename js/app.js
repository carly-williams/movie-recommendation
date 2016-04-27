$(document).ready( function() {

	var resultMovies = [];
	var inputMovies = [];

	$('.btn-search').click(function(){
		$('.movie-entered').html('');
		$('.movie-results').html('');
		$('.movie-teaser').text('');
		$('.movie-youtube').html('');
		$(".txt-label").css("display", "none");
		var input_movie = $(".input-query").val();
		getRecommendations(input_movie);
	});

	$('.input-query').keydown(function(event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			$('.movie-entered').html('');
			$('.movie-results').html('');
			$('.movie-teaser').text('');
			$('.movie-youtube').html('');
			$(".txt-label").css("display", "none");
			var input_movie = $(".input-query").val();
			getRecommendations(input_movie);
		}
	});

	$('.movie-results').on('click', '.movie-title', function(event){
		var num = $(this).attr("result-num");
		var teaser = resultMovies[num].wTeaser;
		var video = resultMovies[num].yUrl;
		$('.movie-teaser').text(teaser);
		var embeddedVideo = '<iframe title="YouTube video player" class="youtube-player" type="text/html" width="450" height="330" src="' + video + '" frameborder="0" allowFullScreen></iframe>';
		$('.movie-youtube').html(embeddedVideo);
	});

	$('.movie-entered').on('click', '.movie-title', function(event){
		var num = $(this).attr("result-num");
		var teaser = inputMovies[num].wTeaser;
		var video = inputMovies[num].yUrl;
		$('.movie-teaser').text(teaser);
		var embeddedVideo = '<iframe title="YouTube video player" class="youtube-player" type="text/html" width="450" height="330" src="' + video + '" frameborder="0" allowFullScreen></iframe>';
		$('.movie-youtube').html(embeddedVideo);
	});



// this function takes the answerer object returned by the StackOverflow request
// and returns new result to be appended to DOM

	function showInputMovies(info, num) {
		// clone our input-movie template code
		var result = $('.templates .input-movie').clone();

		// Set the movie-title properties in result
		var nameElem = result.find('.movie-title');
		nameElem.text(info.Name);
		nameElem.attr("result-num", num);

		return result;
	}

	function showMovieResults(results, num) {
		// clone our result template code
		var result = $('.templates .result-movie').clone();

		// Set the movie-title properties in result
		var nameElem = result.find('.movie-title');
		nameElem.text(results.Name);
		nameElem.attr("result-num", num);

		return result;
	}

	function getRecommendations(movie_name) {
		// the parameters we need to pass in our request to TasteKid's API
		var request = { 
			q: movie_name,
			type: 'movies',
			k: '220566-Thinkful-Z65T1U0T',
			verbose: 1
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
				if (item.Type === 'unknown') {
					$('.movie-entered').html("<div class=\"no-info\">We're sorry! We don't have any info on '" + item.Name +"'.</div>");
				} 
				else {
					$(".txt-label").css("display", "block");
					inputMovies[i] = {};
					inputMovies[i].Name = item.Name;
					inputMovies[i].wTeaser = item.wTeaser;
					inputMovies[i].yUrl = item.yUrl;
					var movie = showInputMovies(item, i);
					$('.movie-entered').append(movie);
				}
			});
			$.each(result.Similar.Results, function(i, item) {
				resultMovies[i] = {};
				resultMovies[i].Name = item.Name;
				resultMovies[i].wTeaser = item.wTeaser;
				resultMovies[i].yUrl = item.yUrl;
				var movie = showMovieResults(item, i);
				$('.movie-results').append(movie);
			});		
		})
		.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
			console.log("fail");
			// var errorElem = showError(error);
			// $('.search-results').append(errorElem);
		});
	}

});
