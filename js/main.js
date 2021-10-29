(function (window) {
  // const theList = document.querySelector('#theList');
  let formattedSearchResults = [];

  const searchInput = document.querySelector(".form-input");
  searchInput.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      fetchAPIData(searchInput);
    }
  });

  function fetchAPIData(searchInput) {
    let searchInputValue = searchInput.value;
    console.log("searchInputValue---->", searchInputValue);
    fetch(`https://openlibrary.org/search.json?q=${searchInputValue}&limit=5`)
      .then((res) => res.json())
      .then((data) => {
        data.docs.forEach((book) => {
          compileBookData(book);
        });
        formattedSearchResults.forEach((book) => addDataToCard(book));
      });
  }

  function compileBookData(book) {
    const author = book.author_name;
    const bookInfo = {
        id: book.edition_key[0],
      key: book.key,
      title: book.title,
      author: author || "unknown",
      publishYear: book.first_publish_year || "",
      // isbn: book.isbn,
      // lccn: book.lccn,
      userData: {
          rating: 0,
          wantToRead: false,
          hasRead: false
      }
    };
    formattedSearchResults.push(bookInfo);
  }


  function addDataToCard(book) {
    const cardRow = document.querySelector(`#card-row-search`);
    const hasRead = book.userData.hasRead;
    let btnClass = 'primary';
    if (hasRead) {
        btnClass = 'secondary'
    }


    console.log("bookj title", book.title);

    let cardTemplate = `
    <div class="card search-card m-3"  style="width: 18rem;">
    <div class="card-body" id=${book.id}>
      <h5 class="card-title">${book.title}</h5>
      <p class="card-text">Written by ${book.author}. First published in ${book.publishYear}</p>

      <button class="btn btn-${btnClass}" type="submit" id="mark-as-read">Mark as Read</button>
      <button class="btn btn-primary" type="submit" id="want-to-read">Want to Read</button>
</div>

  </div>`;

  cardRow.insertAdjacentHTML("beforeend", cardTemplate);
  }

  let cardContainer = document.querySelector('#card-container-search');
  cardContainer.addEventListener('click', (event) => {
    console.log('cardContainer clicked');
    handleClickEvent(event)
});

let wantToReadContainer = document.querySelector('#card-container-want-to-read');
wantToReadContainer.addEventListener('click', (event) => {
    handleClickEvent(event);
})

function handleClickEvent(event) {
    event.preventDefault();
    console.log('event targer--->', event.target.parentElement);
    const bookId = event.target.parentElement.getAttribute('id');
    console.log('bookId--', bookId);
    const { type, id } = event.target;
    console.log('type--->', type);
    console.log('id---->', id);
  if (id === 'mark-as-read') {
        setMarkAsRead(bookId, event.target)

    }
    if (id === 'want-to-read') {
        setWantToRead(bookId, event.target)

    }
}

function setMarkAsRead(bookId, target) {
    let bookItem = formattedSearchResults.find((i) => i.id == bookId)
    bookItem.userData.hasRead = true;
    console.log('bookItem--', bookItem);
    target.setAttribute('class', 'btn btn-secondary')
    console.log('target00000-----', target);
    addDataToHasReadCard(bookItem)
}

function setWantToRead(bookId, target) {
    let bookItem = formattedSearchResults.find((i) => i.id == bookId)
    bookItem.userData.wantToRead = true;
    target.setAttribute('class', 'btn btn-secondary')
    addDataToWantToReadCard(bookItem)
    console.log('bookItem--', bookItem);
}

function addDataToHasReadCard(book) {
    const cardRow = document.querySelector('#card-row-has-read');
    const hasRead = book.userData.hasRead;
    let btnClass = 'primary';
    let hasReadButtonText = 'Mark as Read';
    if (hasRead) {
        btnClass = 'secondary'
        // hasReadButtonText = 'Mark as Unread'
    }


    console.log("bookj title", book.title);

    let cardTemplate = `
    <div class="card search-card m-3"  style="width: 18rem;">
    <div class="card-body" id=${book.id}>
      <h5 class="card-title">${book.title}</h5>
      <p class="card-text">Written by ${book.author}. First published in ${book.publishYear}</p>

<form>
<div class="star-rating">
<span class="fas fa-star checked"></span>
<span class="far fa-star" onclick="clicked()"></span>
<span class="far fa-star" onclick="clicked()"></span>
</div>
</form>
</div>

  </div>`;

  cardRow.insertAdjacentHTML("beforeend", cardTemplate);
  
}



function addDataToWantToReadCard(book) {
    const cardRow = document.querySelector('#card-row-want-to-read');
    const hasRead = book.userData.hasRead;
    let btnClass = 'primary';
    let hasReadButtonText = 'Mark as Read';
    if (hasRead) {
        btnClass = 'secondary'
        // hasReadButtonText = 'Mark as Unread'
    }


    console.log("bookj title", book.title);

    let cardTemplate = `
    <div class="card search-card m-3"  style="width: 18rem;">
    <div class="card-body" id=${book.id}>
      <h5 class="card-title">${book.title}</h5>
      <p class="card-text">Written by ${book.author}. First published in ${book.publishYear}</p>
      <button class="btn btn-${btnClass}" type="submit" id="mark-as-read">${hasReadButtonText}</button>
</div>

  </div>`;

  cardRow.insertAdjacentHTML("beforeend", cardTemplate);
  
}

  var logID = "log",
    log = $('<div id="' + logID + '"></div>');
  $("body").append(log);
  $('[type*="radio"]').change(function () {
    var me = $(this);
    log.html(me.attr("value"));
  });

  const btn = document.querySelector(".submit-rating");
  const thanksmsg = document.querySelector(".thanks-msg");
  const starRating = document.querySelector(".star-input");
  // Success msg show/hide
  btn.onclick = () => {
    starRating.style.display = "none";
    thanksmsg.style.display = "table";
    return false;
  };

  function clicked() {
    console.log("clicked");
  }
})(window);
