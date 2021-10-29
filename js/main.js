(function (window) {
const theList = document.querySelector('#theList');
let formattedSearchResults = []

fetch('http://openlibrary.org/search.json?q=the+lord+of+the+rings&limit=5')
.then(res => res.json())
.then(data => {
    console.log('data--->', data);
    data.docs.forEach(book => addToList(book.title))
    data.docs.forEach(book => {
        compileBookData(book);
        // addDataToCard(formattedSearchResults)
    })

    // return data.docs[0]
    formattedSearchResults.forEach(book => addDataToCard(book))
})
.then(theFirstBook => {
    console.log(theFirstBook);
});



function compileBookData(book) {

    const author = book.author_name;
    const bookInfo = {
        key: book.key,
        title: book.title,
        author: author || 'unknown',
        publishYear: book.first_publish_year || '',
        // isbn: book.isbn,
        // lccn: book.lccn
    }
    formattedSearchResults.push(bookInfo)
    console.log('search results---',formattedSearchResults);
    console.log('nook info', bookInfo);
}

function addToList(title) {
    let theLi = document.createElement('li');
    let theATag = document.createElement('a');
    theATag.setAttribute('href', '#')

    let theText = document.createTextNode(title)
    theATag.appendChild(theText)
    theLi.appendChild(theATag)
    theList.appendChild(theLi)
}

function addDataToCard(book) {
    const rows = document.querySelector('.row');
    const bookCard = document.querySelector('.search-card');
    // const bookCardBody = document.querySelector('.card-body');
    // const bookCardTitle = document.querySelector('.card-title');
    // bookCardTitle.textContent = resultsArr.title



    console.log('bookj title', book.title);

    let cardTemplate = `
    <div class="card search-card" style="width: 18rem;">
    <img class="card-img-top" src="..." alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">${book.title}</h5>
      <p class="card-text">Written by ${book.author}. First published in ${book.publishYear}</p>

      <a href="#" class="btn btn-primary" id="mark-as-read">Mark as Read</a>
      <a href="#" class="btn btn-primary" id="want-to-read">Want to Read</a>

<form>
<div class="star-rating">
<span class="fas fa-star checked" onclick="clicked()"></span>
<span class="far fa-star" onclick="clicked()"></span>
<span class="far fa-star" onclick="clicked()"></span>
</div>
</form>

    </div>
  </div>`

  rows.insertAdjacentHTML("beforeend", cardTemplate);

}

var logID = 'log',
  log = $('<div id="'+logID+'"></div>');
$('body').append(log);
  $('[type*="radio"]').change(function () {
    var me = $(this);
    log.html(me.attr('value'));
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
    console.log('clicked');
}

})(window)