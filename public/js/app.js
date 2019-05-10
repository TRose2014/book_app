$('.view-book').on('click', function(event){
  event.preventDefault();

  let className = $(event.target).siblings('form').attr('class');

  if(event.target.className.includes('view-book')){
    if(className.includes('hide-me')){
      $(event.target).siblings('form').removeClass('hide-me');
    }else{
      $(event.target).siblings('form').addClass('hide-me');
    }
  }
});


