import { elements } from './base';
import { exercises } from '../models/ExerciseList';

// Update workout name
export const updateWorkoutName = workoutName => {
    // Update workout name element
    elements.workoutTitle.innerHTML = workoutName;
}
//-------------------------------------------------------------

// Update workout date
export const updateWorkoutDate = date => {
    // Get the necessary date elements
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    // Add a zero to the month and the day if they are less than 10
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    // Create correctly formatted date string
    const dateString = `${year}-${month}-${day}`;

    // Update date picker element
    elements.dateInput.value = dateString;
}
//-------------------------------------------------------------

// Render exercise to UI
export const renderExercise = (newExercise) => {
    const markup = `
        <div class="exercise" data-exerciseid="${newExercise.id}">
            <div class="exercise-header">
                <h3 class="exercise-name">${newExercise.name}</h3>
                <i class="ion-close-circled remove-btn"></i>
            </div>
            <table class="set-container">
                <tr class="set-header">
                    <th>#</th>
                    <th>Previous</th>
                    <th>lbs.</th>
                    <th>Reps</th>
                    <th></th>
                </tr>
                <tr class="set-controls">
                    <td></td>
                    <td class="next-previous-data"></td>
                    <td><input type="text" class="lbs-input" placeholder="lbs."></td>
                    <td><input type="text" class="reps-input" placeholder="Reps"></td>
                    <td><button type="button" class="add-set-btn" data-id="${newExercise.id}">Add</button></td>
                </tr>
            </table>
        </div>
    `
    elements.exerciseContainer.insertAdjacentHTML('beforeend', markup); 
}
//-------------------------------------------------------------

// Remove exercise from UI
export const removeExercise = (exerciseID) => {
    const targetExercise = document.querySelector(`[data-exerciseid="${exerciseID}"]`);
    targetExercise.parentElement.removeChild(targetExercise);
}
//-------------------------------------------------------------

// Remove all exercises from UI
export const removeAllExercises = () => {
    elements.exerciseContainer.innerHTML = '';
    elements.workoutTitle.innerHTML = 'Workout Name';
}
//-------------------------------------------------------------

// Render set to UI
export const renderSet = (exerciseID, set, setNum) => {
    const markup = `
        <tr class="set" data-exerciseid="${exerciseID}" data-setid="${set.id}">
            <td class="set-ID">${setNum}</td>
            <td class="previous-data"></td>
            <td>${set.lbs}</td>
            <td>${set.reps}</td>
            <td class="remove-set-col"><i class="ion-close-circled remove-set-btn"></i></td>
        </tr>
    `;
    // Insert markup into appropriate table based on the add set btn that was clicked
    const exerciseElement = document.querySelector(`[data-exerciseid="${exerciseID}"]`);
    exerciseElement.querySelector('.set-container').insertAdjacentHTML('beforeend', markup);
}
//-------------------------------------------------------------

// Remove set from UI
export const removeSet = (exerciseID, setID) => {
    const targetSet = document.querySelector(`[data-exerciseid="${exerciseID}"]`).querySelector(`[data-setid="${setID}"]`);
    targetSet.parentElement.removeChild(targetSet);
    resetSetNums(exerciseID);
}
//-------------------------------------------------------------

// Resets the set numbers of an exercise
export const resetSetNums = (exerciseID) => {
    const targetExercise = document.querySelector(`[data-exerciseid="${exerciseID}"]`);
    const sets = targetExercise.querySelectorAll('.set');
    sets.forEach((set, index) => {
        set.querySelector('.set-ID').innerHTML = index + 1;
    });
}
//-------------------------------------------------------------

export const setPreviousValues = (exerciseID, prevExercise) => {
    // Get current exercise element
    const exerciseElement = document.querySelector(`[data-exerciseid="${exerciseID}"]`);
    let nextPrev = "None"
    // If a previous exercise exists
    if (prevExercise) {
        // Get the set elements of the current exercise
        const setElements = exerciseElement.querySelectorAll('.previous-data');
        let prev = "";

        let index = 0;
        // If set elements exist
        if (setElements) {
            // While the index is less than both the set elements list and the previous exercise set list
            while (index < setElements.length && index < prevExercise.setList.length) {
                // Transfer the previous set to the current set's previous column
                prev = lbsCrossReps(prevExercise.setList[index].lbs, prevExercise.setList[index].reps);
                setElements[index].innerHTML = prev;
                index++;
            }
            // If previous sets remain to be transfered
            if (prevExercise.setList.length > setElements.length) {
                // Display the next previous set
                nextPrev = lbsCrossReps(prevExercise.setList[index].lbs, prevExercise.setList[index].reps);
            }
        // If there are no set elements
        } else {
            // Display the first previous set as the next one to be transfered
            nextPrev = lbsCrossReps(prevExercise.setList[index].lbs, prevExercise.setList[index].reps);
        }
    }
    exerciseElement.querySelector('.next-previous-data').innerHTML = nextPrev;
}
//-------------------------------------------------------------

const lbsCrossReps = (lbs, reps) => {
    return `${lbs} x ${reps}`;
}
//-------------------------------------------------------------

// Load exercise list into the exercise select box
export const loadExerciseList = (category) => {
    // Clear current options in exercise select box
    resetList(elements.selectExerciseBox);

    // Set options in exercise select box based on selected category
    if (category === 'All') {
        exercises.forEach(exercise => {
            const option = document.createElement("option")
            option.text = exercise.name;
            elements.selectExerciseBox.add(option);
        });
    } else {
        exercises.forEach(exercise => {
            if (category === exercise.category) {
                const option = document.createElement("option")
                option.text = exercise.name;
                elements.selectExerciseBox.add(option);
            }
        });
    }
    // Set the selected option to default option
    elements.selectExerciseBox.options[0].selected = 'selected';
}
//-------------------------------------------------------------

// Clears the options in a select box
const resetList = select => {
    const len = select.length;
    for (let i = 0; i < len; i++) {
        select.remove(1);
    }
}
//-------------------------------------------------------------

// Renders an entire saved workout
export const renderWorkout = savedWorkout => {
    // For each exercise
    savedWorkout.exercises.forEach(exercise => {
        // Get previous exercise info
        const prevExercise = savedWorkout.getPreviousExercise(exercise.name);
        // Render exercise
        renderExercise(exercise);
        // For each set
        exercise.setList.forEach((set, index) => {
            // Render set
            renderSet(exercise.id, set, index + 1);
        });
        setPreviousValues(exercise.id, prevExercise);
    });
}
//-------------------------------------------------------------