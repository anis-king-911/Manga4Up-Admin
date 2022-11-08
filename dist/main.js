import {
  Mangalist, UpComming, insert, AvailableMangaList,
  GetID, TableSearch, Options, getOptions, TableFilter,
} from '/dist/scripts/firebase.js';

const loading = document.querySelector('.load');

const WindowPATH = window.location.pathname;
const WindowMODE = window.location.href.split('#')[1];
const WindowREF = window.location.href.split('/').pop();

const SignInForm = document.querySelector('.SignIn');
const UserContainer = document.querySelector('.UserContainer');

const UploadVolume = document.querySelector('.UploadVolume');
const UploadManga = document.querySelector('.UploadManga');
const UploadBlog = document.querySelector('.UploadBlog');

const tbodys = document.querySelectorAll('tbody');
const EditRecent = document.querySelector('.EditRecent');
const EditList = document.querySelector('.EditList');
const EditBlogs = document.querySelector('.EditBlogs')

const UpdateVolume = document.querySelector('.UpdateVolume');
const UpdateManga = document.querySelector('.UpdateManga');
const UpdateBlog = document.querySelector('.UpdateBlog');

const SoloManga = document.querySelector('.SoloManga');
const ToDosForm = document.querySelector('.UploadToDo');
const ToDosContainer = document.querySelector('.ToDos');

const SearchByTitle = document.querySelector('.SearchByTitle');
const SearchByState = document.querySelector('.SearchByState');
const FilterByOptions = document.querySelectorAll('[data-filter]');
const LoadOldDataBtn = document.querySelector('.LMP');
const LoadNewDataBtn = document.querySelector('.LLP');

const SortingBtns = document.querySelectorAll('[data-sort]');

window.onload = ()=> {
  if(WindowPATH === '/index.html' || WindowPATH === '/') {

    const navLinks = Array.from(document.querySelectorAll('.links button'));
    const OpenSide = document.querySelector('.OpenSide');
    const blur = document.querySelector('.blur');
    const nav = document.querySelector('nav');
    
    OpenSide.addEventListener('click', (event)=> {
      OpenSide.classList.toggle('act');
      nav.classList.toggle('act');
      blur.classList.toggle('act');
    })
    
    navLinks.forEach(link => {
      link.addEventListener('click', (event)=> {
        OpenSide.classList.toggle('act');
        nav.classList.toggle('act');
        blur.classList.toggle('act');
      })
    })

    GetID(UploadVolume)

    SignInForm.addEventListener('submit', async (event)=> {
      event.preventDefault();
      
      const data = {
        email: SignInForm.email.value,
        password: SignInForm.password.value
      }
      
      const { SignIn } = await import('/dist/scripts/Authentication.js');
      
      SignIn(data);
      setTimeout(()=> {SignInForm.reset()}, 600);
    })
    
    UploadVolume.addEventListener('submit', async (event)=> {
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
      
      const { UploadVolumeFunc } = await import('/dist/scripts/Upload.js');
      
      UploadVolumeFunc(data);
      setTimeout(()=> {UploadVolume.reset()}, 600);
    })
    
    UploadManga.addEventListener('submit', async (event)=> {
      event.preventDefault();
      
      let UrlArray =  UploadManga.LastCover.value;
      let NewUrl = insert(UrlArray.split('/'), 4, 'tr:w-150').join('/');
      
      const data = {
        'Manga Title': UploadManga.MangaTitle.value,
        'Manga State': UploadManga.MangaState.value,
        'Volumes Count': UploadManga.VolumesCount.value,
        'Last Volume': NewUrl,
        'Options': getOptions(UploadManga),
        'CreatedAt': Number(Date.now()),
        'Creation Date': Number(new Date(UploadManga.CreationDate.value).getTime())
      }
      
      const { UploadMangaFunc } = await import('/dist/scripts/Upload.js');

      UploadMangaFunc(data);
      setTimeout(()=> {UploadManga.reset()}, 600);
    })
    
    UploadBlog.addEventListener('submit', async (event) => {
      event.preventDefault();
      
     const ProgressBar = UploadBlog.querySelector('#progress');
      
      const data = {
        Title: UploadBlog.BlogTitle.value,
        Content: UploadBlog.BlogContent.value,
        Cover: UploadBlog.BlogCover.files[0],
        CreatedAt: Number(Date.now())
      }
      
      const { UploadBlogFunc } = await import('/dist/scripts/Upload.js');

      UploadBlogFunc(data, ProgressBar);
      setTimeout(()=> {UploadBlog.reset()}, 600);
    })
    
    ToDosForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const data = {
        ToDo: ToDosForm.ToDo.value,
        CreatedAt: Date.now()
      }
      
      const { UploadToDo } = await import('/dist/scripts/Upload.js');
      
      UploadToDo(data);
      setTimeout(() => { ToDosForm.reset() }, 600);
    })
    
    
    import('/dist/scripts/Retrieve.js').then((modules) => {
      const {
        RetrieveRecent, RetrieveList_one, RetrieveList_two,
        RetrieveBlogs, RetrieveToDos
      } = modules;

      RetrieveRecent(EditRecent);
      RetrieveList_one(EditList, 'Title');
      RetrieveBlogs(EditBlogs);
      RetrieveToDos(ToDosContainer);
      
      SortingBtns[0].classList.add('active')
      SortingBtns.forEach((btn) => {
        btn.addEventListener('click', (event) => {
          SortingBtns.forEach(btn => btn.classList.remove('active'))
          btn.classList.add('active')

          let SortingType = btn.getAttribute('data-sort');
          let rev = btn.textContent.split(' ').at(0)

          if(btn.textContent.match('>')) {
            RetrieveList_two(EditList, SortingType);
            btn.textContent = `${rev} <`;
          } else {
            RetrieveList_one(EditList, SortingType);
            btn.textContent = `${rev} >`;
          }

        })
      })
      // filter by options
      
    })
    
    FilterByOptions.forEach((btn) => {
      const option = btn.getAttribute('data-filter');
      
      btn.addEventListener('click', async () => {
        const {
          RetrieveFiltered
        } = await import('/dist/scripts/Retrieve.js');
        
        RetrieveFiltered(EditList, option);
      })
    });
    
    import('/dist/scripts/Authentication.js').then((modules) => {
      const { AuthState } = modules;
      
      AuthState(UserContainer, SignInForm);
    })
    
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
    
    SearchByTitle.addEventListener('keyup', () => {
      TableSearch();
    })
    
    SearchByState.addEventListener('change', (event) => {
      TableFilter(SearchByState.value)
    })
    TableFilter(SearchByState.value)

    /* Pagination Start */

    LoadOldDataBtn.addEventListener('click', async () => {
      const { RetrieveOldData } = await import('/dist/scripts/Retrieve.js');
      RetrieveOldData(EditRecent);
    })
    LoadNewDataBtn.addEventListener('click', async () => {
      const { RetrieveNewData } = await import('/dist/scripts/Retrieve.js');
      RetrieveNewData(EditRecent);
    })

    /* Pagination End */
    
    /* Loading Operation Start */
    
    tbodys.forEach((tbody) => {
      let load = setInterval(() => {
        if(tbody.childNodes.length !== 0) {
          loading.style.display = 'none';
          clearInterval(load);
        }
      }, 100)
    })
    
    /* Loading Operation End */
    
  } else if(WindowPATH === '/solo.html' && WindowMODE !== undefined) {
    
    let load = setInterval(() => {
      if(SoloManga.childNodes.length !== 0) {
        loading.style.display = 'none';
        clearInterval(load);
      }
    }, 100)
    
    import('/dist/scripts/Retrieve.js').then((modules) => {
      const { RetrieveSolo } = modules;
      
      RetrieveSolo(SoloManga, WindowREF);
    })
    
  } else if(WindowPATH === '/edit.html' && WindowMODE === '/recent') {
    
    let load = setInterval(() => {
      if(UpdateVolume.MangaTitle.childNodes.length !== 0) {
        loading.style.display = 'none';
        clearInterval(load);
      }
    }, 100)
    
    UpdateManga.style.display = 'none';
    UpdateBlog.style.display = 'none';
    AvailableMangaList(UpdateVolume.MangaTitle);
    
    import('/dist/scripts/Edit.js').then((modules) => {
      const { GetVolumeData } = modules;
      
      GetVolumeData(WindowREF, UpdateVolume);
    })
    
    UpdateVolume.addEventListener('submit', async (event)=> {
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
      
      const { UpdateVolumeFunc } = await import('/dist/scripts/Update.js');
      UpdateVolumeFunc(WindowREF, data);
    })
    
  } else if(WindowPATH === '/edit.html' && WindowMODE === '/list') {
    
    let load = setInterval(() => {
      if(UpdateManga.MangaTitle.childNodes.length !== 0) {
        loading.style.display = 'none';
        clearInterval(load);
      }
    }, 100)
    
    UpdateVolume.style.display = 'none';
    UpdateBlog.style.display = 'none';
    AvailableMangaList(UpdateManga.MangaTitle);
    
    import('/dist/scripts/Edit.js').then((modules) => {
      const { GetMangaData } = modules;
      
      GetMangaData(WindowREF, UpdateManga);
    })
    
    Options.map(Option => {
      UpdateManga.querySelector('.Options').innerHTML +=
        `
      <label class="choice">
        <input type="checkbox" name="${Option}" />
        <span>${Option}</span>
      </label>
        `;
    })
    
    UpdateManga.addEventListener('submit', async (event)=> {
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
        'Creation Date': Number(new Date(UpdateManga.CreationDate.value).getTime())
      };
      
      const { UpdateMangaFunc } = await import('/dist/scripts/Update.js');
      UpdateMangaFunc(WindowREF, data);
    })
    
  } else if(WindowPATH === '/edit.html' && WindowMODE === '/blog') {
    
    UpdateVolume.style.display = 'none';
    UpdateManga.style.display = 'none';
    
    import('/dist/scripts/Edit.js').then((modules) => {
      const { GetBlogData } = modules;
      
      GetBlogData(WindowREF, UpdateBlog);
    })
    
    UpdateBlog.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const ProgressBar = UpdateBlog.querySelector('#progress');
      
      const data = {
        Title: UpdateBlog.BlogTitle.value,
        Content: UpdateBlog.BlogContent.value,
        Cover: UpdateBlog.BlogCover.files[0],
        UpdatedAt: Number(Date.now())
      }
      
      const { UpdateBlogFunc } = await import('/dist/scripts/Update.js');
      UpdateBlogFunc(WindowREF, data, ProgressBar);
    })
    
  } else {
    window.location.assign('/');
  }
}









//let run = setInterval(() => {llp.click()}, 800);
//clearInterval(run);
