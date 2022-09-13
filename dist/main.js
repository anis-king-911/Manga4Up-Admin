import Upload from '/dist/src/Upload.js';
import Update from '/dist/src/Update.js';
import Retrieve from '/dist/src/Retrieve.js';

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

const UpdateVolume = document.querySelector('.UpdateVolume');
const UpdateManga = document.querySelector('.UpdateManga');

const SelectManga = document.querySelector('#SelectManga');
const SoloManga = document.querySelector('.SoloManga');

const SearchByTitle = document.querySelector('.SearchByTitle');
const LoadMore = document.querySelector('.LMP');

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

      let UrlArray =  UploadVolume.VolumeCover.value.split('/');
      let Result = insert(UrlArray, 4, 'tr:w-150');
      let NewUrl = `${Result[0]}/${Result[1]}/${Result[2]}/${Result[3]}/${Result[4]}/${Result[5]}/${Result[6]}/`;
      
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

      Upload.Volume(data);
      setTimeout(()=> {UploadVolume.reset()}, 600);
    })
    
    UploadManga.addEventListener('submit', (event)=> {
      event.preventDefault();
      
      let UrlArray =  UploadManga.LastCover.value.split('/');
      let Result = insert(UrlArray, 4, 'tr:w-150');
      let NewUrl = `${Result[0]}/${Result[1]}/${Result[2]}/${Result[3]}/${Result[4]}/${Result[5]}/${Result[6]}/`;
      
      const data = {
        'Manga Title': UploadManga.MangaTitle.value,
        'Manga State': UploadManga.MangaState.value,
        'Volumes Count': UploadManga.VolumesCount.value,
        'Last Volume': NewUrl,
        'Options': getOptions(UploadManga),
        'CreatedAt': Number(Date.now())
      }
      
      Upload.Manga(data);
      setTimeout(()=> {UploadManga.reset()}, 600);
    })
    
    UploadBlog.addEventListener('submit', (event) => {
      event.preventDefault();
      
     const ProgressBar = UploadBlog.progress.value;
      
      const data = {
        Title: UploadBlog.BlogTitle.value,
        Content: UploadBlog.BlogContent.value,
        Cover: UploadBlog.BlogCover.files[0],
        CreatedAt: Number(Date.now())
      }
      
      Upload.Blog(data, ProgressBar);
      setTimeout(()=> {UploadBlog.reset()}, 600);
    })
    
    
    Retrieve.Recent(EditRecent);
    Retrieve.List(EditList);
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
    
    LoadMore.addEventListener('click', () => {
      Retrieve.LMD(EditRecent);
    })
    
    MangaSelectionList(SelectManga);
  } else if(WindowPATH === '/edit.html' && WindowMODE === '/recent') {
    
    UpdateManga.style.display = 'none';
    GetVolumeData(WindowREF, UpdateVolume);
    GetMangaList(UpdateVolume);
    
    UpdateVolume.addEventListener('submit', (event)=> {
      event.preventDefault();
      let NewUrl;

      if(UpdateVolume.VolumeCover.value.match('tr:w-150') === null) {
        let UrlArray =  UpdateVolume.VolumeCover.value.split('/');
        let Result = insert(UrlArray, 4, 'tr:w-150');
        NewUrl = `${Result[0]}/${Result[1]}/${Result[2]}/${Result[3]}/${Result[4]}/${Result[5]}/${Result[6]}/`;  
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
        let UrlArray =  UpdateManga.LastCover.value.split('/');
        let Result = insert(UrlArray, 4, 'tr:w-150');
        NewUrl = `${Result[0]}/${Result[1]}/${Result[2]}/${Result[3]}/${Result[4]}/${Result[5]}/${Result[6]}/`;  
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
