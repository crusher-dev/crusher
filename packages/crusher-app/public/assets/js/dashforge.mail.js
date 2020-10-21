$(function(){
  'use strict'

  $('[data-toggle="tooltip"]').tooltip()

  new PerfectScrollbar('.mail-sidebar-body', {
    suppressScrollX: true
  });

  new PerfectScrollbar('.mail-group-body', {
    suppressScrollX: true
  });

  new PerfectScrollbar('.mail-content-body', {
    suppressScrollX: true
  });


  // UI INTERACTION
  $('.mail-group-body .media').on('click', function(e){

    // removing previous selected item
    $('.mail-group .selected').removeClass('selected');

    $(this).addClass('selected');
    $(this).removeClass('unread');

    $('.mail-content-header').removeClass('d-none');
    $('.mail-content-body').removeClass('d-none');

    if(window.matchMedia('(max-width: 1199px)').matches) {
      $('body').addClass('mail-content-show');
    }

    if(window.matchMedia('(min-width: 768px)').matches) {
      $('#mailSidebar').removeClass('d-md-none');
      $('#mainMenuOpen').removeClass('d-md-flex');
    }
  })

  // reply form
  var quill = new Quill('#editor-containers', {
    modules: {
      toolbar: '#toolbar-containers'
    },
    placeholder: 'Compose an epic...',
    theme: 'snow'
  });

  // compose form
  var quill2 = new Quill('#editor-container2', {
    modules: {
      toolbar: '#toolbar-container2'
    },
    placeholder: 'Write your message here',
    theme: 'snow'
  });

  $('#mailComposeBtn').on('click', function(){
    $('#mailCompose').addClass('show');
  })

  $('#mailComposeClose').on('click', function(e){
    e.preventDefault()

    if($('#mailCompose').hasClass('minimize') || $('#mailCompose').hasClass('shrink')) {
      $('#mailCompose').addClass('d-none');

      setTimeout(function(){
        $('#mailCompose').attr('class', 'mail-compose');
      },500);

    } else {
      $('#mailCompose').removeClass('show');
    }
  })

  $('#mailComposeShrink').on('click', function(e){
    e.preventDefault()
    $('#mailCompose').toggleClass('shrink')
    $('#mailCompose').removeClass('minimize')
  })

  $('#mailComposeMinimize').on('click', function(e){
    e.preventDefault()
    $('#mailCompose').toggleClass('minimize')
  })


  $('#mailSidebar').on('click touchstart', function(e){
    e.preventDefault()

    if($('body').hasClass('mail-content-show')) {
      $('body').removeClass('mail-content-show');
    } else {
      $('body').addClass('mail-sidebar-show');

      $('#mailSidebar').addClass('d-none');
      $('#mainMenuOpen').removeClass('d-none');
    }

    if(window.matchMedia('(min-width: 768px)').matches) {
      $('#mailSidebar').addClass('d-md-none');
      $('#mainMenuOpen').addClass('d-md-flex');
    }
  })

  $(document).on('click touchstart', function(e){
    e.stopPropagation();

    // closing of sidebar menu when clicking outside of it
    if(!$(e.target).closest('.burger-menu').length) {
      var sb = $(e.target).closest('.mail-sidebar').length;
      if(!sb) {
        $('body').removeClass('mail-sidebar-show');

        $('#mailSidebar').removeClass('d-none');
        $('#mainMenuOpen').addClass('d-none');
      }
    }
  });

  // closing mail content in lg breakpoint only
  $('#mailContentClose').on('click', function(e){
    e.preventDefault()
    $('body').removeClass('mail-content-show');
  })


  // set one mail item as selected in xl breakpoint by default
  // for demo purpose only
  if(window.matchMedia('(min-width: 1200px)').matches) {
    $('.mail-group-body .media:nth-of-type(2)').addClass('selected');

    $('.mail-content-header').removeClass('d-none');
    $('.mail-content-body').removeClass('d-none');
  }

});
