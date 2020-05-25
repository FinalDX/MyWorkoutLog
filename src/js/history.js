import History from './models/History';
import * as historyView from './views/historyView';
import * as modal from './views/modal';
import { elements } from './views/base';
import './jquery/jquery';

const state = {};


/***************************************/
/* PAGE LOAD CONTROLLER */ 
/***************************************/


// Needs fixing, history does not display message when history is cleared
window.addEventListener('load', () => {
    // Get workout history
    state.history = new History();
    // If there exists at least one workout
    if (state.history.workouts.length > 0) {
        // Hide message and show page
        historyView.toggleMessage();
        // Render workout history to UI
        historyView.renderHistory(state.history.workouts);  
    }
});
//-------------------------------------------------------------


/***************************************/
/* HISTORY CONTROLLER */ 
/***************************************/

// Clear history
elements.clrHistoryBtn.addEventListener('click', () => {
    modal.confirm("This will permanently delete ALL workouts from your history, are you sure you want to continue?", 'clear-history');
    // Further actions are taken by the modal controller
});
//-------------------------------------------------------------

// Remove summary
elements.page.addEventListener('click', e => {
    if (e.target.matches('.remove-btn')) {
        if (window.confirm("This will permanently delete this workout from your history, are you sure you wont to continue?")) {  
            // Get workout ID
            const workoutID = e.target.parentElement.parentElement.dataset.id;

            // Remove workout from workout List
            state.history.removeWorkout(workoutID);

            // Remove workout from UI
            historyView.removeSummary(workoutID);

            // If removed workout was the last workout on the page
            if (state.history.workouts.length < 1) {
                // Hide page and show message
                historyView.toggleMessage();
            }
        }
    }
});

/***************************************/
/* MODAL CONTROLLER */ 
/***************************************/

elements.modalContainer.addEventListener('click', e => {
    const click = e.target;
    let currentModal = null;
    let modalContainer = null;

    // If the outside area of a modal box was clicked
    if (click.matches('.modal')) {
        currentModal = click;
        modalContainer = currentModal.parentElement;
        // Remove modal
        modalContainer.removeChild(currentModal);

    // If a No or OK button was clicked
    } else if (click.matches('.modal-btn')) {
        currentModal = click.parentElement.parentElement.parentElement;
        modalContainer = currentModal.parentElement;
        // Remove modal
        modalContainer.removeChild(currentModal);

    // If clear history button was clicked
    }else if (e.target.matches('.modal-clear-history-btn')) {
        currentModal = click.parentElement.parentElement.parentElement;
        modalContainer = currentModal.parentElement;
        // Remove modal
        modalContainer.removeChild(currentModal);
        // Clear history object
        state.history.clearHistory();
        // Clear history from UI
        historyView.removeHistory();
    
    // If remove summary button was clicked
    }
});