import History from './models/History';
import * as historyView from './views/historyView';
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
        // Dispaly message or display page
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
    if (window.confirm("This will permanently delete ALL workouts from your history, do you wish to continue?")) {
        state.history.clearHistory();
        // Page reload updates the UI
    }
});
//-------------------------------------------------------------

// Remove summary
elements.page.addEventListener('click', e => {
    if (e.target.matches('.remove-btn')) {
        if (window.confirm("This will permanently delete this workout from your history, do you wish to continue?")) {  
            // Get workout ID
            const workoutID = e.target.parentElement.parentElement.dataset.id;

            // Remove workout from workout List
            state.history.removeWorkout(workoutID);

            // Remove workout from UI
            historyView.removeSummary(workoutID);
        }
    }
})