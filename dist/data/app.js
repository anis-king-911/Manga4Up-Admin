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

let interval = 500, increment = 1;

getJSON('/dist/data/Manga4Up.json', (error, data) => {
  if (error) { console.log(error) } else {
    Object.entries(data['Manga4Up']).map(([key, value], index) => {
      const run = setTimeout(() => {

        let val = value['Volume Data'];
        
        val.id = index+1;
        //console.log(val);
        
        document.body.innerHTML =
          `${val['Manga Title']}: ${val['Volume Number']} <br />`
        + document.body.innerHTML;
        
        clearTimeout(run);
      }, interval * increment);

      increment = increment + 1;
    })

  }
})
