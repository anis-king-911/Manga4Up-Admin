const firebaseVersion = '9.9.4';

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
import {
  getDatabase, ref, child, onValue,
  set, push, update, remove,
  query, orderByChild, limitToLast,
  endBefore, startAfter, limitToFirst
} from "https://www.gstatic.com/firebasejs/9.9.4/firebase-database.js";
import {
  getStorage, ref as cloud, listAll,
  uploadBytesResumable, getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/9.9.4/firebase-storage.js";
import {
  getAuth, signInWithEmailAndPassword,
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/9.9.4/firebase-auth.js";

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

let Manga4Up = 'Manga4Up/', List = 'List/', size = 3;

export {
  database, storage, Manga4Up, List, size, Mangalist, UpComming, Options,
  ref, child, onValue, set, push, update, remove, 
  query, orderByChild, limitToLast, endBefore, startAfter, limitToFirst,
  cloud, listAll, getDownloadURL, deleteObject,
  uploadBytesResumable,
  
  auth, signInWithEmailAndPassword, signOut,
  onAuthStateChanged
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
//export 

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


export function TableSearch() {
  const inpValue = document.querySelector('.SearchByTitle').value.toUpperCase();
  const tableRows = document.querySelectorAll('.EditList tr');
  
  tableRows.forEach((row) => {
    const cell = row.querySelectorAll('td')[1];
    const span = cell.querySelector('span');
    
    if (span) {
      const title = span.textContent || span.innerText;
      if (title.toUpperCase().indexOf(inpValue) > -1) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    }
  })
}

export function getOptions(form) {
  const TagsOutput = [];
  for (let i = 0; i < form.length; i++) {
    if (form[i].checked) {
      TagsOutput.push(form[i].name);
    }
  }
  return TagsOutput;
}


const UpComming = [
  '',
  'Horimiya',
  'Berserk',
  'Fairy Tail',
  'Fairy Tail Zero',
  'Kiseijuu',
  'Monster',
  '',
  'Kaguya-sama: Love is War',
  'Pumpkin Night',
  'Golem Hearts',
];
const Mangalist = [
  '',
  'Golden Kamuy',
  'Vagabond',
  'Spy X Family',
  'Kaiju No. 8',
  'Horimiya',
  'Berserk',
  'Fairy Tail',
  'Fairy Tail Zero',
  'Kiseijuu',
  'Monster',
//  'Kaguya-sama: Love is War',
  '',

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
  'Tate No Yuusha No Nariagari',
  'The Four Knights of Apocalypse',
  'Tokyo Revengers',
  'Vinland Saga',
];

const Options = [
  'Comming Soon', '+18', 'One Shot',
];
