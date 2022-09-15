import Update from '/dist/src/Update.js';

import {
  Mangalist, UpComming, SignIn, AuthState,
  GetVolumeData, GetMangaData, GetMangaList,
  MangaSelectionList, MangaSelection, insert,
  GetID, TableSearch, Options, getOptions,
} from '/dist/firebase.js';

const WindowPATH = window.location.pathname;
const WindowMODE = window.location.href.split('#')[1];
const WindowREF = window.location.href.split('/').pop();

const SignInForm = document.querySelector('.SignIn');
const UserContainer = document.querySelector('.UserContainer');

const UploadVolume = document.querySelector('.UploadVolume');
const UploadManga = document.querySelector('.UploadManga');
const UploadBlog = document.querySelector('.UploadBlog');

const EditRecent = document.querySelector('.EditRecent');
const EditList = document.querySelector('.EditList');
const EditBlogs = document.querySelector('.EditBlogs')

const UpdateVolume = document.querySelector('.UpdateVolume');
const UpdateManga = document.querySelector('.UpdateManga');

const SelectManga = document.querySelector('#SelectManga');
const SoloManga = document.querySelector('.SoloManga');

const SearchByTitle = document.querySelector('.SearchByTitle');
const LoadMore = document.querySelector('.LMP');
const LoadLess = document.querySelector('.LLP');

window.onload = ()=> {
  if(WindowPATH === '/index.html' || WindowPATH === '/') {

    GetID(UploadVolume)

    SignInForm.addEventListener('submit', (event)=> {
      event.preventDefault();
      
      const data = {
        email: SignInForm.email.value,
        password: SignInForm.password.value
      }
      
      SignIn(data);
      setTimeout(()=> {SignInForm.reset()}, 600);
    })
    
    UploadVolume.addEventListener('submit', (event)=> {
      event.preventDefault();

      let UrlArray =  UploadVolume.VolumeCover.value;
      let NewUrl = insert(UrlArray.split('/'), 4, 'tr:w-150').join('/');
      
      const data = {
        'ID': UploadVolume.querySelector('em').textContent,
        'Manga Title': UploadVolume.MangaTitle.value,
        'Volume Number': UploadVolume.VolumeNumber.value,
        'Volume Cover': NewUrl,
        'File Size': UploadVolume.FileSize.value,
        'Chapters Count': {
          From: UploadVolume.FromChapter.value,
          To: UploadVolume.ToChapter.value,
        },
        'Download Links': [
          UploadVolume.DLink1.value,
          UploadVolume.DLink2.value
        ],
        'CreatedAt': Number(Date.now())
      }

      import('/dist/src/Upload.js').then((modules) => {
        const { UploadVolumeFunc } = modules;

        UploadVolumeFunc(data);
        setTimeout(()=> {UploadVolume.reset()}, 600);
      })
    })
    
    UploadManga.addEventListener('submit', (event)=> {
      event.preventDefault();
      
      let UrlArray =  UploadManga.LastCover.value;
      let NewUrl = insert(UrlArray.split('/'), 4, 'tr:w-150').join('/');
      
      const data = {
        'Manga Title': UploadManga.MangaTitle.value,
        'Manga State': UploadManga.MangaState.value,
        'Volumes Count': UploadManga.VolumesCount.value,
        'Last Volume': NewUrl,
        'Options': getOptions(UploadManga),
        'CreatedAt': Number(Date.now())
      }
      
      import('/dist/src/Upload.js').then((modules) => {
        const { UploadMangaFunc } = modules;

        UploadMangaFunc(data);
        setTimeout(()=> {UploadManga.reset()}, 600);
      })
    })
    
    UploadBlog.addEventListener('submit', (event) => {
      event.preventDefault();
      
     const ProgressBar = UploadBlog.querySelector('#progress');
      
      const data = {
        Title: UploadBlog.BlogTitle.value,
        Content: UploadBlog.BlogContent.value,
        Cover: UploadBlog.BlogCover.files[0],
        CreatedAt: Number(Date.now())
      }
      
      import('/dist/src/Upload.js').then((modules) => {
        const { UploadBlogFunc } = modules;

        UploadBlogFunc(data, ProgressBar);
        setTimeout(()=> {UploadBlog.reset()}, 600);
      })
    })
    
    import('/dist/src/Retrieve.js').then((modules) => {
      const {
        RetrieveRecent, RetrieveList, RetrieveBlogs
      } = modules;

      RetrieveRecent(EditRecent);
      RetrieveList(EditList);
      RetrieveBlogs(EditBlogs);
    })
    
    AuthState(UserContainer, SignInForm);
    
    Mangalist.map(manga => {
      UploadVolume.MangaTitle.innerHTML +=
        `<option value="${manga}">${manga}</option>`;
    })

    UpComming.map(newManga => {
      UploadManga.MangaTitle.innerHTML +=
        `<option value="${newManga}">${newManga}</option>`;
    })
    
    Options.map(Option => {
      UploadManga.querySelector('.Options').innerHTML +=
        `
      <label class="choice">
        <input type="checkbox" name="${Option}" />
        <span>${Option}</span>
      </label>
        `;
    })
    
    SelectManga.addEventListener('change', (event)=> {
      MangaSelection(event.target.value, SoloManga);
    })
    
    SearchByTitle.addEventListener('keyup', () => {
      TableSearch();
    })
    
    /* Pagination Start */

    LoadMore.addEventListener('click', async () => {
      await import('/dist/src/Retrieve.js').then((modules) => {
        const { RetrieveLoadMore } = modules;
  
        RetrieveLoadMore(EditRecent);
      })
    })
    LoadLess.addEventListener('click', async () => {
      await import('/dist/src/Retrieve.js').then((modules) => {
        const { RetrieveLoadLess } = modules;
  
        RetrieveLoadLess(EditRecent);
      })
    })

    /* Pagination End */
    
    MangaSelectionList(SelectManga);
  } else if(WindowPATH === '/edit.html' && WindowMODE === '/recent') {
    
    UpdateManga.style.display = 'none';
    GetVolumeData(WindowREF, UpdateVolume);
    GetMangaList(UpdateVolume);
    
    UpdateVolume.addEventListener('submit', (event)=> {
      event.preventDefault();
      let NewUrl;

      if(UpdateVolume.VolumeCover.value.match('tr:w-150') === null) {
        let OldUrl =  UpdateVolume.VolumeCover.value;
        NewUrl = insert(OldUrl.split('/'), 4, 'tr:w-150').join('/');
      } else {
        NewUrl = UpdateVolume.VolumeCover.value;
      }

      const data = {
        'Manga Title': UpdateVolume.MangaTitle.value,
        'Volume Number': UpdateVolume.VolumeNumber.value,
        'Volume Cover': NewUrl,
        'File Size': UpdateVolume.FileSize.value,
        'Chapters Count': {
          From: UpdateVolume.FromChapter.value,
          To: UpdateVolume.ToChapter.value,
        },
        'Download Links': [
          UpdateVolume.DLink1.value,
          UpdateVolume.DLink2.value
        ],
      };
      
      Update.Volume(WindowREF, data);
      setTimeout(()=> window.location.assign('/'))
    })
    
  } else if(WindowPATH === '/edit.html' && WindowMODE === '/list') {
    
    UpdateVolume.style.display = 'none';
    GetMangaData(WindowREF, UpdateManga);
    GetMangaList(UpdateManga);
    
    Options.map(Option => {
      UpdateManga.querySelector('.Options').innerHTML +=
        `
      <label class="choice">
        <input type="checkbox" name="${Option}" />
        <span>${Option}</span>
      </label>
        `;
    })
    
    UpdateManga.addEventListener('submit', (event)=> {
      event.preventDefault();
      let NewUrl;

      if(UpdateManga.LastCover.value.match('tr:w-150') === null) {
        let OldUrl = UpdateManga.LastCover.value;
        NewUrl = insert(OldUrl.split('/'), 4, 'tr:w-150').join('/');
      } else {
        NewUrl = UpdateManga.LastCover.value;
      }
      
      const data = {
        'Manga Title': UpdateManga.MangaTitle.value,
        'Manga State': UpdateManga.MangaState.value,
        'Volumes Count': UpdateManga.VolumesCount.value,
        'Options': getOptions(UpdateManga),
        'Last Volume': NewUrl,
      };
      
      Update.Manga(WindowREF, data);
      setTimeout(()=> window.location.assign('/'))
    })
    
  }
}
