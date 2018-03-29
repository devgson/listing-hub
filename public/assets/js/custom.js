$('.rating-opt').start(function(cur){
  $('#ratingVal').attr('value', cur)
	//$('#info').text(cur);
});

/*$('#review').submit(function(event){
  const rating = $('.jr-rating')
  $('<input/>').attr('type','hidden')
    .attr('name',"rating")
    .attr('value', "5")
    .appendTo('#review');
  return true;
});*/