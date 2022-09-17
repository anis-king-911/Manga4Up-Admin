import {
  database, storage, Manga4Up, List, size,
  ref, child, onValue, set, push, update, remove, 
  query, orderByChild, limitToLast,
  cloud, listAll, getDownloadURL,
  uploadBytesResumable,
} from '/dist/firebase.js';

function UpdateVolumeFunc(id, data) {
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
    setTimeout(() => {window.location.assign('/')}, 600);
  }).catch((error) => {
    console.log(error);
  })
}
function UpdateMangaFunc(id, data) {
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
    setTimeout(() => {window.location.assign('/')}, 600);
  }).catch((error) => {
    console.log(error);
  })
}
function UpdateBlogFunc(id, data, progressState) {
  const Extension = data.Cover.name.split('.').pop();
  const FileNewName = `${data.UpdatedAt}.${Extension}`;
  
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
        
      const databaseRef = ref(database, `blog/`);
      const databaseChild = child(databaseRef, `${id}/`);
        
      update(databaseChild, {
        Title: data.Title,
        Content: data.Content,
        Image: downloadURL,
      }).then(() => {
        console.log('Blog Updated Successfully');
        setTimeout(() => {window.location.assign('/')}, 600);
        progressState.value = 0;
      }).catch((error) => {
        console.log(error);
      })
    });
  });
}



export {
  UpdateVolumeFunc, UpdateMangaFunc, UpdateBlogFunc
}
