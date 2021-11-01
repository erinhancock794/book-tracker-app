(function (window) {
  let bookData = [];
  const searchInput = document.querySelector(".form-input");
  searchInput.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      fetchAPIData(searchInput);
      searchInput.value = "";

    }

  });

  function fetchAPIData(searchInput) {
    let searchInputValue = searchInput.value;
    fetch(`https://openlibrary.org/search.json?q=${searchInputValue}&limit=5`)
      .then((res) => res.json())
      .then((data) => {
        data.docs.forEach((book) => {
          compileBookData(book);
        });
        bookData.forEach((book) => {
          addDataToCard(book);
        });
      }).catch((err) => {
        console.log('error occurred');
      })
  }

  function compileBookData(book) {
    const author = book.author_name;
    const bookInfo = {
      id: book.edition_key[0],
      key: book.key,
      title: book.title,
      author: author || "unknown",
      publishYear: book.first_publish_year || "",
      isbn: book.isbn,
      lccn: book.lccn,
      userData: {
        rating: 0,
        wantToRead: false,
        hasRead: false,
      },
    };
    bookData.push(bookInfo);
  }

  function addDataToCard(book) {
    const cardRow = document.querySelector(`#card-row-search`);
    let cardTemplate = `
    <div class="card search-card m-3"  style="width: 18rem;">
    <div class="card-body" id=${book.id}>
      <h5 class="card-title">${book.title}</h5>
      <p class="card-text">Written by ${book.author}. First published in ${book.publishYear}</p>
      <button class="btn btn-primary" type="submit" id="mark-as-read">Mark as Read</button>
      <button class="btn btn-primary" type="submit" id="want-to-read">Want to Read</button>
</div>
  </div>`;
    cardRow.insertAdjacentHTML("beforeend", cardTemplate);
  }

  let cardContainer = document.querySelector("#card-container-search");
  cardContainer.addEventListener("click", (event) => {
    handleClickEvent(event);
  });

  let wantToReadContainer = document.querySelector(
    "#card-container-want-to-read"
  );
  wantToReadContainer.addEventListener("click", (event) => {
    handleClickEvent(event);
  });

  let hasReadContainer = document.querySelector("#card-container-has-read");
  hasReadContainer.addEventListener("click", (event) => {
    handleClickEvent(event);
  });

  function handleClickEvent(event) {
    event.preventDefault();
    const divId = event.target.parentElement.getAttribute("id");
    const ratingId =
      event.target.parentElement.parentElement.parentElement.getAttribute("id");
    const { type, id } = event.target;
    if (divId === "rating") {
      handleRating(ratingId, event.target);
    }

    if (id === "mark-as-read") {
      setMarkAsRead(divId, event.target);
      event.target.setAttribute("class", "btn btn-secondary");
    }
    if (id === "want-to-read" && type === "submit") {
      setWantToRead(divId, event.target);
      event.target.setAttribute("class", "btn btn-secondary");
    }
  }

  function setMarkAsRead(divId, target) {
    let bookItem = findMatchingBook(divId)
    bookItem.userData.hasRead = true;
    const previousLocation =
      target.parentElement.parentElement.parentElement.getAttribute("id");
    if (previousLocation === "card-row-want-to-read") {
      target.parentElement.parentElement.remove();
    }
    addDataToHasReadCard(bookItem);
  }

  function setWantToRead(divId) {
    let bookItem = findMatchingBook(divId)
    bookItem.userData.wantToRead = true;
    addDataToWantToReadCard(bookItem);
  }

  function addDataToHasReadCard(book) {
    const cardRow = document.querySelector("#card-row-has-read");
    const hasRead = book.userData.hasRead;
    let btnClass = "primary";
    if (hasRead) {
      btnClass = "secondary";
    }

    let cardTemplate = `
    <div class="card search-card m-3"  style="width: 18rem;">
    <div class="card-body" id=${book.id}>
      <h5 class="card-title">${book.title}</h5>
      <p class="card-text">Written by ${book.author}. First published in ${book.publishYear}</p>
      <form>
        <div class="rating" id="rating">
        <span class="far fa-thumbs-up" id="thumbs-up" for="1"></span>
        <span class="far fa-thumbs-down" id="thumbs-down" for="2"></span>
        </div>
        </form>
</div>
  </div>`;
    cardRow.insertAdjacentHTML("beforeend", cardTemplate);
  }

  function handleRating(ratingId, target) {
      let bookItem = findMatchingBook(ratingId)
    const { id, className } = target;
    let newClassName = "";
    if (className.includes("far")) {
      newClassName = `fas fa-${id}`;
      if (id === "thumbs-down") {
        bookItem.userData.liked = false;
      }
      if (id === "thumbs-up") {
        bookItem.userData.liked = true;
      }
    }
    if (className.includes("fas")) {
      newClassName = `far fa-${id}`;
      bookItem.userData.liked = null;
    }
    target.className = newClassName;
  }

  function addDataToWantToReadCard(book) {
    const cardRow = document.querySelector("#card-row-want-to-read");
    let cardTemplate = `
    <div class="card search-card m-3"  style="width: 18rem;">
    <div class="card-body" id=${book.id}>
      <h5 class="card-title">${book.title}</h5>
      <p class="card-text">Written by ${book.author}. First published in ${book.publishYear}</p>
      <button class="btn btn-primary" type="submit" id="mark-as-read">Mark As Read</button>
</div>
  </div>`;
    cardRow.insertAdjacentHTML("beforeend", cardTemplate);
  }

  function findMatchingBook(id) {
    return bookData.find((i) => i.id == id);
  }
})(window);
