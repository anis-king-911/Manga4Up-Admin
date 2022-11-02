import {
  database, storage, Manga4Up, List, size, ReverseDate_V2,
  ref, child, onValue, set, push, update, remove, 
  query, orderByChild, limitToLast,
  cloud, listAll, getDownloadURL,
  uploadBytesResumable,
} from '/dist/scripts/firebase.js';

function GetVolumeData(id, form) {
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
function GetMangaData(id, form) {
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
      form.CreationDate.value = ReverseDate_V2(data.CreationDate);
      
      if(!data.Options) return

      data.Options.map((Option) => {
        switch(Option) {
          case Option:
            form[Option].checked = true;
          break;
        }
      })

      console.log(data);
      
    }, 2000);
  })
}
function GetBlogData(id, form) {
  const databaseRef = ref(database, 'blog/');
  const databaseChild = child(databaseRef, `${id}/`);
  
  onValue(databaseChild, (snapshot)=> {
    const key = snapshot.key;
    const data = snapshot.val();
    
    setTimeout(()=> {
    
      form.BlogTitle.value = data['Title'];
      form.BlogContent.value = data['Content'];
      form.querySelector('#BlogOldCover').src = data['Image'];
    
    }, 2000);
  })
}

export {
  GetVolumeData, GetMangaData, GetBlogData
}
