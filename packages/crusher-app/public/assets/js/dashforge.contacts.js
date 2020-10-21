$(function(){

  'use strict'

  $('[data-toggle="tooltip"]').tooltip();

  // set active contact from list to show in desktop view by default
  if(window.matchMedia('(min-width: 992px)').matches) {
    $('.contact-list .media:first-of-type').addClass('active');
  }


  const contactSidebar = new PerfectScrollbar('.contact-sidebar-body', {
    suppressScrollX: true
  });

  new PerfectScrollbar('.contact-content-body', {
    suppressScrollX: true
  });

  new PerfectScrollbar('.contact-content-sidebar', {
    suppressScrollX: true
  });

  $('.contact-navleft .nav-link').on('shown.bs.tab', function(e) {
    contactSidebar.update()
  })

  // UI INTERACTION
  $('.contact-list .media').on('click', function(e) {
    e.preventDefault();

    $('.contact-list .media').removeClass('active');
    $(this).addClass('active');

    var cName = $(this).find('h6').text();
    $('#contactName').text(cName);

    var cAvatar = $(this).find('.avatar').clone();

    cAvatar.removeClass (function (index, className) {
      return (className.match (/(^|\s)avatar-\S+/g) || []).join(' ');
    });
    cAvatar.addClass('avatar-xl');

    $('#contactAvatar .avatar').replaceWith(cAvatar);


    // showing contact information when clicking one of the list
    // for mobile interaction only
    if(window.matchMedia('(max-width: 991px)').matches) {
      $('body').addClass('contact-content-show');
      $('body').removeClass('contact-content-visible');

      $('#mainMenuOpen').addClass('d-none');
      $('#contactContentHide').removeClass('d-none');
    }
  })


  // going back to contact list
  // for mobile interaction only
  $('#contactContentHide').on('click touch', function(e){
    e.preventDefault();

    $('body').removeClass('contact-content-show contact-options-show');
    $('body').addClass('contact-content-visible');

    $('#mainMenuOpen').removeClass('d-none');
    $(this).addClass('d-none');
  });

  $('#contactOptions').on('click', function(e){
    e.preventDefault();
    $('body').toggleClass('contact-options-show');
  })

  $(window).resize(function(){
    $('body').removeClass('contact-options-show');
  })

})
