$('.book-item').on('click', 'button', function(event){
  console.log('Hey');
  event.preventDefault();
  $('.book-view').addClass('hide-me');
  $('.book-form-view').removeClass('hide-me');
});


