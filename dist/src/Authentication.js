import {
  auth, signInWithEmailAndPassword, signOut,
  onAuthStateChanged
} from '/dist/firebase.js';

function SignIn({email, password}) {
  signInWithEmailAndPassword(auth, email, password)
    .catch(error => console.log(error));
}

function SignOut() {
  signOut(auth).catch(error => console.log(error));
}

function AuthState(Container, Form) {
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
      Container.innerHTML = '';
      Form.style.display = 'grid';
    }
  });
}

window.SignOut = SignOut;

export {
  SignIn, AuthState
}
