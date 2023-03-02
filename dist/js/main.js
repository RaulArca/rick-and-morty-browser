const gridContent= document.getElementsByClassName("grid-content").item(0)
const searchInput = document.getElementById("CharacterBrowser");
const selectState = document.getElementById("stateSelect");
const selectGender = document.getElementById("genderSelect");
const selectSearch = document.getElementById("searchSelect")
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
  search("","","")

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
    search(value,selectState.value,selectGender.value);
  }


);

function characterBox(character){
  const flipCard = document.createElement("div");
  flipCard.className="flip-card";
  const newCharacter = document.createElement('div');
  newCharacter.className = "flip-card-inner";
  const frontCard = document.createElement('div');
  frontCard.className = "flip-card-front"
  const backCard = document.createElement('div');

  backCard.className = "flip-card-back";
  const imageBg=document.createElement("img");
  imageBg.className="flip-card-back-bg";
  imageBg.src=
    "    https://s3.amazonaws.com/www-inside-design/uploads/2018/01/rick-morty-sq.jpg";

  const backCardContent = document.createElement('div');
  backCardContent.className = "flip-card-back-content"

  const image=document.createElement('img')
  image.src = character['image' ]
  image.className = "";
  const name = document.createElement('h3')
  name.className = "name";
  name.text=character['name' ];
  let text = document.createTextNode(character['name' ])
  name.appendChild(text);
  const state = document.createElement('p')
  text = document.createTextNode(character['status' ])
  state.className= "state";
  switch (character['status' ]) {
    case 'Alive':
      state.className+= " alive"
      break
    case 'unknown':
      state.className+= " unknown"
      break
    case 'Dead':
      state.className+= " dead"
      break
  }
  state.appendChild(text);
  const species = document.createElement('p')
  text = document.createTextNode("Specie: " +character['species' ]);
  species.appendChild(text);
  const type = document.createElement('p');
  text = document.createTextNode("sub-Specie: "+character['type' ]);
  type.appendChild(text);


  frontCard.appendChild(image);
  backCardContent.appendChild(name);
  backCardContent.appendChild(state);
  backCardContent.appendChild(species);
  backCardContent.appendChild(type);
  backCard.appendChild(imageBg)
  backCard.appendChild(backCardContent)
  newCharacter.appendChild(frontCard);
  newCharacter.appendChild(backCard);
  flipCard.appendChild(newCharacter)
  gridContent.appendChild(flipCard);

}
function search(search, status,gender){
  let characterUrl = basicUrl+ "?status="+status+"&&gender="+gender+ selectSearch.value+search;
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

document.addEventListener('scroll', () => {
  if (window.scrollY == document.documentElement.scrollHeight - window.innerHeight) {
    nextCharacter();
  }
});
searchInput.addEventListener("keyup", (e) => {
  processChange(e.target.value);
});

selectState.addEventListener("change",(value)=>{

  search(searchInput.value,value.target.value,selectGender.value);
})
selectGender.addEventListener("change",(value)=>{

  search(searchInput.value,selectState.value,value.target.value);
})

selectSearch.addEventListener("change",(value)=>{
  switch (value.target.value){
    case "&name=":
      searchInput.placeholder= "search for a sub-specie";
      searchInput.value=""
      break;
    case "&species=":
      searchInput.placeholder= "search for a sub-specie"
      searchInput.value=""
      break;
    case "&type=":
      searchInput.placeholder= "search for a sub-specie"
      searchInput.value=""
      break;
  }

})
