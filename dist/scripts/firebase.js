const currentFirebaseVersion = '9.12.1';

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import {
  getDatabase, ref, child, onValue, set, push, update, remove,
  query, orderByChild, limitToLast, endBefore, startAfter, limitToFirst
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js";
import {
  getStorage, ref as cloud, listAll, uploadBytesResumable,
  getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-storage.js";
import {
  getAuth, signInWithEmailAndPassword,
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";

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

let Manga4Up = 'Manga4Up/', List = 'List/', ToDos = 'ToDos/', size = 5;

export {
  database, storage, Manga4Up, List, ToDos, size, Mangalist, UpComming, Options,
  ref, child, onValue, set, push, update, remove, 
  query, orderByChild, limitToLast, endBefore, startAfter, limitToFirst,
  cloud, listAll, getDownloadURL, deleteObject,
  uploadBytesResumable,
  
  auth, signInWithEmailAndPassword, signOut,
  onAuthStateChanged
}

export function AvailableMangaList(Container) {
  const databaseRef = ref(database, List);
  
  onValue(databaseRef, (snapshot)=> {
    snapshot.forEach((snap)=> {
      const data = snap.val();
      
      Container.innerHTML +=
        `<option value="${data.Title}">${data.Title}</option>`;
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

export function TableFilter(c) {
  const books = document.querySelectorAll('[data-state]');

  if(c === 'Show All') c = ''
  books.forEach((book) => {
    book.classList.add('show');
    if(book.getAttribute('data-state').indexOf(c)>-1) book.classList.remove('show');
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

export function ReverseDate(argument) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  let one = new Number(argument);
  let two = new Date(one);
  
  let day = two.getDate();
  let month = months[two.getMonth()];
  let year = two.getFullYear();
  
  return `${year} ${month} ${day}`;
}

export function ReverseDate_V2(argument) {
  let one = new Number(argument);
  let two = new Date(one);
  
  let thre = two.toISOString().split('.')[0];
  return thre;
}

export function ReverseDate_V3(arg) {
  const one = new Number(arg);
  const two = new Date(one);

  const day = two.getDate();
  const month = two.getMonth() + 1;
  const year = two.getFullYear();

  const hour = two.getHours();
  const minute = two.getMinutes();

  const str = `${day}/${month}/${year} - ${hour}:${minute}`;

  return str;
}

const UpComming = [
  '',
  'Zetman',
  'Koe no Katachi',
  'Kimi no Na wa',
  'Ao Haru Ride',
  'Ijiranaide, Nagatoro-san',
  'Tonikaku Kawaii',
  'Fairy Tail',
  '',
  'Kaguya-sama: Love is War',
  'Golem Hearts',
];
const Mangalist = [
  '',
  'Berserk',
  'Vagabond',
  'Blue Lock',
  'Fire Punch',
  'Zetman',
  'Koe no Katachi',
  'Kimi no Na wa',
  'Ao Haru Ride',
  'Ijiranaide, Nagatoro-san',
  'Tonikaku Kawaii',
  'Pumpkin Night',
  'Fairy Tail',
//  'Kaguya-sama: Love is War',
  '',

  'Ao No Exorcist',
  'Black Clover',
  'Boku No Hero Academia',
  'Boruto NNG',
  'Chainsaw Man',
  'Dragon Ball Super',
  'Edens Zero',
  'Fairy Tail 100 Years Quest',
  'Jujutsu Kaisen',
  'Kaiju No. 8',
  "Komi Can't Communicate",
  'Made in Abyss',
  'Noragami',
  'One Punch Man',
  'Record Of Ragnarok',
  'Spy X Family',
  'Tate No Yuusha No Nariagari',
  'The Four Knights of Apocalypse',
  'Tokyo Revengers',
  'Vinland Saga',
];

const Options = [
  'Comming Soon', 'One Shot',
];
