import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import {
  getDatabase, ref, child, onValue,
  set, push, update, remove,
  query, orderByChild, limitToLast, limitToFirst
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";

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

let Manga4Up = 'Manga4Up/', List = 'List/', size = 10;
let interval = 800, increment = 1, indexCounter = 1;

function SetNewId() {
  const databaseLimit = query(ref(database, Manga4Up), limitToFirst(16));
  
  onValue(databaseLimit, snapshot => {
    snapshot.forEach( (snap) => {
      const key = snap.key;
      const value = snap.val();
      const data = value['Volume Data'];
      
      const run = setTimeout(() => {
        
        //let str = `${data['Manga Title']}: ${data['Volume Number']}, ID Counter: ${indexCounter++}`;
        //console.log(str);

        /*
        update( child(child(ref(database, Manga4Up), `${key}/`), 'Volume Data/'), {
          ID: indexCounter++
        })
        .then(()=> console.log(`${data['Manga Title']}: ${data['Volume Number']}, ID SET DONE`))
        .catch(error => console.log(error))
        */

        clearTimeout(run);
      }, interval * increment);
        increment = increment + 1;
    })
  })
}

const btn = document.querySelector('.update');

btn.addEventListener('click', () => {
  SetNewId();
})
