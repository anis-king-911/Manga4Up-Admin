function getJSON(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = () => {
    const status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
}

function stringSort( a, b ) {
  if (a.Title < b.Title ) return -1;
  if ( a.Title > b.Title ) return 1;
  return 0;
}

let url = './Manga4Up.json';

function GetData() {
  getJSON(url, (error, fileContent) => {
    if(error) console.log(error);
    if(fileContent) {
      const array = Object.values(fileContent);
      const order = [...array].sort(stringSort);
      
      order.map(( data ) => {
        document.querySelector('.container').innerHTML += Book(data);
      })
      
    }
  })
}


function filterSelection(label) {
  const books = document.querySelectorAll('[data-state]');
  
  if(label == 'Show All') label = ''
  books.forEach((book) => {
    book.classList.add('show');
    const state = book.getAttribute('data-state').indexOf(label)>-1;
    if(state) book.classList.remove('show');
  })
}

const FilterBtns = document.querySelectorAll('.FilterBtns button');

FilterBtns.forEach((Btn) => {
  Btn.addEventListener('click', (event) => {
    FilterBtns.forEach(Btn => Btn.classList.remove('active'));
    Btn.classList.add('active');
    
    filterSelection(event.target.innerText)
  })
})

GetData()
window.filterSelection = filterSelection;


const Book = (arg) => {
  const {
    Cover, Title, Count, State, Options = []
  } = arg;
  
  let div =
    `
<article class="Manga" data-state="${State}">
  <div class="Options">
    ${Options.map(Option => `<span>${Option}</span>`).join('')}
  </div>
  <div class="Cover">
    <img src="${Cover}" alt="${Title}">
  </div>
  <div class="Content">
    <h3>${Title}</h3>
    <div class="Info">Volumes Count: <span>${Count}</span></div>
    <div class="Info">Manga State: <span>${State}</span></div>
  </div>
  <div class="Actions">
    <a href="/manga/#/${Title.replaceAll(' ', '_')}">Manga Page</a>
  </div>
</article>
  `;

  return div;
}
