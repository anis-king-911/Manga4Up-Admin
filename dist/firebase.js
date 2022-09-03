import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import {
  getDatabase, ref, child, onValue,
  set, push, update, remove,
  query, orderByChild, limitToLast
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";
import {
  getStorage, ref as cloud, listAll,
  uploadBytesResumable, getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-storage.js";
import {
  getAuth, signInWithEmailAndPassword,
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwI_lwV52VuKJYjeSID811WEv5u2AF70w",
  authDomain: "manga4up-vercel.firebaseapp.com",
  databaseURL: "https://manga4up-vercel-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "manga4up-vercel",
  storageBucket: "manga4up-vercel.appspot.com",
  messagingSenderId: "1063989292418",
  appId: "1:1063989292418:web:427fb5e5422fc4858bf39b"
}

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

let Manga4Up = 'Manga4Up/', List = 'List/', size = 10;

export {
  database, storage, Manga4Up, List, size, Mangalist, UpComming,
  ref, child, onValue, set, push, update, remove, 
  query, orderByChild, limitToLast,
  cloud, listAll, getDownloadURL,
  uploadBytesResumable,
}

export function SignIn({email, password}) {
  signInWithEmailAndPassword(auth, email, password)
    .catch(error => console.log(error));
}

function SignOut() {
  signOut(auth).catch(error => console.log(error));
}

window.SignOut = SignOut;

export function AuthState(Container, Form) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const email = user.email;
      const photo = user.photoURL;
      
      Container.innerHTML = 
        `
      <img src="${photo}" width="100"/>
      <span>${email}</span>
      <button type="button" onclick="SignOut()">sign out</button>
        `;
      Form.style.display = 'none';
    } else {
      //alert('Admin Is Not Signed In');
      Container.innerHTML = '';
      Form.style.display = 'grid';
    }
  });
}

export function GetVolumeData(id, form) {
  const databaseRef = ref(database, Manga4Up);
  const databaseChild = child(databaseRef, `${id}/`);
  
  onValue(databaseChild, (snapshot)=> {
    const key = snapshot.key;
    const value = snapshot.val();
    const data = value['Volume Data'];
    
    setTimeout(()=> {
    
      form.MangaTitle.value = data['Manga Title'];
      form.VolumeNumber.value = data['Volume Number'];
      form.FromChapter.value = data['Chapters Count'].From;
      form.ToChapter.value = data['Chapters Count'].To;
      form.FileSize.value = data['File Size'];
      form.DLink1.value = data['Download Links'][0];
      form.DLink2.value = data['Download Links'][1];
      form.VolumeCover.value = data['Volume Cover'];
    
    }, 2000);
  })
}
export function GetMangaData(id, form) {
  const databaseRef = ref(database, List);
  const databaseChild = child(databaseRef, `${id}/`);
  
  onValue(databaseChild, (snapshot)=> {
    const key = snapshot.key;
    const data = snapshot.val();
    
    setTimeout(()=> {
    
      form.MangaTitle.value = data.Title;
      form.VolumesCount.value = data.Count;
      form.MangaState.value = data.State;
      form.LastCover.value = data.Cover;
      
    }, 2000);
  })
}
export function GetMangaList(form) {
  const databaseRef = ref(database, List);
  
  onValue(databaseRef, (snapshot)=> {
    snapshot.forEach((snap)=> {
      const data = snap.val();
      
      form.querySelector('select').innerHTML +=
        `<option value="${data.Title}">${data.Title}</option>`;
    })
  })
}
export function MangaSelectionList(container) {
  const databaseRef = ref(database, List);
  
  onValue(databaseRef, (snapshot)=> {
    snapshot.forEach((snap)=> {
      const data = snap.val();
      
      container.innerHTML +=
        `<option value="${data.Title}">${data.Title}</option>`;
    })
  })
}
export function MangaSelection(mangaName, tbody) {
  const databaseRef = ref(database, Manga4Up);
  
  onValue(databaseRef, (snapshot) => {
    tbody.innerHTML = '';
    snapshot.forEach((snap) => {
      const key = snap.key;
      const value = snap.val();
      const data = value['Volume Data'];
      const mangaTitle = data['Manga Title'];
  
      if (mangaTitle === mangaName) {
        tbody.innerHTML =
          `
        <tr>
          <td><img src="${data['Volume Cover']}" /></td>
          <td>
            ${data['Manga Title']}: ${data['Volume Number']} <br />
            File Size: ${data['File Size']} Mb <br />
            Chapters: ${data['Chapters Count'].From}=>${data['Chapters Count'].To} <br />
            ID: ${data.ID}
          </td>
          <td>
            <a href="/edit.html#/${key}"><button type="button" style="background: rgba(0, 255, 0, .5)">Edit</button></a>
          </td>
        </tr>
          ` +
        tbody.innerHTML;
      }
    })
  })
}

export function GetID(form) {
  const databaseRef = ref(database, Manga4Up);
  const databaseLimit = query(databaseRef, limitToLast(1));

  onValue(databaseLimit, (snapshot)=> {
    form.querySelector('#VolumeID').innerHTML = ''
    snapshot.forEach((snap)=> {
      const value = snap.val();
      const data = value['Volume Data'];
      
      form.querySelector('#VolumeID').innerHTML = `volume id is going to be [ <em>${data.ID+1}</em> ]`;
    })
  })
}


export const insert = (arr, index, newItem) => [
  ...arr.slice(0, index),
  newItem,
  ...arr.slice(index)
]


const UpComming = [
  '',
  'Horimiya',
  'Kaiju No. 8',
  'Spy X Family',
  'Golden Kamuy',
  'Vagabond',
  'Kaguya-sama: Love is War',
  'Tate No Yuusha No Nariagari',
  'Pumpkin Night',
  'Golem Hearts',
  'Death Note Tokubetsu Yomikiri',
];
const Mangalist = [
  '',
  'Perfect World',
  'Vinland Saga',
  'Golden Kamuy',
  'Vagabond',
//  'Kaguya-sama: Love is War',
  'Tate No Yuusha No Nariagari',
//  'Kaiju No. 8',
//  'Spy X Family',
//  'Horimiya',

  'Ao No Exorcist',
  'Black Clover',
  'Boku No Hero Academia',
  'Boruto NNG',
  'Dragon Ball Super',
  'Edens Zero',
  'Fairy Tail 100 Years Quest',
  'Jujutsu Kaisen',
  "Komi Can't Communicate",
  'Made in Abyss',
  'Noragami',
  'One Punch Man',
  'Record Of Ragnarok',
  'The Four Knights of Apocalypse',
  'Tokyo Revengers',
];
