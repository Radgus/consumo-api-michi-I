
const API_KEY = '5ea23353-48d0-4cbd-948b-bd0812f0bcf9';
const API = axios.create({
  baseURL: 'https://api.thecatapi.com/v1',
});
API.defaults.headers.common['x-api-key'] = API_KEY;
const API_URL_RANDOM = `https://api.thecatapi.com/v1/images/search?limit=2`;
const API_URL_FAVOURITES = `https://api.thecatapi.com/v1/favourites`;
const API_URL_UPLOAD = `https://api.thecatapi.com/v1/images/upload`;
const API_URL_FAVOURITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;


const spanError = document.getElementById('error');

const loadRandomMichis = async () => {
  const res = await fetch(API_URL_RANDOM, {
    method: 'GET',
    headers: {
      'x-api-key': API_KEY,    
    }
  });
  const data = await res.json();
  console.log('data random: ',data);

  if (res.status !== 200) {
    spanError.innerHTML = `Hubo un error: ${res.status}!!!`;
  }else {
    const img1 = document.getElementById('gatito1');
    const img2 = document.getElementById('gatito2');
    img1.src = data[0].url;
    img2.src = data[1].url;
    
    const btn1 = document.getElementById('btn1');
    const btn2 = document.getElementById('btn2');
    btn1.onclick = () => saveFavouriteMichi(data[0].id);
    btn2.onclick = () => saveFavouriteMichi(data[1].id);

  }

  // Promise
  // fetch(API_URL)
  // .then(response => response.json())
  // .then(data => {
  //   console.log(data);
  //   const img = document.querySelector('img');
  //   img.src = data[0].url;
  //   img.style.width = '300px';
  // });

}

const loadFavouriteMichis = async () => {
  const res = await fetch(API_URL_FAVOURITES, {
    method: 'GET',
    headers: {
      'x-api-key': API_KEY, 
    }
  });
  const data = await res.json();
  console.log('data favourites: ',data);

  if (res.status !== 200) {
    spanError.innerHTML = `Hubo un error: ${res.status}!!! 
    ${data.message}`;
  } else {
    const favouriteSection = document.getElementById('favoritesMichis').innerHTML = '';
    data.forEach(michi => {
      const section = document.getElementById('favoritesMichis')
      const article = document.createElement('artical');
      const img = document.createElement('img');
      const btn = document.createElement('button');
      const btnText = document.createTextNode('Sacar al michi de favorito');

      btn.appendChild(btnText);
      btn.onclick = () => deleteFavouriteMichi(michi.id);
      img.src = michi.image.url;
      img.style.width = '150px';

      article.appendChild(img);
      article.appendChild(btn);
      article.className = 'card';
      section.appendChild(article);
    });
  }
  
}

const saveFavouriteMichi = async (id) => {
  const {data, status} = await API.post('/favourites', {
    "image_id": id,
  });
  // const res = await fetch(
  //   API_URL_FAVOURITES,
  //   {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'x-api-key': API_KEY,
  //     },
  //     body: JSON.stringify({
  //       "image_id": id,
  //     }),
  //   }
  // );
  // const data = await res.json();

  if (status !== 200) {
    spanError.innerHTML = `Hubo un error: ${status}!!! 
    ${data.message}`;
  } else {
    console.log('michi guardado en favoritos')
    loadFavouriteMichis();
  }

  console.log(`Post favourites: ${data}`)

} 

const deleteFavouriteMichi = async (id) => {
  console.log('delete michi id: ',id);
  const res = await fetch(
    API_URL_FAVOURITES_DELETE(id),
    {
      method: 'DELETE',
      headers: {
        'x-api-key': API_KEY,
      },
    }
  );
  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerHTML = `Hubo un error: ${res.status}!!! 
    ${data.message}`;
  } else {
    console.log('michi eliminado de favoritos');
    loadFavouriteMichis();
  }
}

const uploadMichiPhoto = async () => {
  const form = document.getElementById('uploadingForm');
  const formData = new FormData(form);

  const res = await fetch(API_URL_UPLOAD, {
    method:'POST',
    headers:{
      'x-api-key': API_KEY,
      // 'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

  const data = await res.json();

  if (res.status !== 201) {
    spanError.innerHTML = `Hubo un error: ${res.status}!!! 
    ${data.message}`;
  } else {
    console.log('michi subido :D')
    saveFavouriteMichi(data.id);
  }
}


loadRandomMichis();

loadFavouriteMichis();
