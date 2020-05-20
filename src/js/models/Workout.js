import uniqid from 'uniqid';

// Total amount of workouts, exercises, and sets allowed
const limit = 29;

export default class Workout {
    constructor(name = "Workout Name") {
        this.id = uniqid(),
        this.name = name,
        this.exercises = [],
        this.exerciseID = 0,
        this.previousExercises = [],
        this.date = new Date()
    }

    setName(workoutName) {
        this.name = workoutName;
        this.saveSession();
    }

    setDate(dateString) {
        const dateArr = dateString.split('-');
        const year = dateArr[0];
        const month = dateArr[1] - 1;
        const day = dateArr[2];
        this.date.setFullYear(year, month, day);
        this.saveSession();
    }

    addExercise(exerciseName) {
        // Prevenet the addition of over 30 exercises
        if (this.exercises.length <= limit) {
            // Check if the previous exercise has already been colected
            let previousExercise = this.getPreviousExercise(exerciseName);
            if (!previousExercise) {
                // If previous exercise has not been collected, find it in history
                const workoutHistory = this.getHistory();
                previousExercise = this.findMostPreviousExercise(workoutHistory, exerciseName);
                if(previousExercise) {
                    // If it was found in history, collect it
                    this.previousExercises.push(previousExercise);
                }
            }

            // Update exercise ID and create exercise object
            this.exerciseID++;
            const exercise = {
                id: this.exerciseID,
                name: exerciseName,
                setList: [],
                setID: 0
            };
            this.exercises.push(exercise);
            this.saveSession();
            return exercise;
        } 
    }

    getExercise(exerciseID) {
        // Find exercise in exercise list using the exercise ID
        return this.exercises.find(exercise => exercise.id === exerciseID);
    }

    removeExercise(exerciseID) {
        this.exercises.forEach((cur, index) => {
            if (exerciseID === cur.id) {
                this.exercises.splice(index, 1);
                this.saveSession();
            }
        });
    }

    cancelWorkout() {
        this.exercises.splice(0, this.exercises.length);
        this.name = "Workout Name";
        this.saveSession();
    }

    addSet(exerciseID, lbs, reps) {
        // Find exercise in exercise list using the exercise ID
        const currentExercise = this.getExercise(exerciseID);
        // Prevent the addition of over 30 sets
        if (currentExercise.setList.length <= limit) {
            // Increment set ID
            currentExercise.setID++;
            // Create set object
            const set = {
                id: currentExercise.setID,
                lbs,
                reps
            }
            // Add set object to exercise set list
            currentExercise.setList.push(set);
            // Save the workout session in session storage
            this.saveSession();
            // Return the amount of sets in exercise list
            return set;
        }
    }

    removeSet(exerciseID, setID) {
        // Find exercise in exercise list using the exercise ID
        const currentExercise = this.getExercise(exerciseID);
        // Find the set in the set list
        currentExercise.setList.forEach((set, index) => {
            if (set.id === setID) {
                // Remove set
                currentExercise.setList.splice(index, 1);
            }
        });
        // Save the workout session in session storage
        this.saveSession();
    }

    copyWorkout(otherWorkout) {
        this.id = otherWorkout.id;
        this.name = otherWorkout.name;
        this.exercises = otherWorkout.exercises;
        this.exerciseID = otherWorkout.exerciseID;
        this.previousExercises = otherWorkout.previousExercises;
        
        // Get correct format to set date
        const dateArr = otherWorkout.date.split('-');
        const day = dateArr[2].split('T', 1);
        const month = dateArr[1] - 1;
        const year = dateArr[0];
        this.date.setFullYear(year, month, day[0]);
    }

    saveSession() {
        sessionStorage.setItem('sessionWorkout', JSON.stringify(this));
    }

    saveWorkout() {
        let workoutList = [];
        if(!localStorage.getItem("workoutHistory")) {
            // If workoutHistory does not exist, create it and save first workout
            workoutList.push(this);
            localStorage.setItem("workoutHistory", JSON.stringify(workoutList));
        } else {
            // If workoutHistory does exist, retrieve it and add workout
            workoutList = JSON.parse(localStorage.getItem("workoutHistory"));
            // If workoutHistory has 30 or more workouts, delete the oldest one
            if (workoutList.length > limit) {
                workoutList.splice(0, 1);
            }
            workoutList.push(this);
            localStorage.setItem("workoutHistory", JSON.stringify(workoutList));
        }
    }

    getHistory() {
        let workoutHistory = [];
        if(localStorage.getItem("workoutHistory")) {
            // If workoutHistory does exist, retrieve it and add workout
            workoutHistory = JSON.parse(localStorage.getItem("workoutHistory"));
        }
        return workoutHistory;
    }

    findMostPreviousExercise(workoutHistory, exerciseName) {
        let latestDate = 0;
        let previousExercise = null;
        workoutHistory.forEach(workout => {
            let date = Date.parse(workout.date);
            workout.exercises.forEach(exercise => {
                if (exercise.name === exerciseName) {
                    if (date > latestDate) {
                        latestDate = date;
                        previousExercise = exercise;
                    }
                }
            })
        })
        return previousExercise;
    }

    getPreviousExercise(exerciseName) {
        return this.previousExercises.find(exercise => exercise.name === exerciseName);
    }

}

