import Workout from './models/Workout';
import * as workoutView from './views/workoutView';
import * as modal from './views/modal';
import { elements } from './views/base';
import './jquery/jquery';

// Initialize state
const state = { modalFlag: false};

/***************************************/
/* PAGE LOAD CONTROLLER */ 
/***************************************/

// Load session workout
window.addEventListener('load', () => {    
    // If session storage has no workout, create a new workout
    if (sessionStorage.length === 0) {
        state.workout = new Workout();
        sessionStorage.setItem('sessionWorkout', JSON.stringify(state.workout));
        // Update date in UI
        workoutView.updateWorkoutDate(state.workout.date);
    // Else get workout from session storage
    } else {
        // Objects from session storage lose their methods
        const sessionWorkout = JSON.parse(sessionStorage.getItem('sessionWorkout'));
        // Create workout object to get methods
        state.workout = new Workout();
        // Copy workout from session storage to new workout object
        state.workout.copyWorkout(sessionWorkout);

        // Update UI
        workoutView.updateWorkoutName(state.workout.name);
        workoutView.updateWorkoutDate(state.workout.date);
        workoutView.renderWorkout(state.workout);
    }
});
//-------------------------------------------------------------

// Load exercise list into select box
window.addEventListener('load', () => {  
    workoutView.loadExerciseList(elements.categoryBox.value);
});
//-------------------------------------------------------------




/***************************************/
/* WORKOUT CONTROLLER */ 
/***************************************/

// Switch out workout name for an input textbox
elements.workoutNameBox.addEventListener('click', () => {
    // Hide workout title
    elements.workoutTitle.style.display = 'none';
    // Show workout name input
    elements.workoutNameInput.style.display = 'inline-block' 
});
//-------------------------------------------------------------

window.addEventListener('click', (e) => {
    // Get workout name input value
    const workoutInput = elements.workoutNameInput.value;
    // If workout name input is displayed and
    // if the click event was NOT on the workout name input and
    // if the click event was NOT on the workout title and
    // if the workout name input has text
    if (elements.workoutNameInput.style.display === 'inline-block' &&
        !e.target.matches('.workout-name-input') &&
        !e.target.matches('.workout-title')) {
            if (workoutInput.length > 0) {
                 // Update Workout Object
                state.workout.setName(workoutInput);

                // Update UI
                workoutView.updateWorkoutName(workoutInput);
            }
            // Show workout title
            elements.workoutTitle.style.display = 'inline-block';
            // Hide workout name input
            elements.workoutNameInput.style.display = 'none';
        }
});
//-------------------------------------------------------------

// Use input name in textbox to replace workout name header
elements.workoutNameInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        // Get workout name input value
        const workoutInput = elements.workoutNameInput.value;
        // If workout name input has text
        if (workoutInput.length > 0) {
            // Update Workout Object
            state.workout.setName(workoutInput);

            // Update UI
            workoutView.updateWorkoutName(workoutInput);
            // Show workout title
            elements.workoutTitle.style.display = 'inline-block';
            // Hide workout name input
            elements.workoutNameInput.style.display = 'none';
        }
    } 
});
//-------------------------------------------------------------

// Change date using date picker
elements.dateInput.addEventListener('change', e => {
    // Change date in workout object
    state.workout.setDate(e.target.value);
});
//-------------------------------------------------------------

// Cancel workout
elements.cancelBtn.addEventListener('click', () => {
    if (state.workout.exercises.length > 0) {
        modal.confirm("Canceling this workout will permanently remove all exercises, do you wish to continue?", 'cancel-wrkout');
        // Further actions are taken by the modal controller
    }
});

// Complete workout
elements.completeBtn.addEventListener('click', () => {
    if (state.workout.exercises.length > 0) {
        modal.confirm("Are you sure you want to complete this workout?", 'complete-wrkout');
        // Further actions are taken by the modal controller
    }
});


/***************************************/
/* EXERCISE CONTROLLER */ 
/***************************************/

// Change contents of exercise select box when category select box changes
elements.categoryBox.addEventListener('change', e => {
    workoutView.loadExerciseList(e.target.value);
});
//-------------------------------------------------------------

// Add selected exercise to the workout
elements.addExerciseBtn.addEventListener('click', () => {
    
    // Get exercise name from exercies select box
    const exerciseName = document.querySelector('.select-exercise').value;

    // Check that user selected an exercise
    if (exerciseName !== 'Exercise') {
        // Add exercise to the workout object
        const newExercise = state.workout.addExercise(exerciseName);
        const prevExercise = state.workout.getPreviousExercise(exerciseName);

        // If exercise list is under limit
        if (newExercise) {
            // Add exercise to the UI
            workoutView.renderExercise(newExercise);
            workoutView.setPreviousValues(newExercise.id, prevExercise);
        }
    } else {
        modal.alert('Please select an exercise!');
    }
});
//-------------------------------------------------------------

// Add created exercise to the workout
elements.createExerciseBtn.addEventListener('click', () => {
    modal.prompt("Please enter an exercise name:");
    // Further actions are taken by the modal controller
});
//-------------------------------------------------------------

// Remove exercise from the workout
elements.exerciseContainer.addEventListener('click', e => {

    // Check if event was a click on the remove exercise button
    if (e.target.matches('.remove-btn')) {
        // Get exercise ID from the target exercise
        const exerciseID = parseInt(e.target.parentElement.parentElement.dataset.exerciseid, 10);
        
        // Remove exercise from workout object
        state.workout.removeExercise(exerciseID);

        // Remove exercise from the UI
        workoutView.removeExercise(exerciseID);
    }
});


//-------------------------------------------------------------

// Add set to the exercise
elements.exerciseContainer.addEventListener('click', e => {

    // Check if event was a click on the add set button
    if (e.target.matches('.add-set-btn')) {

        // Find parent element of input textboxes
        const textboxParent = e.target.parentElement.parentElement;

        // Collect input value from textboxes in current exercise
        const lbsInput = parseInt(textboxParent.querySelector('.lbs-input').value, 10);
        const repsInput = parseInt(textboxParent.querySelector('.reps-input').value, 10);
        
        // Check if textboxes have valid number inputs
        if (!(isNaN(lbsInput) || isNaN(repsInput))) {
            // Check that numbers are less than 10000
            if (lbsInput < 10000 && repsInput < 10000) {
                // Get exercise ID from UI
                const exerciseID = parseInt(e.target.dataset.id, 10);
                
                // Get exercise from workout object
                const currentExercise = state.workout.getExercise(exerciseID);
                // Get previous exercise from workout object
                const prevExercise = state.workout.getPreviousExercise(currentExercise.name);
            
                // Add set to the exercise in the workout object and return set object
                const newSet = state.workout.addSet(exerciseID, lbsInput, repsInput);

                // If set list is under limit
                if (newSet) {
                    // Render set in UI
                    workoutView.renderSet(exerciseID, newSet, currentExercise.setList.length);
                    workoutView.setPreviousValues(exerciseID, prevExercise);
                }
            }
        }
    }
});
//-------------------------------------------------------------

// Remove set from the exercise
elements.exerciseContainer.addEventListener('click', e => {
    // Check if event was a click on the remove set button
    if (e.target.matches('.remove-set-btn')) {
        // Get table row parent element of the remove set button and get ID's
        const tableRow = e.target.parentElement.parentElement;
        const exerciseID = parseInt(tableRow.dataset.exerciseid, 10);
        const setID = parseInt(tableRow.dataset.setid, 10);

        // Get exercise from workout object
        const currentExercise = state.workout.getExercise(exerciseID);
        // Get previous exercise from workout object
        const prevExercise = state.workout.getPreviousExercise(currentExercise.name);

        // Remove set from the exercise in the workout object
        state.workout.removeSet(exerciseID, setID);

        // Remove set from UI
        workoutView.removeSet(exerciseID, setID);
        workoutView.setPreviousValues(exerciseID, prevExercise);
    }
});
//-----------------------------------------------------


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

    // If a cancel or OK button was clicked
    } else if (click.matches('.modal-btn')) {
        currentModal = click.parentElement.parentElement.parentElement;
        modalContainer = currentModal.parentElement;
        // Remove modal
        modalContainer.removeChild(currentModal);

    // If create exercise button was clicked
    } else if (click.matches('.modal-input-btn')) {
        const exerciseName = click.parentElement.parentElement.querySelector('.modal-input').value;
        currentModal = click.parentElement.parentElement.parentElement;
        modalContainer = currentModal.parentElement;
        // If exercise name is not null or empty
        if (exerciseName !== null && exerciseName !== "") {
            // If exercise name contains only letters
            if(/^[a-zA-Z- ]+$/.test(exerciseName)) {
                // Remove modal
                modalContainer.removeChild(currentModal);

                // Add exercise to workout object
                const newExercise = state.workout.addExercise(exerciseName);
                const prevExercise = state.workout.getPreviousExercise(exerciseName);
                
                // If exercise list is under limit
                if (newExercise) {
                    // Render exercise to the UI
                    workoutView.renderExercise(newExercise);
                    workoutView.setPreviousValues(newExercise.id, prevExercise);
                }
            } else {
                modal.alert("Exercise name can NOT contain numbers or special characters!");
            }
        }

    // If Complete Workout button was clicked
    } else if (click.matches('.modal-complete-wrkout-btn')) {
        currentModal = click.parentElement.parentElement.parentElement;
        modalContainer = currentModal.parentElement;
        // Remove modal
        modalContainer.removeChild(currentModal);

        // Save workout in local storage
        state.workout.saveWorkout();

        // Remove all exercises from workout object and reset workout name
        state.workout = new Workout();
        state.workout.saveSession();

        // Update the UI
        workoutView.removeAllExercises();
    

    // If Cancel Workout button was clicked
    } else if (click.matches('.modal-cancel-wrkout-btn')) {
        currentModal = click.parentElement.parentElement.parentElement;
        modalContainer = currentModal.parentElement;
        // Remove modal
        modalContainer.removeChild(currentModal);

        // Remove all exercises from workout object
        state.workout.cancelWorkout();

        // Update the UI
        workoutView.removeAllExercises();
    }
});