

const getNames = () => {
  const list = document.getElementById('pr10-list');
  
  while(list.firstChild) {
    list.removeChild(list.firstChild);
  }

  fetch('/prove/pr10/fetchAll')
    .then(res => res.json())
    .then(data => {

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
    })
    .catch(err => {
      console.log(err);
    })
}

addListField = (listItem, value, isLabel=false) => {
  const span = document.createElement('span');
  span.innerText = value;
  if(isLabel) {
    span.classList.add('field-label');
  }
  listItem.appendChild(span);  
}


const addName = () => {
  const inputName =  document.getElementById('newName');
  const newName = inputName.value;
  const inputSoloMovies =  document.getElementById('soloMovies');
  const soloMovies = inputSoloMovies.value;
  const inputFavoriteColor =  document.getElementById('favoriteColor');
  const favoriteColor = inputFavoriteColor.value;

  var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

  if(newName === "") {
    return;
  }


  fetch('/prove/pr10/addName', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CSRF-Token': token },
    body: JSON.stringify({ newName, soloMovies, favoriteColor })
  })
    .then(res => {
      inputName.value = '';
      inputSoloMovies.value = '';
      inputFavoriteColor.value = '';
      getNames();
    })
    .catch(err => {
      inputName.value = '';
      inputSoloMovies.value = '';
      inputFavoriteColor.value = '';
      console.log(err);
    });
}



getNames();