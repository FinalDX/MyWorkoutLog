export default class History {
    constructor() {
        this.workouts = JSON.parse(localStorage.getItem('workoutHistory'));
    }

    removeWorkout(workoutID) {
        this.workouts.forEach((cur, index) => {
            if (cur.id === workoutID) {
                this.workouts.splice(index, 1);
            }
        });
        this.saveHistory();
    }

    clearHistory() {
        this.workouts = [];
        this.saveHistory();
    }

    saveHistory() {
        localStorage.setItem('workoutHistory', JSON.stringify(this.workouts));
    }
}