'use strict';

// prettier-ignore

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');


class Workout{
    date = new Date();
    id = (Date.now() + '').slice(-10);
    constructor(coords,distance,duration) {
        this.coords = coords
        this.duration = duration
        this.distance=distance
    }
    _setDescription() {
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this
        .date.getMonth()]} ${this.date.getDate()}`
    }
}
class Running extends Workout{
    type ='running'

    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration)
        this.cadence = cadence
        this.calcPace()
        this._setDescription()
    }
    calcPace() {
        this.pace = this.duration / this.distance
    }
}

class Cycling extends Workout{
    type ='cycling'
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration)
        this.elevationGain = elevationGain
        this.calcSpeed()
        this._setDescription()

    }
    calcSpeed() {
        this.speed=this.distance/(this.duration/60)
    }
}





/////////////////////////////////////////////////////
//Application architecture
class App {
    #map
    #mapEvent
    #workouts = [];
    constructor() {
        this._getPosition();
        //here the this keyword was pointing to the form we wanted app object so
        // we binded it
        form.addEventListener('submit', this._newWorkout.bind(this));

        inputType.addEventListener('change', this._toggleElevationField);

        containerWorkouts.addEventListener('click',this._moveToPopup.bind(this))
    }
        _getPosition(){
            if (navigator.geolocation) {
                //here actually this._loadMap.bind(this) last this is binded because
                // we are not calling the function so we haave to assign this to it bind
                navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
                    console.log("Nahi hua")
                })
            }
        }
        _moveToPopup(e){
            const workoutEl = e.target.closest('.workout');
            if (!workoutEl) return;
            const workout = this.#workouts.find(work => work.id === workoutEl.dataset.id)
            console.log(workout)

            this.#map.setView(workout.coords, 13, {
                animate: true,
                pan: {
                    duration:1
                }
})

                    }
        _loadMap(position) {
            const { latitude } = position.coords
            const { longitude } = position.coords
            console.log(`https://www.google.com/maps/@${latitude},${longitude}`)

            const cords = [latitude, longitude]
            this.#map = L.map('map').setView(cords, 13);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.#map);

            this.#map.on('click', this._showForm.bind(this))
        

        }
    
        _showForm(mapE) {
            this.#mapEvent = mapE
            form.classList.remove('hidden')
            inputDistance.focus()
        }
    _hideForm() {
        inputDistance.value = inputDuration.value = inputElevation.value = inputCadence.value = '';
        form.style.display='none'
        form.classList.add('hidden');
        setTimeout(() => (form.style.display = 'grid'), 1000);
    }
        _toggleElevationField() {
            inputElevation.closest('.form__row')
                .classList.toggle('form__row--hidden');
            inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
        }
    
    _newWorkout(e) {
            e.preventDefault()
        const valid =  (...input) =>
           input.every(inp=>Number.isFinite(inp))
        
        const checkPositive = function (...input) {
            input.every(function (inp) {
                if (inp < 0) return false;
            })
            return true;
        }
      
    
            // get data from form
            const type = inputType.value
            const distance = +inputDistance.value
        const duration = +inputDuration.value
            const { lat, lng } = this.#mapEvent.latlng;
    let workout;
                
            //check data is valid

            //if workout is running create running objectvfeadvfzdsvfdew GRAFq xsAQ 
            if (type == 'running') {
                const cadence = +inputCadence.value
                if (!valid(distance,duration,cadence) && !checkPositive(distance,duration,cadence))
                    return alert("Please insert correct values")
                
                 workout = new Running([lat, lng], distance,duration,cadence); 
}


            //if workout is cycling create cycling object
            if (type == 'cycling') {
                const elevation = +inputElevation.value
                if (!valid(distance,duration,elevation) && !checkPositive(distance,duration,elevation))
                return alert("Please insert correct values")
                workout = new Cycling([lat, lng], distance,duration,elevation); 
            }
            // add new object to workout Array
        this.#workouts.push(workout);
            //render workout on map as marker
        this._renderWorkoutMarker(workout)
            

// render workout on list
this._renderWorkout(workout)



            // clearing input field
        this._hideForm()
        
        
            // display marker
     
        
    }
    _renderWorkoutMarker(workout){
        L.marker(workout.coords).addTo(this.#map)
        .bindPopup(L.popup({
            maxWidth: 300,
            minWidth: 25,
            autoClose: false,
            closeOnClick: false,
            className: `${workout.type}-popup`
                    
        }))
        .setPopupContent(`${workout.type == 'running' ? ' 🏃‍♂️' : ' 🚴🏿‍♂️ '}${workout.description}`)
        .openPopup();
    }
    
    _renderWorkout(workout) {
        console.log(workout,"renderworkout")
        let html = `
        <li class="workout workout--${workout.type}" data-id=${workout.id}>
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${workout.type == 'running' ? ' 🏃‍♂️' : ' 🚴🏿‍♂️ '}</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
        `;
        if (workout.type === 'running') {
            html += `
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li> 
            `
        }
   
        if (workout.type === 'cycling') {
            html += `
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li> 
            `;
        }
        form.insertAdjacentHTML('afterend', html);


    }

}


const app = new App();






