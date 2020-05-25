import 'jquery';

$(document).ready(function() {

    $('.js-nav-icon').click(function () {
        const nav = $('.js-main-nav');

        nav.slideToggle(200);
    });

    $('.arrow-container').click(function (e) {
        const workoutID = e.currentTarget.parentElement.attributes[1].value;
        const clickedWorkout = $(`[data-id="${workoutID}"]`);
        const exerciseList = clickedWorkout.find('.exercise-list');
        exerciseList.slideToggle(200);
        $('.arrow-container').find('.ion-chevron-down').toggle();
        $('.arrow-container').find('.ion-chevron-up').toggle();
    });
    
});