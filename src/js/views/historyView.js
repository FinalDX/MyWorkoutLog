import { elements } from './base';

// Render workout history to the UI
export const renderHistory = workoutList => {

    // For each workout render summary
    workoutList.forEach(workout => {

        // Render summary container
        renderSummary(workout);

        // Get the workout element
        let workoutEl = document.querySelector(`[data-id="${workout.id}"]`);
        // Get the exercise list element
        let exerciseListEl = workoutEl.querySelector('.exercise-list');
        
        // For each workout render exercises
        workout.exercises.forEach(exercise => {
            // Find previous exercise
            let prevExercise = workout.previousExercises.find(cur => cur.name === exercise.name);
            
            // Render exercise into exercise list element
            renderExercise(exerciseListEl, exercise);

            // Get the set table element
            let setTableEl = workoutEl.querySelector(`[data-exerciseid="${exercise.id}"]`);
            
            // For each exercise render sets
            exercise.setList.forEach((set, index) => {
                let prevSet = null;
                if(prevExercise) {
                    if (index < prevExercise.setList.length) {
                        prevSet = prevExercise.setList[index];
                    }
                }
                // Render set into set table element
                renderSet(setTableEl, set, prevSet);
            });
        });
    });
}
//-------------------------------------------------------------

const renderSummary = workout => {
    const markup = `
        <div class="workout-summary" data-id="${workout.id}">
            <div class="workout-header">
                <h3>${workout.name}</h3>
                <i class="ion-close-circled remove-btn"></i>
            </div>
            <div class="date">
                ${getDateString(workout)}
            </div>
            <ul class="exercise-list">
            </ul>
            <div class="arrow-container">
                <i class="ion-chevron-down"></i>
                <i class="ion-chevron-up"></i>
            </div>
        </div>
    `;
    elements.page.insertAdjacentHTML('beforeend', markup);
}
//-------------------------------------------------------------

const renderExercise = (exerciseListEl, exercise) => {
    const markup = `
        <li>
            <h4 class="exercise-name">${exercise.name}</h4>
            <table class="set-table" data-exerciseid="${exercise.id}">
                <tr>
                    <th>#</th>
                    <th>Previous</th>
                    <th>Current</th>
                    <th>Lbs. diff.</th>
                    <th>Reps diff.</th>
                    <th>% of change</th>
                </tr>
            </table>        
        </li>        
    `;
    exerciseListEl.insertAdjacentHTML('beforeend', markup);
}
//-------------------------------------------------------------

const renderSet = (setTableEl, set, prevSet) => {
    // Default values for if previous set does not exist
    let prevString = "--------";
    let lbsDiff = "----";
    let repsDiff = "----";
    let percent = "--------";
    let lbsStatus = "";
    let repsStatus = "";
    let percStatus = "";

    // If previous set exists
    if (prevSet) {
        prevString = `${prevSet.lbs} x ${prevSet.reps}`;

        // Calculate difference in lbs and style output
        lbsDiff = set.lbs - prevSet.lbs;
        if (lbsDiff > 0) {
            lbsStatus = "positive";
            lbsDiff = `+${lbsDiff}`;
        } else if (lbsDiff < 0) {
            lbsStatus = "negative";
        }
        // Calculate difference in reps and style output
        repsDiff = set.reps - prevSet.reps;
        if (repsDiff > 0) {
            repsStatus = "positive";
            repsDiff = `${repsDiff}`;
        } else if (repsDiff < 0) {
            repsStatus = "negative";
        }
        // Calculate percent of change in (lbs x reps) and style output
        const perChange = percentOfChange((set.lbs * set.reps), (prevSet.lbs * prevSet.reps));
        if (perChange) {
            if (perChange > 0) {
                percStatus = "positive";
                percent = `+${perChange.toFixed(1)}%`;
            } else if (perChange < 0) {
                percStatus = "negative";
                percent = `${perChange.toFixed(1)}%`;
            } else {
                percent = `${perChange.toFixed(1)}%`;
            }
        }  
    }
    
    const markup = `
        <tr>
            <td>${set.id}</td>
            <td>${prevString}</td>
            <td>${set.lbs} x ${set.reps}</td>
            <td class="${lbsStatus}">${lbsDiff}</td>
            <td class="${repsStatus}">${repsDiff}</td>
            <td class="${percStatus}">${percent}</td>
        </tr>
    `;
    setTableEl.insertAdjacentHTML('beforeend', markup);
}
//-------------------------------------------------------------

const percentOfChange = (newValue, oldValue) => {
    let result = null;
    if (oldValue > 0) {
        result = (((newValue - oldValue) / oldValue) * 100);
    }
    return result;
}
//-------------------------------------------------------------

export const removeHistory = () => {
    elements.page.innerHTML = "";
    toggleMessage();
}
//-------------------------------------------------------------

export const removeSummary = workoutID => {
    const targetWorkout = document.querySelector(`[data-id="${workoutID}"]`);
    targetWorkout.parentElement.removeChild(targetWorkout);
    if (!document.querySelector('.workout-summary')) {
        toggleMessage();
    }
}
//-------------------------------------------------------------

export const toggleMessage = () => {
    if (getComputedStyle(elements.message).display === 'block') {
        elements.message.style.display = 'none';
        elements.page.style.display = 'block';
        elements.clrHistory.style.display = 'block';
    } else if (getComputedStyle(elements.message).display === 'none') {
        elements.message.style.display = 'block';
        elements.page.style.display = 'none';
        elements.clrHistory.style.display = 'none';
    }
}

//-------------------------------------------------------------
const getDateString = workout =>{
    const dateArr = workout.date.split('-');
    let day = dateArr[2].split('T', 1);
    let month = dateArr[1];
    const year = dateArr[0];
    
    return `${month}/${day}/${year}`;
}