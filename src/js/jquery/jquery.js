import 'jquery';

$(document).ready(function() {

    $('.js-nav-icon').click(function () {
        const nav = $('.js-main-nav');

        nav.slideToggle(200);
    });
    
});