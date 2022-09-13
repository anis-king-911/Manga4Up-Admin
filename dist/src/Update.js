import {
  database, storage, Manga4Up, List, size,
  ref, child, onValue, set, push, update, remove, 
  query, orderByChild, limitToLast,
  cloud, listAll, getDownloadURL,
  uploadBytesResumable,
} from '/dist/firebase.js';

export default class Update {
  static Volume(id, data) {
    const databaseRef = ref(database, Manga4Up);
    const databaseChild = child(databaseRef, `${id}/Volume Data`);
    
    update(databaseChild, {
      'Manga Title': data['Manga Title'],
      'Volume Number': data['Volume Number'],
      'File Size': data['File Size'],
      'Volume Cover': data['Volume Cover'],
      'Download Links': data['Download Links'],
      'Chapters Count': {
        From: data['Chapters Count'].From,
        To: data['Chapters Count'].To
      }
    }).then(() => {
      console.log('Volume Updated Successfully');
    }).catch((error) => {
      console.log(error);
    })
  }
  static Manga(id, data) {
    const databaseRef = ref(database, List);
    const databaseChild = child(databaseRef, `${id}/`);
    
    update(databaseChild, {
      Title: data['Manga Title'],
      State: data['Manga State'],
      Count: data['Volumes Count'],
      Cover: data['Last Volume'],
      Options: data['Options']
    }).then(() => {
      console.log('Manga Updated Successfully');
    }).catch((error) => {
      console.log(error);
    })
  }
}
