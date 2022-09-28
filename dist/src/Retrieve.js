import {
  database, Manga4Up, List, size,
  ref, child, onValue, remove, 
  query, orderByChild, limitToLast, endBefore,
  startAfter, limitToFirst, storage,
  cloud, listAll, getDownloadURL, deleteObject,
} from '/dist/firebase.js';

let firstKey = null, lastKey = null;

////////////////////////////////////////////////

const recentTableRow = (key, data) => {
  let div;

  div = `
  <tr>
    <td>
      <img src="${data['Volume Cover']}" alt="${data['Manga Title']}:${data['Volume Number']}" />
    </td>
    <td>
      ${data['Manga Title']}: ${data['Volume Number']} <br />
      File Size: ${data['File Size']} Mb <br />
      Chapters: ${data['Chapters Count'].From}=>${data['Chapters Count'].To} <br />
      Key: ${key} <br />
      ID: ${data.ID}
    </td>
    <td>
      <button type="button" data-key="${key}" onclick="DeleteVolume(this)">Delete</button>
      <a href="/edit.html#/recent#/${key}">Edit</a>
    </td>
  </tr>
    `

  return div;
}
const listTableRow = (key, data) => {
  let div;

  div = `
  <tr data-state="${data.State}">
    <td>
      <img src="${data.Cover}" alt="${data.Title}" />
    </td>
    <td>
      <span>${data.Title}: ${data.Count}</span> <br />
      Manga State: ${data.State} <br />
      Key: ${key}
    </td>
    <td>
      <button type="button" data-key="${key}" onclick="DeleteManga(this)">Delete</button>
      <a href="/edit.html#/list#/${key}">Edit</a>
    </td>
  </tr>
    `;

  return div;
}
const blogTableRow = (key, data) => {
  let div;

  div = `
  <tr>
    <td>
      <img src="${data.Image}" alt="${data.Title}" />
    </td>
    <td>
      <span>${data.Title}</span> <br />
      ${data.Content.slice(0,20)}... <br />
    </td>
    <td>
      <button type="button" data-key="${key}" data-img="${data.Image}" onclick="DeleteBlog(this)">Delete</button>
      <a href="/edit.html#/blog#/${key}">Edit</a>
    </td>
  </tr>
  `;

  return div;
}

////////////////////////////////////////////////

function RetrieveRecent(Container) {
  const databaseRef = ref(database, Manga4Up);
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
  })
}
function RetrieveLoadMore(Container) {
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
  })
}
function RetrieveLoadLess(Container) {
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
  })
}
function RetrieveList(Container) {
  const databaseRef = ref(database, List);
  const databaseOrder = query(databaseRef, orderByChild('Title'));
  
  onValue(databaseOrder, (snapshot)=> {
    Container.innerHTML = '';
    snapshot.forEach(snap => {
      const key = snap.key;
      const data = snap.val();
      
      Container.innerHTML += listTableRow(key, data);
    })
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
function RetrieveByTitle(Container, mangaName) {
  const databaseRef = ref(database, Manga4Up);
  
  onValue(databaseRef, (snapshot) => {
    Container.innerHTML = '';
    snapshot.forEach((snap) => {
      const key = snap.key;
      const value = snap.val();
      const data = value['Volume Data'];
  
      if (data['Manga Title'] === mangaName) {
        Container.innerHTML =
          recentTableRow(key, data) +
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

window.DeleteVolume = DeleteVolume;
window.DeleteManga = DeleteManga;
window.DeleteBlog = DeleteBlog;

////////////////////////////////////////////////

export {
  RetrieveRecent, RetrieveLoadMore, RetrieveLoadLess,
  RetrieveList, RetrieveBlogs, RetrieveByTitle
}
