import {
  database, storage, Manga4Up, List, ToDos, size,
  ref, child, onValue, set, push, update, remove, 
  query, orderByChild, limitToLast,
  cloud, listAll, getDownloadURL,
  uploadBytesResumable,
} from '/dist/firebase.js';

function UploadVolumeFunc(data) {
  const databaseRef = ref(database, Manga4Up);
  const databaseChild = child(databaseRef, `${data['CreatedAt']}/Volume Data`);
  
  set(databaseChild, {
    'ID': Number(data['ID']),
    'Manga Title': data['Manga Title'],
    'Volume Number': data['Volume Number'],
    'File Size': data['File Size'],
    'Volume Cover': data['Volume Cover'],
    'Download Links': data['Download Links'],
    'Chapters Count': {
      From: data['Chapters Count'].From,
      To: data['Chapters Count'].To
    },
    'CreatedAt': String(data['CreatedAt'])
  }).then(() => {
    console.log('Volume Add Successfully');
  }).catch((error) => {
    console.log(error);
  })
}
function UploadMangaFunc(data) {
  const databaseRef = ref(database, List);
  const databasePush = push(databaseRef);
  
  set(databasePush, {
    Title: data['Manga Title'],
    State: data['Manga State'],
    Count: data['Volumes Count'],
    Cover: data['Last Volume'],
    Options: data['Options'],
    Time: Number(data['CreatedAt']),
    CreationDate: Number(data['Creation Date'])
  }).then(() => {
    console.log('Manga Add Successfully');
  }).catch((error) => {
    console.log(error);
  })
}
function UploadBlogFunc(data, progressState) {
  const Extension = data.Cover.name.split('.').pop();
  const FileNewName = `${data.CreatedAt}.${Extension}`;
  
  const storageRef = cloud(storage, `blog/${FileNewName}`);
  const storageTask = uploadBytesResumable(storageRef, data.Cover);
  
  storageTask.on('state_changed', (snapshot) => {
    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log(`Upload is running ${progress}%`);
        progressState.value = progress;
        break;
    }
  }, (error) => {
    console.log(error)
  }, () => {
    getDownloadURL(storageTask.snapshot.ref).then((downloadURL) => {
        
      const database_ref = ref(database, `blog/`);
      const database_push = push(database_ref);
        
      set(database_push, {
        Title: data.Title,
        Content: data.Content,
        Image: downloadURL,
        Date: data.CreatedAt
      }).then(() => {
        console.log('Blog Add Successfully');
        progressState.value = 0;
      }).catch((error) => {
        console.log(error);
      })
    });
  });
}
function UploadToDo(data) {
  const { ToDo, CreatedAt } = data;
  
  const databaseRef = ref(database, ToDos);
  const databaseChild = push(databaseRef);
  
  set(databaseChild, { ToDo, CreatedAt })
    .then(() => console.log('operation done'))
    .catch(error => console.log(error))
}

export {
  UploadVolumeFunc, UploadMangaFunc, UploadBlogFunc, UploadToDo,
}
