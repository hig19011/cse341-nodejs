const socket = io();

const getNames = () => { 
  socket.emit('fetchAll');
}

socket.on('avengers', response => {
    buildAvengerList(response.data);
});

buildAvengerList = (data) => {
  const list = document.getElementById('pr11-list');
  
  while(list.firstChild) {
    list.removeChild(list.firstChild);
  }

  const header = document.createElement('li');
  addListField(header, "Name", true);
  addListField(header, "Solo Movies", true);
  addListField(header, "Favorite Color", true);
  list.appendChild(header);

  data.avengers.forEach(d => {
    const item = document.createElement('li');
    
    addListField(item, d.name);
    addListField(item, d.soloMovies);
    addListField(item, d.favoriteColor);       

    list.appendChild(item);
  });
};

addListField = (listItem, value, isLabel=false) => {
  const span = document.createElement('span');
  span.innerText = value;
  if(isLabel) {
    span.classList.add('field-label');
  }
  listItem.appendChild(span);  
}

const addName = async () => {
  const inputName =  document.getElementById('newName');
  const newName = inputName.value;
  const inputSoloMovies =  document.getElementById('soloMovies');
  const soloMovies = inputSoloMovies.value;
  const inputFavoriteColor =  document.getElementById('favoriteColor');
  const favoriteColor = inputFavoriteColor.value;
  const errorMessage = document.getElementById('errorMessage');  

  if(newName === "") {
    errorMessage.innerText = "Avenger name is required.";
    errorMessage.classList.remove("hidden");
    return;
  }

  socket.emit('addName',{newName: newName,  soloMovies: soloMovies, favoriteColor: favoriteColor},
    function(error) {
      if(error !== ""){           
        errorMessage.innerText = error;
        errorMessage.classList.remove("hidden");
        return;
      }

      inputName.value = '';
      inputSoloMovies.value = '';
      inputFavoriteColor.value = '';
      errorMessage.innerText = '';
      errorMessage.classList.add("hidden");
  }); 
}


getNames();