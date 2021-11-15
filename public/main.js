(function (window) {

  let bookData = [];
  let databaseData = [];
  const searchInput = document.querySelector(".form-input");
  searchInput.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      fetchAPIData(searchInput);
      searchInput.value = "";
    }
  });

  fetch('/get')
  .then((res) => res.json())
  .then(data => {
    data.forEach((book) => {
      if (book.userData.hasRead) {
        addDataToHasReadCard(book)
      }
      if (book.userData.wantToRead) {
        addDataToWantToReadCard(book)
      }
      databaseData.push(book)
     })
  })

  function fetchAPIData(searchInput) {
    let searchInputValue = searchInput.value;
    fetch(`https://openlibrary.org/search.json?q=${searchInputValue}&limit=7`)
      .then((res) => res.json())
      .then((data) => {
        data.docs.forEach((book) => {
          compileBookData(book);
        });
        bookData.forEach((book) => {
          addDataToCard(book);
        });
      }).catch((err) => {
        console.log('error occurred', err);
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

  async function setMarkAsRead(divId, target) {
    let bookItem = await findMatchingBook(divId)
    bookItem.userData.hasRead = true;
    const previousLocation =
      target.parentElement.parentElement.parentElement.getAttribute("id");
    if (previousLocation === "card-row-want-to-read") {
      target.parentElement.parentElement.remove();
      bookItem.userData.wantToRead = false;
      updateBookInDatabase(bookItem)
    } else {
      addBookToDatabase(bookItem)
    }

    addDataToHasReadCard(bookItem);
  }



  async function setWantToRead(divId) {
    let bookItem = await findMatchingBook(divId)
    bookItem.userData.wantToRead = true;
    addBookToDatabase(bookItem)
    addDataToWantToReadCard(bookItem);
  }

  function addDataToHasReadCard(book) {
    const liked = book.userData.liked;
    let upFill = liked ? 'fas' : 'far';
    let downFill = 'far';
    if (liked) {
      upFill = 'fas'
      downFill = 'far'
    } else if (liked === false) {
      upFill = 'far'
      downFill = 'fas'
    }

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
        <span class="${upFill} fa-thumbs-up" id="thumbs-up" for="1"></span>
        <span class="${downFill} fa-thumbs-down" id="thumbs-down" for="2"></span>
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
      if (id === "thumbs-down" || bookItem.userData.liked) {
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
    updateBookInDatabase(bookItem)

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

  function findMatchingBook(bookId) {
    bookId.toString()

    const match = bookData.find((i) => i.id == bookId)
    return match ? match :  databaseData.find((i) => i.id == bookId);
  }

  function addBookToDatabase(bookItem) {
    fetch('/add', {
      method: "POST",
      body: JSON.stringify(bookItem)
    }).then((res) => res.json())
    .then((data) => {
      const userData = data.newBook.userData;
      if (userData.hasRead) {
        addDataToHasReadCard(data.newBook);
      }

    });
  }

  function updateBookInDatabase(bookItem) {
    fetch(`/${bookItem.id}`, {
      method: 'PUT',
      body: JSON.stringify(bookItem),
      headers: getHeaders()
    })
    .then(res => res.json())
    .then((data) => {
      console.log(data)
      
    })
  }

  function getHeaders() {
    return {
      "Content-Type": "application/json; charset=UTF-8",
    };
  }
})(window);
