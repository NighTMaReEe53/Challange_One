const API_KEY = "api_key=82ad1a9e357bc59d597d6b1254ba5ae2";
const websiteOfApi = "https://api.themoviedb.org/3";

const theContainer = document.querySelector(".content .container");

let allBtn = document.querySelectorAll(".buttons button");

let theForm = document.forms[0];
let theInput = document.querySelector("form input");

allBtn.forEach((el) => {
  el.addEventListener("click", (e) => {
    el.parentElement
      .querySelectorAll(".active")
      .forEach((el) => el.classList.remove("active"));
    e.target.classList.add("active");
    theContainer.innerHTML = "";
    getMovies(el.dataset.indx);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});

function getMovies(index) {
  const theUrl = `${websiteOfApi}/movie/popular?language=en-US&page=${index}&${API_KEY}`;
  let requestMovies = new XMLHttpRequest();

  requestMovies.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let self = this;
      theDataLooping(self);
    }
  };

  requestMovies.open("GET", theUrl, true);

  requestMovies.send();
}

// Trigger Function
getMovies(1);

theForm.onsubmit = function (e) {
  e.preventDefault();

  let theUrlSearch = `${websiteOfApi}/search/movie?${API_KEY}&query=${theInput.value}`;

  let theRequest = new XMLHttpRequest();

  theRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let self = this;
      theContainer.innerHTML = "";
      theInput.value = "";
      theDataLooping(self);
    }
  };

  if (theRequest.status !== 200) {
    getMovies(1);
  }

  theRequest.open("GET", theUrlSearch, true);
  theRequest.send();
};

function theDataLooping(el) {
  const data = JSON.parse(el.responseText);

  const myData = data.results;

  myData.forEach((el) => {
    const { original_title, poster_path, vote_average, id } = el;

    let myDiv = document.createElement("div");

    myDiv.className = "card";

    myDiv.addEventListener("click", (e) =>
      loopingOnMainDiv(e.currentTarget.dataset.indx)
    );

    myDiv.setAttribute("data-indx", id);

    let theImage = document.createElement("img");

    theImage.src = `https://image.tmdb.org/t/p/w500/${poster_path}`;

    myDiv.appendChild(theImage);

    let divDetails = document.createElement("div");

    divDetails.className = "details";

    let theHeading = document.createElement("h2");

    theHeading.className = "desc";

    theHeading.appendChild(document.createTextNode(original_title));
    theHeading.textContent = theHeading.textContent.slice(0, 15);

    divDetails.appendChild(theHeading);

    let mySpan = document.createElement("span");

    mySpan.appendChild(document.createTextNode(vote_average));

    mySpan.textContent = parseFloat(mySpan.textContent).toFixed(2);

    mySpan.className =
      parseInt(mySpan.textContent) >= 7
        ? "green"
        : parseInt(mySpan.textContent) >= 5
        ? "yellow"
        : "red";

    divDetails.appendChild(mySpan);

    myDiv.appendChild(divDetails);

    theContainer.appendChild(myDiv);
  });
}

// Card's

function loopingOnMainDiv(element) {
  console.log(element);
  theContainer.innerHTML = "";
  document.querySelector(".buttons").remove();
  let theUrl = `${websiteOfApi}/movie/${element}?language=en-US&${API_KEY}`;

  let theRequest = new XMLHttpRequest();

  theRequest.onreadystatechange = function () {
    if (theRequest.readyState === 4 && theRequest.status === 200) {
      let data = JSON.parse(this.responseText);

      let {
        poster_path,
        homepage,
        title,
        backdrop_path,
        overview,
        vote_count,
        release_date,
      } = data;

      let [one, two] = data.production_companies;

      document.body.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500/${backdrop_path})`;

      let theMainDiv = document.createElement("div");

      theMainDiv.className = "main";

      let theImage = document.createElement("img");

      theImage.src = `https://image.tmdb.org/t/p/w500/${poster_path}`;

      theMainDiv.appendChild(theImage);

      let theHeading = document.createElement("h2");

      theHeading.appendChild(document.createTextNode(title));
      document.querySelector(".info-data").innerHTML = title;
      theMainDiv.appendChild(theHeading);

      let theDescribe = document.createElement("p");

      theDescribe.appendChild(document.createTextNode(overview));
      theMainDiv.appendChild(theDescribe);

      let voting = document.createElement("span");
      voting.className = "voiting";
      voting.appendChild(document.createTextNode(`Favourite : `));
      let pForVoting = document.createElement("span");
      pForVoting.appendChild(document.createTextNode(`${vote_count}`));
      voting.appendChild(pForVoting);
      theMainDiv.appendChild(voting);

      let theSite = document.createElement("a");
      theSite.appendChild(document.createTextNode("Vist Our Site"));
      theSite.className = "home";
      theSite.href = `${homepage}`;
      theMainDiv.appendChild(theSite);

      let infoDiv = document.createElement("div");

      infoDiv.className = "desciber";

      infoDiv.appendChild(document.createTextNode(release_date));
      let infoText = document.createTextNode(" : تم انتاج هذا الفيلم");
      infoDiv.appendChild(infoText);
      theMainDiv.appendChild(infoDiv);
      theContainer.appendChild(theMainDiv);

      let newsOf = document.createElement("h3");

      newsOf.appendChild(document.createTextNode("تم انتاجه بواسطة"));

      theMainDiv.appendChild(newsOf);

      let theImageContainer = document.createElement("div");

      theImageContainer.className = "images";
      let theImgOne = document.createElement("img");
      let theImgTwo = theImgOne.cloneNode();

      theImgOne.src = `https://image.tmdb.org/t/p/w500/${one.logo_path}`;
      theImgTwo.src = `https://image.tmdb.org/t/p/w500/${two.logo_path}`;

      theImageContainer.appendChild(theImgOne);
      theImageContainer.appendChild(theImgTwo);
      theMainDiv.appendChild(theImageContainer);
    }
  };

  theRequest.open("GET", theUrl, true);
  theRequest.send();
}

let theLoaded = document.querySelector(".loaded");

document.body.style.overflow = "hidden";

window.addEventListener("load", () => {
  document.getElementById("myAudio").play();
});

setTimeout(() => {
  theLoaded.classList.add("remove");
  document.getElementById("myAudio").play();
  document.body.style.overflow = "auto";
}, 3000);
