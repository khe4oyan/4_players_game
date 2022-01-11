createStartEl();

let inputs = document.getElementsByTagName('input');
let btn = document.getElementById('start');

for(let i = 0; i < inputs.length; i++){
  inputs[i].onblur = () =>{
    let alertM = document.getElementById('alert');
      let length = inputs[i].value.length;
      if(length < 3){
          inputs[i].classList.add('minSize');
          inputs[i].classList.add('no');
      }else{
          inputs[i].removeAttribute('class');
      }
      let temp = document.getElementsByClassName('no');
      if(temp.length == 0){
          alertM.classList.add('alertHide');
          btn.removeAttribute('disabled');
      }else{
          alertM.removeAttribute('class');
          btn.setAttribute('disabled', '');
      }
  }
}

createAlertMessage();

localStorage.clear();
let names = [];

btn.onclick = () => {
  document.getElementById('alert').remove();
  // get input Names
  let player0 = document.getElementById('player0');
  let player1 = document.getElementById('player1');
  let player2 = document.getElementById('player2');
  let player3 = document.getElementById('player3');

  names.push(player0.value);
  names.push(player1.value);
  names.push(player2.value);
  names.push(player3.value);
  localStorage.setItem(player0.value, 0);
  localStorage.setItem(player1.value, 0);
  localStorage.setItem(player2.value, 0);
  localStorage.setItem(player3.value, 0);

  getFetch();
  addScoreBlock();
};

/*========================
        FUNCTION's
--------------------------*/
function createStartEl(){
  let header = document.createElement('header');
  header.setAttribute('id', 'header');
  header.classList.add('intro');
  let pla = document.createElement('div');
  pla.setAttribute('id', 'players');

  for(let i = 0; i < 4; i++){
    let input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', `player${i}`);
    input.classList.add('no');
    input.setAttribute('placeholder', `Player ${i + 1}`);
    pla.appendChild(input);
  }
  
  let st_button = document.createElement('button');
  st_button.setAttribute('id', 'start');
  st_button.setAttribute('disabled', '');
  st_button.innerHTML = 'Start';
  pla.appendChild(st_button);
  header.appendChild(pla);
  document.body.appendChild(header);
  let main = document.createElement('main');
  main.setAttribute('id', 'main');
  document.body.appendChild(main);
}

function createAlertMessage(){
  let alertM = document.createElement('div');
  alertM.innerHTML = 'Minimum name length 3';
  alertM.setAttribute('id', 'alert');
  alertM.classList.add('alertHide');
  document.body.appendChild(alertM);
}

function addScoreBlock() {
  let header2 = document.getElementById('header');
  header2.innerHTML = ''; //skzvi anunneri blockna jnjum
  header2.classList.remove('intro');
  
  let header = document.getElementById('header');

  let playersInfo = document.createElement('div');
  playersInfo.setAttribute('id', 'playersInfo');

  for(let i= 0; i < 4; i++){
    let p = document.createElement('p');
    let score = localStorage.getItem(names[i]);
    p.innerHTML = `${names[i]}<br>${score}`;
    playersInfo.appendChild(p);
  }
  let select = document.createElement('select');
  select.setAttribute('id', 'sel');
  for(let i= 0; i < 4; i++){
    let option = document.createElement('option');
    option.value = names[i];
    option.innerHTML = names[i];
    select.appendChild(option);
  }
  playersInfo.appendChild(select);

  let input = document.createElement('input');
  input.setAttribute('id', 'score');
  input.setAttribute('type', 'number');
  input.setAttribute('placeholder', 'score');
  playersInfo.appendChild(input);

  let button = document.createElement('button');
  button.setAttribute('id', 'btn');
  button.innerHTML = 'Add Score';
  playersInfo.appendChild(button);

  header.appendChild(playersInfo);

  let btn = document.getElementById('btn');
  btn.onclick = () => add();
}

function add(){
  let name = document.getElementById('sel');
  name = name.value;
  let prevScore = +localStorage.getItem(name);
  let score = document.getElementById('score');
  score = +score.value;
  score += prevScore;
  localStorage.setItem(name, score);
  addScoreBlock();
  getFetch();
}

function getFetch() {
  document.getElementById('main').innerHTML = '';
  fetch('https://jservice.io/api/categories?count=100')
    .then((response) => { return response.json(); })
    .then((data) => {
      createCategoryList(data);
    });
}

function createCategoryList(data) {
  let main = document.getElementsByTagName('main')[0];
  let category = document.createElement('div');
  category.setAttribute('id', 'categories');
  let h2 = document.createElement('h2');
  h2.innerHTML = 'Categories';
  category.appendChild(h2);
  for (let i = 0; i < data.length; i++) {
    let title = data[i].title;
    let id = data[i].id;

    let questBox = document.createElement('div');
    questBox.setAttribute('class', 'quest');

    let p = document.createElement('p');
    p.setAttribute('id', id);
    p.innerHTML = title;
    p.onclick = () => {
      localStorage.setItem('p', p.innerHTML);
      let pId = p.getAttribute('id');
      let cancel = document.createElement('button');
      cancel.classList.add('cancel');
      cancel.innerHTML = 'CANCEL';
      cancel.onclick = () => {
        getFetch();
        cancel.remove();
      }
      playersInfo.appendChild(cancel);
      findCategoryById(pId);
    };

    questBox.appendChild(p);
    category.appendChild(questBox);
  }

  main.appendChild(category);
}


function findCategoryById(categoryId) {
  fetch(`https://jservice.io/api/category?id=${categoryId}`)
    .then((response) => { return response.json(); })
    .then((data) => {
      document.getElementById('categories').remove();
      let main = document.getElementsByTagName('main')[0];

      let h2 = document.createElement('h2');
      let questCategoryName = localStorage.getItem('p');
      h2.innerHTML = `${questCategoryName}`;

      let div = document.createElement('div');
      div.setAttribute('id', 'categories');
      div.appendChild(h2);


      for (let i = 0; i < data.clues.length; i++) {
        let question = data.clues[i].question;
        let answer = data.clues[i].answer;
        let value = data.clues[i].value;

        let questions = document.createElement('div');
        questions.classList.add('questions');

        let p1 = document.createElement('p');
        p1.innerHTML = question;
        p1.classList.add('question');

        let p2 = document.createElement('p');
        p2.innerHTML = answer;
        p2.classList.add('answer');

        let p3 = document.createElement('p');
        p3.innerHTML = value;
        p3.classList.add('value');
        
        p3.onclick = () =>{
          let score = document.getElementById('score');
          score.value = value;
        }

        questions.appendChild(p1);
        questions.appendChild(p2);
        questions.appendChild(p3);
        div.appendChild(questions);

      }
      main.appendChild(div);
    });
}