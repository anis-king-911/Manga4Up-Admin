function getJSON(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = () => {
    const status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
}

function stringSort( a, b ) {
  if (a.Title < b.Title ) return -1;
  if ( a.Title > b.Title ) return 1;
  return 0;
}

getJSON(url, (error, fileContent)=> {
  if(error) {}
  if(fileContent) {}
})

const ArrayFromObject = Object.entries(object);
const SortedArray = [...ArrayFromObject].sort(stringSort);


let interval = 500, increment = 1;

SortedArray.map(( [key, data] ) => {
  const run = setTimeout(() => {
    console.log({key, data});
    
    clearTimeout(run);
  }, interval * increment);
  increment = increment + 1;
});