var URI = "https://hp-api.onrender.com/api/characters";

let contenedor = document.getElementById("contenedor");
let favContenedor = document.getElementById("favoritos")
let checkboxes = document.getElementById("checkboxes");
let buscador = document.getElementById("busqueda");
let personajes = [];
let casas = [];
let favoritos = [];

traerDatos(URI);

buscador.addEventListener("input", filtrado);

checkboxes.addEventListener("change", filtrado);

window.addEventListener('load', () =>{
    let fav = JSON.parse(localStorage.getItem("favoritos"))
    if(fav){
        favoritos = fav
        mostrarCards(favoritos,favContenedor)
    }
})

function mostrarCards(arregloPersonajes,lugar) {
  lugar.innerHTML = "";
  arregloPersonajes.forEach((personaje) => {
    if (personaje.image == "" && personaje.house == "Ravenclaw") {
      personaje.image =
        "https://m.media-amazon.com/images/I/51HsfrfQvqL._AC_.jpg";
    } else if (personaje.image == "" && personaje.house == "Hufflepuff") {
      personaje.image =
        "https://static.posters.cz/image/750/carteles-de-metal/harry-potter-hufflepuff-i67993.jpg";
    } else if (personaje.image == "" && personaje.house == "Slytherin") {
      personaje.image =
        "https://imusic.b-cdn.net/images/item/original/597/5055453459597.jpg?harry-potter-harry-potter-slytherin-metal-sign-merch&class=scaled";
    } else if (personaje.image == "" && personaje.house == "Gryffindor") {
      personaje.image =
        "https://cdn.shopify.com/s/files/1/0033/3434/0723/products/01-0808_l-harry-potter-gryffindor-crest-large-regular-posters_1400x.progressive.jpg?v=1589942156";
    } else if (personaje.image == "" && personaje.house == "") {
      personaje.image =
        "https://uploads.turbologo.com/uploads/design/hq_preview_image/5097676/draw_svg20210617-26747-23281c.svg.png";
    }
    if (arregloPersonajes.length == 0) {
        if(lugar.id=="contenedor"){
      let vacia = document.createElement("div");
      vacia.style.width = "50rem";
      vacia.style.height = "50rem";
      vacia.innerHTML = `<img src="https://www.monastore.com.mx/wp-content/uploads/2018/10/GAM20HP209457d-Large.jpg" class="card-img-top h-75" id=foto alt="Nada Encontrado">
            <div class="card-body p-3 "> 
            <h3>Nada encontrado</h3>`;
    }else{
        let vacia = document.createElement("div");
        vacia.style.width = "50rem";
        vacia.style.height = "50rem";
        vacia.innerHTML = `
              <div class="card-body p-3 "> 
              <h3>Nada encontrado</h3>`;
    }
}

    let card = document.createElement("div");
    let funciones = ""
    let colorBtn = ""
    if(lugar.id == "contenedor"){
        funciones= `agregarFav("${personaje.id}")`
        colorBtn= 'btn btn-primary'
    }else{
        funciones= `borrarFav("${personaje.id}")`
        colorBtn= 'btn btn-danger'
    }
    card.className = "card p-2 m-3 bg-dark";
    card.style.width = "18rem";
    card.style.height = "35rem";
    card.innerHTML = `<img src="${personaje.image}" class="card-img-top h-75" id=foto alt="${personaje.name}">
        <div class="card-body p-3 ">
        <p class="card-text text-white">${personaje.name}</p>
        <p class="card-text text-white">${personaje.house}</p>
        </div>   
        <button type="button" id="addFav" class='${colorBtn}' onclick=${funciones}>${lugar.id == 'contenedor'? "♥ Favorito": "Eliminar Favorito"} </button> `;
    lugar.appendChild(card);
  });
}

function traerDatos(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      personajes = data;
      mostrarCards(data, contenedor);
      data.forEach((personaje) => {
        if (!casas.includes(personaje.house)) {
          casas.push(personaje.house);
        }
      });
      mostrarChecks(casas);
    });
}

function filtrado() {
  let filtro1 = filtrarPorCasas(personajes);
  let filtro2 = buscarPersonajes(filtro1);
  if (filtro2.length != 0) {
    mostrarCards(filtro2, contenedor);
  } else {
    emptyCards();
  }
}

function filtrarPorCasas(arrayP) {
  let switchsC = Array.from(document.querySelectorAll("input[type='checkbox']"))
    .filter((check) => check.checked)
    .map((checkeados) => checkeados.value);
  if (switchsC.length == 0) {
    return arrayP;
  }
  if (switchsC == "Sin Casa") {
    switchsC = "";
  }
  let personajesFiltrados = arrayP.filter((personajes) =>
    switchsC.includes(personajes.house)
  );
  return personajesFiltrados;
}

function buscarPersonajes(arrayP) {
  let arrayfiltrado = arrayP.filter((personaje) =>
    personaje.name.toLowerCase().includes(buscador.value.toLowerCase())
  );
  return arrayfiltrado;
}

function mostrarChecks(arrayC) {
  let vacio = arrayC.indexOf("");
  arrayC.splice(vacio, 1, "Sin Casa");
  arrayC.forEach((casa) => {
    let checkC = document.createElement("div");
    checkC.className = "form-check form-switch";
    checkC.innerHTML = `<input class="form-check-input" type="checkbox" value="${casa}" role="switch" id="${casa}">
        <label class="form-check-label" for="${casa}">${casa}</label>`;
    checkboxes.appendChild(checkC);
  });
}

function emptyCards() {
  contenedor.innerHTML = "";
  let empty = document.createElement("div");
  empty.className = "card text-bg-dark w-100 text-center";
  empty.innerHTML = `<img src="https://cdn.alfabetajuega.com/alfabetajuega/abj_public_files/multimedia/imagenes/201610/167813.alfabetajuega-mapa-del-merodeador.jpg" class="card-img" alt="...">
    <div id="ordenar" class="card-img-overlay">
    <h3 class="card-title text-white bg-dark">Nada Encontrado</h3>
    </div>
    </div>`;
  contenedor.appendChild(empty);
}

function agregarFav(idPersonaje){
    let personaje = personajes.find(personaje => personaje.id == idPersonaje)
    if(!favoritos.some(personaje => personaje.id == idPersonaje)){
        favoritos.push(personaje)
        mostrarCards(favoritos, favContenedor)
        localStorage.setItem("favoritos", JSON.stringify(favoritos))
    }
}

function borrarFav(idPersonaje){
    favoritos = favoritos.filter(personaje => personaje.id != idPersonaje)
    mostrarCards(favoritos, favContenedor)
    localStorage.setItem("favoritos", JSON.stringify(favoritos))
}