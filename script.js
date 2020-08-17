// Event handler for Pressing enter in search box and click in search button
document.getElementById('search-music').addEventListener('click', searchMusic);

const inputMusic = document.getElementById('input-music');

inputMusic.addEventListener('keypress', function(){
    if(event.keyCode === 13){
        searchMusic();
    }
})

function searchMusic(){
    // Clearing the song list and about/lyrics section
    document.getElementById('all-results').innerHTML = '';
    document.getElementById('lyrics-or-details').innerHTML = '';
    const keyword = inputMusic.value;
    fetch(`https://api.lyrics.ovh/suggest/${keyword}`)
    .then(res => res.json())
    .then(data => {   
        // Data is stored for using in getDetails and getLyrics function
        storedData = data;
        console.log(data);
        for (let i = 0; i < data.data.length; i++) {
            const title = data.data[i].title;
            const artistName = data.data[i].artist.name;
            const id = data.data[i].id;
            document.getElementById('all-results').innerHTML += `<div class="single-result row align-items-center my-3 p-3">
                                                                    <div class="col-md-6">
                                                                        <h3 class="lyrics-name">${title}</h3>
                                                                        <p class="author lead">Album by <span>${artistName}</span></p>
                                                                    </div>
                                                                    <div class="col-md-6 text-md-right text-center">
                                                                        <a href="#lyrics-or-details"><button onClick="getDetails(${id})" class="btn btn-success">Get Details</button></a>
                                                                        <a href="#lyrics-or-details"><button onClick="getLyrics(${id})" class="btn btn-success">Get Lyrics</button></a>
                                                                    </div>
                                                                </div>`
            // Not to show more than 10 songs
            if(i == 9){
                break;
            }   
        }
        
    })
}

function getDetails(id){
    for (let i = 0; i < 10; i++) {
        if(storedData.data[i].id == id){
            const songID = storedData.data[i].album.id;
            const duration = storedData.data[i].duration;
            // const duration = 15000;
            const hour = parseInt(duration/3600);
            const min = parseInt((duration%3600)/60);
            const sec = parseInt((duration%3600)%60);
            // console.log(hour, min, sec);
            const songTitle = storedData.data[i].title;
            const artistName = storedData.data[i].artist.name;
            const img = storedData.data[i].album.cover_big;
            const download = storedData.data[i].link;
            const preview = storedData.data[i].preview;
            console.log(preview);
            document.getElementById('lyrics-or-details').innerHTML = `<div class="details">
                                                                        <h2 class="text-success mb-4">Song Details</h2>
                                                                        <img src="${img}" alt="">
                                                                        <h3>Song ID: ${songID}</h3>
                                                                        <h3>Song Title: ${songTitle}</>
                                                                        <h3>Artist Name: ${artistName}</h3>
                                                                    </div>`
            if(hour == 0 && min == 0){
                document.getElementById('lyrics-or-details').innerHTML += `<div class="details">
                                                                            <h3>Duration: ${sec} sec</h3>
                                                                        </div>`
            }
            else if(hour == 0){
                document.getElementById('lyrics-or-details').innerHTML += `<div class="details">
                                                                            <h3>Duration: ${min} min ${sec} sec</h3>
                                                                        </div>`
            }
            else{
                document.getElementById('lyrics-or-details').innerHTML += `<div class="details">
                                                                            <h3>Duration: ${hour} hour ${min} min ${sec} sec</h3>
                                                                        </div>`
            }
                                                                        
            document.getElementById('lyrics-or-details').innerHTML += `<div class="details">
                                                                        <h3><a target="_blank" href="${download}">Click me for song download</a></h3>
                                                                        <h3 class="preview"><a target="_blank" href="${preview}">Click me for song preview</a></h3>
                                                                    </div>`
        }
    }
}




function getLyrics(id){
    for (let i = 0; i < 10; i++) {
        if(storedData.data[i].id == id){
            const artistName = storedData.data[i].artist.name;
            const songTitle = storedData.data[i].title;
            fetch(`https://api.lyrics.ovh/v1/${artistName}/${songTitle}`)
            .then(res => res.json())
            .then(data => {
                let lyrics = data.lyrics;
                if(lyrics == undefined){
                    lyrics = `Song Lyrics Not Found. Try for another song`;
                }
                document.getElementById('lyrics-or-details').innerHTML = `<div class="single-lyrics text-center">
                                                                            <button class="btn go-back">&lsaquo;</button>
                                                                            <h2 class="text-success mb-4">Song Lyrics</h2>
                                                                            <h5>${lyrics}</h5>
                                                                        </div>`
            })
            
            
        }
    }
    
}

