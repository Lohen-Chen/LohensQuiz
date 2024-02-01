var useranswers = [];
let answers = [];
let correct = 0, wrong = 0;
var answer;
let count = 1;
let question = document.getElementById("question");
let options = document.getElementsByName("option");
let option = document.getElementsByName("optioni");
let nextBtn = document.getElementById("submit");
let message = document.getElementById("message");
let resetBtn = document.getElementById('resetBtn');
var tempqa = new Array();
const startBtn = document.getElementById("start");
let username;

nextBtn.addEventListener("click", next);
resetBtn.addEventListener('click', reset);
startBtn.addEventListener("click", begin);

const qa = [
  ["What is avogadro's number", 
   "6.022 x 10^23", 
   "2.71828", 
   "8", 
   "3.14159"
  ],
  ["What is the unit of measurement for an ionic compound",
   "Formula Unit",
   "Molecule",
   "Particle",
   "Mole"
  ],
  [
    "What are the 3 main states of matter",
    "Solid, liquid, gas",
    "Fluid, volume, matter",
    "Particle, formula unit, molecule",
    "Solid, Semiconductor, Wire"
  ],
  [
    "Which of the following is a qualitative quality",
   "Saturation",
    "PPM",
    "Molarity",
    "Parts Per Billion"
  ],
  [
    "When writing Keq expressions, what phases do you NOT include?",
    "Solids and liquids",
    "Gases",
    "Aqueous solutions",
    "Gases and Aqueous solutions"
  ],
  [
    "What do square brackets indicate, for example [X]",
    "Molarity/Concentration",
    "Which direction the reaction favors",
    "State of matter",
    "Equilibrium"
  ]
  ];

var startd;
var timerInterval;
let time = 0;

function begin(){
  startd = new Date();
  timerInterval = setInterval(myTimer, 1000);
  document.getElementById("container-begin").style.display = "none";
  document.getElementById("container2").style.display = "block";
  if(document.getElementById("username").value == ""){
    username = "Anonymous";
  } else {
    username = document.getElementById("username").value;
  }
  console.log(username); //starts timer and submits username
}

function myTimer() {
  let currentd = new Date();
  time = currentd.getTime() - startd.getTime();
  document.getElementById("timer").innerHTML = Math.floor(time/1000);
} //boilerplate timer code

start();
function start() {
  resetBtn.style.display = "none";
  nextBtn.style.display = "block";
  tempqa = JSON.parse(JSON.stringify(qa)); //took me hours to fix
  shuffleArray(tempqa);
  for(let i = 0; i < tempqa.length; i++){
    shuffleArray2d(tempqa, i);
  }
  for(let i = 0; i < qa.length; i++){
    for(let j = 0; j < qa.length; j++){
      if(qa[j][0] == tempqa[i][0]){
        answers.push(qa[j][1]);
      } //answers array
    }
  }
  console.log(tempqa);
  console.log(answers);
  populate(0);
}

function next() {
  if (count == tempqa.length - 1) {
    nextBtn.innerHTML = "Submit";
  }
  let checked = false;
  for (let i = 0; i < option.length; i++) {
    if (option[i].checked) {
      checked = true;
      useranswers.push(options[i].innerHTML);
    }
  } //checks if selected
  if (checked == false) {
    message.innerHTML = "Please select an option";
  } else {
    if (count == tempqa.length) {
      submit();
    } else {
      message.innerHTML = "";
      populate(count);
      count += 1;
    }
    for (let i = 0; i < option.length; i++) {
      option[i].checked = false;
    }
  }
}

function populate(n) {
  question.innerHTML = tempqa[n][0];
  for (let i = 0; i < 4; i++) {
    options[i].innerHTML = tempqa[n][i + 1];
    options[i].value = tempqa[n][i + 1];
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 1; i--) {
    let rand = Math.floor(Math.random() * i);
    let temp = array[i];
    array[i] = array[rand];
    array[rand] = temp;
  }
}

function shuffleArray2d(array, n) { // Fischer Yates sort
  for (let i = array[n].length - 1; i > 1; i--) {
    let rand = Math.floor(Math.random() * i) + 1;
    let temp = array[n][i];
    array[n][i] = array[n][rand];
    array[n][rand] = temp;
  }
}

function submit() { // Fischer Yates sort
  console.log("answers: " + answers);
  console.log("your answers: " + useranswers);
  for (let i = 0; i < useranswers.length; i++) {
    if (useranswers[i] == answers[i]) {
      correct += 1;
    } else {
      wrong += 1;
    }
  }
  message.innerHTML = "you got: " + correct + " correct and " + wrong + " wrong";

  resetBtn.style.display = "block";
  nextBtn.style.display = "none";
  clearInterval(timerInterval);
  console.log(time / 1000);

  // Check if the user got 100% correct
  if (correct == tempqa.length) {
    // Call postScores() with the correct username and time
    postScores(username, time / 1000)
      .then((response) => {
        console.log("Score posted successfully:", response);
      })
      .catch((error) => {
        console.error("Error posting score:", error);
      });
  }
}


function reset() {
  useranswers = []; //literally just resets everything
  answers = [];
  count = 1;
  correct = 0;
  wrong = 0;
  tempqa = [];
  nextBtn.innerHTML = "Next";
  message.innerHTML = "";
  resetBtn.style.display = "none";
  nextBtn.style.display = "block";
  document.getElementById("container-begin").style.display = "block";
  document.getElementById("container2").style.display = "none";
  document.getElementById("timer").innerHTML = 0;
  start();
}

async function postScores(username, time) {
  const response = await fetch(`https://lohensquizapi.lohenchen.repl.co/postscore/${username}/${time}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, time }),
  });
  return response.json(); // Optionally, you can parse the response JSON
}

