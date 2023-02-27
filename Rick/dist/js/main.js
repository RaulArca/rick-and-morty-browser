const gridContent= document.getElementsByClassName("grid-content").item(0)
const searchInput = document.getElementById("CharacterBrowser");
const selectState = document.getElementById("stateSelect");
const selectGender = document.getElementById("genderSelect");
let next= ""
let pages=0
let page =1
let url ="https://rickandmortyapi.com/api/character/"
const basicUrl="https://rickandmortyapi.com/api/character/"
init()
function debounce(func, wait = 500) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
function init(){
  fetch(url)
    .then((response) => response.json())
    .then((data) =>{
        gridContent.innerHTML=""
        next = data['info']['next']
        pages = data['info']['pages']
        data['results'].map(function (character){
          characterBox(character)
        })
      }
    );

}

function nextCharacter(){
  if(next!=""&& page<pages){
    fetch(next)
      .then((response) => response.json())
      .then((data) =>{
          next = data['info']['next']
          pages = data['info']['pages']
          data['results'].map(function (character){
            characterBox(character)
          })
        }
      );
    page++;
  }
}


const processChange = debounce((value) =>{
    let characterUrl
    if(url == basicUrl)
      characterUrl = url +"?name="+ value;
    else  characterUrl = url + "&&name="+ value;
    console.log(characterUrl)
    fetch(characterUrl)
      .then((response) => response.json())
      .then((data) =>{
          page =0
          gridContent.innerHTML=""
          next = data['info']['next']
          pages = data['info']['pages']
          data['results'].map(function (character){
            characterBox(character)
          })
        }
      );
  }


);

function characterBox(character){
  console.log(character)
  const newCharacter = document.createElement('article');
  newCharacter.className = "box";
  const image=document.createElement('img')
  image.src = character['image' ]
  image.className = "";
  const name = document.createElement('a')
  name.className = "";
  name.text=character['name' ]

  const state = document.createElement('a')
  state.className= "state"

  state.text=character['status' ]
  switch (state.text) {
    case 'Alive':
      state.style="background-color: green"
      break
    case 'unknown':
      state.style="background-color: orange"
      break
    case 'Dead':
      state.style="background-color: red"
      break
  }
  newCharacter.appendChild(image)
  newCharacter.appendChild(name)
  newCharacter.appendChild(state)
  gridContent.appendChild(newCharacter)

}

document.addEventListener('scroll', () => {
  if (window.scrollY == document.documentElement.scrollHeight - window.innerHeight) {
    nextCharacter();
  }
});
searchInput.addEventListener("keyup", (e) => {
  processChange(e.target.value);
});

selectState.addEventListener("change",(value)=>{
  let aux
  let gender = selectGender.value;
  let name = searchInput.value;
  aux = basicUrl+ "?state="+value.target.value+"&&gender="+gender;
  url = aux;
  processChange(searchInput.value)
})
selectGender.addEventListener("change",(value)=>{
  let aux
  let state = selectState.value;
  let name = searchInput.value;
  aux = basicUrl+ "?state="+state+"&&gender="+value.target.value
  url = aux;
  processChange(searchInput.value)
})
