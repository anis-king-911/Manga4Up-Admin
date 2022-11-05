import {
  database, Manga4Up, List, ToDos, size, ReverseDate, ReverseDate_V3,
  ref, child, onValue, remove, 
  query, orderByChild, limitToLast, endBefore,
  startAfter, limitToFirst, storage,
  cloud, deleteObject,
} from '/dist/scripts/firebase.js';

let firstKey = null, lastKey = null, lastChild = null;

////////////////////////////////////////////////

const recentTableRow = (key, data) => {
  return `
  <tr x-data="{openToEdit : false}">
    <td>
      <img src="${data['Volume Cover']}" alt="${data['Manga Title']}:${data['Volume Number']}" />
    </td>
    <td>
      ${data['Manga Title']}: ${data['Volume Number']} <br />
      File Size: ${data['File Size']} Mb <br />
      Chapters: ${data['Chapters Count'].From}=>${data['Chapters Count'].To} <br />
      ID: ${data.ID}
    </td>
    <td>
      <button type="button" data-key="${key}" onclick="DeleteVolume(this)">
        <i class="fa fa-trash" aria-hidden="true"></i>
      </button>
      <a href="/edit.html#/recent#/${key}">
        <button><i class="fa fa-edit" aria-hidden="true"></i></button>
      </a>
    </td>
  </tr>
    `
}
const listTableRow = (key, data) => {
  let div;
  
  const {
    Cover, Title, Count, State, CreationDate, Options = []
  } = data;
  
  if(Options.includes('Comming Soon')) {
  div = `
  <tr data-state="${State}">
    <td>
      <img src="${Cover}" alt="${Title}" />
    </td>
    <td>
      <span>${Title}: ${Count}</span> <br />
      Manga State: ${State} <br />
      Manga Release: ${ReverseDate(CreationDate)}<br />
    </td>
    <td>
      <button type="button" data-key="${key}" onclick="DeleteManga(this)">
        <i class="fa fa-trash" aria-hidden="true"></i>
      </button>
      <a href="/edit.html#/list#/${key}">
        <button><i class="fa fa-edit" aria-hidden="true"></i></button>
      </a>
    </td>
  </tr>
    `;
  } else {
  div = `
  <tr data-state="${State}">
    <td>
      <img src="${Cover}" alt="${Title}" />
    </td>
    <td>
      <span>${Title}: ${Count}</span> <br />
      Manga State: ${State} <br />
      Manga Release: ${ReverseDate(CreationDate)}<br />
    </td>
    <td>
      <button type="button" data-key="${key}" onclick="DeleteManga(this)">
        <i class="fa fa-trash" aria-hidden="true"></i>
      </button>
      <a href="/edit.html#/list#/${key}">
        <button><i class="fa fa-edit" aria-hidden="true"></i></button>
      </a>
      <a href="/solo.html#/${Title.replaceAll(' ', '_')}">
        <button><i class="fa fa-eye" aria-hidden="true"></i></button>
      </a>
    </td>
  </tr>
    `;
  }
  return div;
}
const blogTableRow = (key, data) => {
  const { Image, Title, Content } = data;
  return `
  <tr>
    <td>
      <img src="${Image}" alt="${Title}" />
    </td>
    <td>
      <span>${Title}</span> <br />
      ${Content.slice(0,20)}... <br />
    </td>
    <td>
      <button type="button" data-key="${key}" data-img="${Image}" onclick="DeleteBlog(this)">
        <i class="fa fa-trash" aria-hidden="true"></i>
      </button>
      <a href="/edit.html#/blog#/${key}">
        <button><i class="fa fa-edit" aria-hidden="true"></i></button>
      </a>
    </td>
  </tr>
  `;
}
const ToDo = (key, data) => {
  const { ToDo, CreatedAt } = data;
  return `
    <div class="Todo">
      <div class="Content">
        ${ToDo}
      </div>
      <div class="Actions">
        <button data-key="${key}" onclick="DeleteToDo(this)">Delete</button>
        <div>${ReverseDate_V3(CreatedAt)}</div>
      </div>
    </div>
  `;
}

////////////////////////////////////////////////

function RetrieveRecent(Container) {
  const databaseRef = ref(database, Manga4Up);
  
  onValue(databaseRef, snapshot => console.log(snapshot))
  onValue(databaseRef, snapshot => console.log(snapshot.val()))
  
  const databaseOrder = query(databaseRef, orderByChild('Volume Data/CreatedAt'));
  const databaseLimit = query(databaseOrder, limitToLast(size));
  
  onValue(databaseLimit, (snapshot)=> {
    Container.innerHTML = '';
    snapshot.forEach(snap => {
      const key = snap.key;
      const value = snap.val();
      const data = value['Volume Data'];
      
      Container.innerHTML =
        recentTableRow(key, data) +
      Container.innerHTML;
    })
    firstKey = Object.values(snapshot.val())[0]['Volume Data']['CreatedAt'];
    lastKey = Object.values(snapshot.val()).pop()['Volume Data']['CreatedAt'];
    
    lastChild = lastKey;
    if(lastChild === lastKey) document.querySelector('.LLP').disabled = true;
    else document.querySelector('.LLP').disabled = false;
  })
}
function RetrieveOldData(Container) {
  const databaseRef = ref(database, Manga4Up);
  const databaseOrder = query(databaseRef, orderByChild('Volume Data/CreatedAt'));
  const databaseStart = query(databaseOrder, endBefore(firstKey));
  const databaseLimit = query(databaseStart, limitToLast(size));

  onValue(databaseLimit, (snapshot)=> {
    Container.innerHTML = '';
    snapshot.forEach(snap => {
      const key = snap.key;
      const value = snap.val();
      const data = value['Volume Data'];
      
      Container.innerHTML =
        recentTableRow(key, data) +
      Container.innerHTML;
    })
    firstKey = Object.values(snapshot.val())[0]['Volume Data']['CreatedAt'];
    lastKey = Object.values(snapshot.val()).pop()['Volume Data']['CreatedAt'];
    
    if (lastChild === lastKey) document.querySelector('.LLP').disabled = true;
    else document.querySelector('.LLP').disabled = false;
  })
}
function RetrieveNewData(Container) {
  const databaseRef = ref(database, Manga4Up);
  const databaseOrder = query(databaseRef, orderByChild('Volume Data/CreatedAt'));
  const databaseStart = query(databaseOrder, startAfter(lastKey));
  const databaseLimit = query(databaseStart, limitToFirst(size));

  onValue(databaseLimit, (snapshot)=> {
    Container.innerHTML = '';
    snapshot.forEach(snap => {
      const key = snap.key;
      const value = snap.val();
      const data = value['Volume Data'];
      
      Container.innerHTML =
        recentTableRow(key, data) +
      Container.innerHTML;
    })
    firstKey = Object.values(snapshot.val())[0]['Volume Data']['CreatedAt'];
    lastKey = Object.values(snapshot.val()).pop()['Volume Data']['CreatedAt'];
    
    if (lastChild === lastKey) document.querySelector('.LLP').disabled = true;
    else document.querySelector('.LLP').disabled = false;
  })
}
function RetrieveBlogs(Container) {
  const databaseRef = ref(database, 'blog/');

  onValue(databaseRef, (snapshot) => {
    Container.innerHTML = '';
    snapshot.forEach((snap) => {
      const key = snap.key;
      const data = snap.val();

      Container.innerHTML += blogTableRow(key, data);
    })
  })
}
function RetrieveSolo(Container, mangaName) {
  const databaseRef = ref(database, Manga4Up);
  
  onValue(databaseRef, (snapshot) => {
    Container.innerHTML = '';
    snapshot.forEach((snap) => {
      const key = snap.key;
      const value = snap.val();
      const data = value['Volume Data'];
  
      if (data['Manga Title'] === mangaName.replaceAll('_', ' ')) {
        Container.innerHTML += recentTableRow(key, data);
      }
    })
  })
}

////////////////////////////////////////////////

function RetrieveList_one(Container, Order) {
  const databaseRef = ref(database, List);
  const databaseOrder = query(databaseRef, orderByChild(Order));
  
  onValue(databaseOrder, (snapshot)=> {
    Container.innerHTML = '';
    
    snapshot.forEach(snap => {
      const key = snap.key;
      const data = snap.val();

      Container.innerHTML += listTableRow(key, data);
    })
  })
}
function RetrieveList_two(Container, Order) {
  const databaseRef = ref(database, List);
  const databaseOrder = query(databaseRef, orderByChild(Order));
  
  onValue(databaseOrder, (snapshot)=> {
    Container.innerHTML = '';
    
    snapshot.forEach(snap => {
      const key = snap.key;
      const data = snap.val();

      Container.innerHTML =
        listTableRow(key, data) +
      Container.innerHTML;
    })
  })
}

////////////////////////////////////////////////

function RetrieveToDos(Container) {
  const databaseRef = ref(database, ToDos);
  
  onValue(databaseRef, snapshot => {
    Container.innerHTML = '';
    
    snapshot.forEach(snap => {
      const key = snap.key;
      const data = snap.val();
      
      Container.innerHTML = ToDo(key, data) + Container.innerHTML;
    })
  })
}

////////////////////////////////////////////////

function RetrieveFiltered(Container, filter) {
  const databaseRef = ref(database, List);
  
  onValue(databaseRef, (snapshot)=> {
    Container.innerHTML = '';
    
    snapshot.forEach(snap => {
      const key = snap.key;
      const data = snap.val();
      
      const { Options = [] } = data;
      
      if(Options.includes(filter)) {
        Container.innerHTML =
          listTableRow(key, data) +
        Container.innerHTML;
      }
    })
  })
}

////////////////////////////////////////////////

function DeleteVolume(event) {
  const question = confirm('Delete This Volume ?');
  
  switch(question) {
    case true:
      
      const key = event.getAttribute('data-key');
      
      const databaseRef = ref(database, Manga4Up);
      const databaseChild = child(databaseRef, `${key}/`);
      
      remove(databaseChild)
        .then(()=> console.log('Volume Deleted Successfully'))
        .catch(error => console.log(error));
      
      break;
    case false:
      
      alert('Operation Cancelled !');
      
      break;
  }
}
function DeleteManga(event) {
  const question = confirm('Delete This Manga ?');
  
  switch(question) {
    case true:
      
      const key = event.getAttribute('data-key');
      
      const databaseRef = ref(database, List);
      const databaseChild = child(databaseRef, `${key}/`);
      
      remove(databaseChild)
        .then(()=> console.log('Manga Deleted Successfully'))
        .catch(error => console.log(error));
      
      break;
    case false:
      
      alert('Operation Cancelled !');
      
      break;
  }
}
function DeleteBlog(event) {
  const question = confirm('Delete This Blog ?');
  
  switch(question) {
    case true:
      
      const key = event.getAttribute('data-key');
      const img = event.getAttribute('data-img');
      
      const databaseRef = ref(database, 'blog/');
      const databaseChild = child(databaseRef, `${key}/`);
      const storageRef = cloud(storage, img);
      
      remove(databaseChild)
        .then(()=> console.log('Blog Data Deleted Successfully'))
        .catch(error => console.log(error));
      
      deleteObject(storageRef)
        .then(()=> console.log('Blog Cover Deleted Successfully'))
        .catch(error => console.log(error));
      
      break;
    case false:
      
      alert('Operation Cancelled !');
      
      break;
  }
}
function DeleteToDo(event) {
  const question = confirm('Delete ToDo ?');
  
  switch (question) {
    case true:
        const key = event.getAttribute('data-key');
        
        const databaseRef = ref(database, ToDos);
        const databaseChild = child(databaseRef, key);
        
        remove(databaseChild)
        .then(() => console.log('operation done'))
        .catch(error => console.log(error));
      break;
    case false:
        alert('Operation Cancelled !');
      break;
  }
}

window.DeleteVolume = DeleteVolume;
window.DeleteManga = DeleteManga;
window.DeleteBlog = DeleteBlog;
window.DeleteToDo = DeleteToDo;

////////////////////////////////////////////////

export {
  RetrieveRecent, RetrieveOldData, RetrieveNewData,
  RetrieveList_one, RetrieveBlogs, RetrieveSolo,
  RetrieveList_two, RetrieveToDos, RetrieveFiltered,
}
