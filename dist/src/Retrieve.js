import {
  database, storage, Manga4Up, List, size,
  ref, child, onValue, set, push, update, remove, 
  query, orderByChild, limitToLast, endBefore,
  cloud, listAll, getDownloadURL,
  uploadBytesResumable,
} from '/dist/firebase.js';

let array = null, firstKey = null;

export default class Retrieve {
  static Recent(Container) {
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
          `
        <tr>
          <td>
            <img src="${data['Volume Cover']}" alt="${data['Manga Title']}:${data['Volume Number']}" />
          </td>
          <td>
            ${data['Manga Title']}: ${data['Volume Number']} <br />
            File Size: ${data['File Size']} Mb <br />
            Chapters: ${data['Chapters Count'].From}=>${data['Chapters Count'].To} <br />
            ID: ${data.ID} <br />
            Key: ${key}
          </td>
          <td>
            <button type="button" data-key="${key}" onclick="DeleteVolume(this)">Delete</button>
            <a href="/edit.html#/recent#/${key}">Edit</a>
          </td>
        </tr>
          `
        + Container.innerHTML;
      })
      firstKey = Object.values(snapshot.val())[0]['Volume Data']['CreatedAt'];
      //console.log(firstKey);
    })
  }
  static LMD(Container) {
    // LMD => load more data
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
          `
        <tr>
          <td>
            <img src="${data['Volume Cover']}" alt="${data['Manga Title']}:${data['Volume Number']}" />
          </td>
          <td>
            ${data['Manga Title']}: ${data['Volume Number']} <br />
            File Size: ${data['File Size']} Mb <br />
            Chapters: ${data['Chapters Count'].From}=>${data['Chapters Count'].To} <br />
            ID: ${data.ID} <br />
            Key: ${key}
          </td>
          <td>
            <button type="button" data-key="${key}" onclick="DeleteVolume(this)">Delete</button>
            <a href="/edit.html#/recent#/${key}">Edit</a>
          </td>
        </tr>
          `
        + Container.innerHTML;
      })
      firstKey = Object.values(snapshot.val())[0]['Volume Data']['CreatedAt'];
    })
  }
  static List(Container) {
    const databaseRef = ref(database, List);
    const databaseOrder = query(databaseRef, orderByChild('Title'));
    
    onValue(databaseOrder, (snapshot)=> {
      Container.innerHTML = '';
      snapshot.forEach(snap => {
        const key = snap.key;
        const data = snap.val();
        
        Container.innerHTML +=
          `
        <tr>
          <td>
            <img src="${data.Cover}" alt="${data.Title}" />
          </td>
          <td>
            <span>${data.Title}: ${data.Count}</span> <br />
            Manga State: ${data.State} <br />
          </td>
          <td>
            <button type="button" data-key="${key}" onclick="DeleteManga(this)">Delete</button>
            <a href="/edit.html#/list#/${key}">Edit</a>
          </td>
        </tr>
          `;
      })
    })
  }
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

window.DeleteVolume = DeleteVolume;
window.DeleteManga = DeleteManga;
