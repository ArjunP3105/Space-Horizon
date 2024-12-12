document.addEventListener('DOMContentLoaded',() =>{

    document.addEventListener('click',(event) =>{
        
        const clicked = event.target;
        if(clicked.closest(".news-options-container")){
            news()
        }

        //admin page selection
    
        if(clicked.closest("#nav-c")){
            console.log("calendar clicked");
            document.querySelector('#nav-c').style.color = "#0A84FF";
            document.querySelector('#nav-b').style.color = "grey";
            document.querySelector('#calendar').style.display = "block";
            document.querySelector('.user-bookmark').style.display = "none";
            document.querySelector('.notification-center').style.display = "none";

        }

        if(clicked.closest('#nav-b')){
            console.log('bookmark cliked');
            document.querySelector('#nav-c').style.color = "grey";
            document.querySelector('#nav-b').style.color = "#0A84FF";
            document.querySelector('#calendar').style.display = "none";
            document.querySelector('.user-bookmark').style.display = "block";
            document.querySelector('.notification-center').style.display = "none";
            bookmark_news();

        }
        if(clicked.closest(".noti-logo")){
            user_noti();
        }
        else if(!clicked.closest('.clearing')){
            document.querySelector('.notification-center').style.display = "none";
        }
        if(clicked.closest('#username_page')){
            document.querySelector('#username_page').style.color = "#0A84FF";
            document.querySelector('#allpost').style.color = 'grey';
        }
    })
})
// top headlines
function news(currpage = 1){

    document.querySelector('.events').style.display = "none";
    document.querySelector('.event-header').style.display = "none";
    document.querySelector('.inner-event').style.display = "none";
    document.querySelector('#calendar').style.display = "none";
    document.querySelector('.user').style.display = "none"
    document.querySelector('.paginator').style.display = "none";
    document.querySelector('.quote-container').style.display = "none";
    document.querySelector('.selection').style.display = "none";
    document.querySelector('.topnews').style.display = "block";
    document.querySelector('.news-h').style.display = "block";
    document.querySelector('.inner-news').style.display = "none";
    document.querySelector('.allnews').style.display = "block";
    document.querySelector('.option').style.display = "none";
    document.querySelector('.notification-center').style.display = "none";
    document.querySelector('#allpost').style.color = 'grey';
    document.querySelector('.date').style.display = "none";
    document.querySelector('.topnews').innerHTML = "";
    document.querySelector('.body').style.background = 'white';

    fetch('top',{method:"POST",headers:{
        "Content-Type":"application/json"
    },body:JSON.stringify({
        "page":currpage
    })}).then(response => response.json()).then(item=> {
        const news = item.news;
        console.log(news);
        current = item.curr_page;
        max = item.max;
        news.forEach(data => {
            const newsid = data.url
            const date = new Date(data.publishedAt);
            const formattedDate = new Intl.DateTimeFormat('en-US', {
                month: 'short', 
                day: 'numeric',
                year: 'numeric', 
              }).format(date);
            const outer = document.createElement('div');
            outer.className = "outer-news";
            outer.innerHTML = `
                <div class="newscard" data-eventid = "${newsid}"  >
                    <div class="row no-gutters" >
                        <div class="col-md-4" >
                            <img src="${data.urlToImage}" class="newscard-img" alt="${data.title}">
                        </div>
                        <div class="col-md-8">
                            <div class="newscard-body" >
                                <h5 class="card-title">${data.title}</h5>
                                <p class="card-text">Author : ${data.author || 'none'}</p>
                                <p class = "newscard-date">Published : ${formattedDate}</p>
                            </div>
                        </div>
                 </div>
                </div>
            `
            document.querySelector('.topnews').append(outer)

            document.querySelector(`.newscard[data-eventid = "${newsid}"]`).onclick = function (){
                news_inner(data,formattedDate);
            }

        })

        pagination_controls(current,max);

    })

    all_news();

}

//inner news content
function news_inner(data,date){
    console.log("inner news clicked",data.title);
    document.querySelector('.events').style.display = "none";
    document.querySelector('.event-header').style.display = "none";
    document.querySelector('.inner-event').style.display = "none";
    document.querySelector('#calendar').style.display = "none";
    document.querySelector('.user').style.display = "none"
    document.querySelector('.paginator').style.display = "none";
    document.querySelector('.quote-container').style.display = "none";
    document.querySelector('.selection').style.display = "none";
    document.querySelector('.topnews').style.display = "none";
    document.querySelector('.news-h').style.display = "none";
    document.querySelector('.inner-news').style.display = "block";
    document.querySelector('.allnews').style.display = "none";
    document.querySelector('.option').style.display = "none";
    document.querySelector('.user-bookmark').style.display = "none";
    document.querySelector('.notification-center').style.display = "none";
    document.querySelector('#allpost').style.color = 'grey';
    document.querySelector('.date').style.display = "none";
    document.querySelector('.body').style.background = 'white';

    document.querySelector('.inner-news').innerHTML = '';

    const inner = document.createElement('div');
        inner.className = "inner_info";
        inner.innerHTML =   `
            <div class = "nfloat-container">
                <div class = "nleft">
                    <h1 class ="ninner-title">${data.title}</h1>
                    <p class = "ninner-description">${data.description}</p>
                    <p class = "ninner-info">${data.content || ''}</p>
                    <form action = "${data.url}">
                    <button class = "read">Read more</button>
                    </form>
                    
                    <p>Author : ${data.author || 'none'}</p>
                    <p class = "inner-date">${date}</p>
                </div>
                <div class = "nright"> 
                    <div class = "bookmarkbtn" data-newsid = "${data.url}"></div>
                    <img src = "${data.urlToImage}" alt = "${data.title}" class = "ninner_img" ></a>
                </div>
            </div>
        `
        document.querySelector('.inner-news').append(inner);
        
        fetch('isauthenticated').then(response => response.json()).then(user => {
            if(user.is_auth){
                fetch(`news_exist`,{
                    method:"POST",headers:{
                        "Content-Type" : "application/json"
                    },body:JSON.stringify({
                        "url":data.url
                    })
                }).then(response => response.json()).then(event =>{
                    console.log(event)
                    if(event.is_exist){
                        const btn = document.createElement('button');
                        btn.className = "newsbook ☆";
                        btn.setAttribute("data-newsid",data.url);
                        btn.textContent = "Bookmarked";
                        btn.id = "post-book";
                        document.querySelector('.bookmarkbtn').append(btn);
                        
                    }
                    else{
                        const btn = document.createElement('button');
                        btn.className = "newsbook";
                        btn.setAttribute("data-newsid",data.url);
                        btn.textContent = "Bookmark 📑";
                        btn.id = "pre-book";
                        document.querySelector('.bookmarkbtn').append(btn);
                        
                    }
                })
            }
        })

        document.querySelector(`.bookmarkbtn[data-newsid = "${data.url}"]`).onclick = function(){
            bookmark(data);
        }
}

//pagination top news
function pagination_controls(current,max){
    const container = document.createElement('container');
    container.className  = "top-cont";
    if(current > 1){
        const prev = document.createElement('button');
        prev.className = "prev-news";
        prev.innerHTML = "<";
        prev.onclick = () => {
            news(current - 1);
        }
        container.appendChild(prev);

    }

    if(current < max){
        const next = document.createElement('button');
        next.className = "nxt-news";
        next.innerHTML = ">";
        next.onclick = () => {
            news(current + 1);
        }
        container.appendChild(next);
    }

    document.querySelector('.outer-news').append(container);
}

//all news
function all_news(curr_page = 1){
    fetch('news',{
        method:"POST",headers:{
            "Content-Type" : "application/json"
        },body:JSON.stringify({
            "page":curr_page
        })
    }).then(response => response.json()).then(item=> {
        document.querySelector('.allnews').innerHTML = '';
        
        const news = item.news;
        console.log(news);
        current = item.curr_page;
        max = item.max;
        news.forEach(data => {
            
            const newsid = data.url
            const date = new Date(data.publishedAt);
            const formattedDate = new Intl.DateTimeFormat('en-US', {
                month: 'short', 
                day: 'numeric',
                year: 'numeric', 
              }).format(date);
            const outer = document.createElement('div');
            outer.className = "all-news";
            outer.innerHTML = `
                <div class="newscard" data-eventid = "${newsid}"  >
                    <div class="row no-gutters" >
                        <div class="col-md-4" >
                            <img src="${data.urlToImage}" class="newscard-img" alt="${data.title}">
                        </div>
                        <div class="col-md-8">
                            <div class="newscard-body" >
                                <h5 class="card-title">${data.title}</h5>
                                <p class="card-text">Author : ${data.author || 'none'}</p>
                                <p class = "newscard-date">Published : ${formattedDate}</p>
                            </div>
                        </div>
                 </div>
                </div>
            `
            document.querySelector('.allnews').append(outer)

            document.querySelector(`.newscard[data-eventid = "${newsid}"]`).onclick = function (){
                news_inner(data,formattedDate);
            }

    })

    const title = document.createElement('h4');
    title.innerHTML = 'Latest Space News';
    title.className = "all-title";
    document.querySelector('.allnews').prepend(title);

    all_pagination_controls(current,max);


    })}

    //pagination top news
    function all_pagination_controls(current,max){
        const container = document.createElement('container');
        container.className  = "alltop-cont";
        if(current > 1){
            const prev = document.createElement('button');
            prev.className = "prev-news";
            prev.innerHTML = "<";
            prev.onclick = () => {
                all_news(current - 1);
            }
            container.appendChild(prev);
    
        }
    
        if(current < max){
            const next = document.createElement('button');
            next.className = "nxt-news";
            next.innerHTML = ">";
            next.onclick = () => {
                all_news(current + 1);
            }
            container.appendChild(next);
        }
    
        document.querySelector('.allnews').append(container);
    }

//add or remove bookmark
function bookmark(data){
    console.log('btn clicked for ', data.title);
    fetch('add_news',{
        method:"POST",headers:{
            "Content-Type" : "application/json"
        },body:JSON.stringify({
            "author" : data.author,
            "description" : data.description,
            "publishedAt" :data.publishedAt,
            "content"  :  data.content,
            "url" : data.url,
            "urlToImage" :data.urlToImage,
            "title" : data.title,
        })
    }).then(response => response.json()).then(news => {
        console.log(news);
        if(news.is_exist){
            const button =  document.querySelector(`.newsbook[data-newsid = "${data.url}"]`);
            button.textContent = 'Bookmarked';
            button.style.color = "white";
            button.style.background = "#edb605";

        }
        else{
            const button =  document.querySelector(`.newsbook[data-newsid = "${data.url}"]`);
            button.textContent = 'Bookmark 📑';
            button.style.color = "white";
            button.style.background = "#0A84FF";
        }
    }).catch(error => {
        console.log(error);
    })
}

//user bookmark

function bookmark_news(){
    document.querySelector('.user-bookmark').innerHTML = '';

    fetch('bookmark_news').then(response => response.json()).then(news => {
        news.forEach(data => {
            const newsid = data.url
            const date = new Date(data.publishedAt);
            const formattedDate = new Intl.DateTimeFormat('en-US', {
                month: 'short', 
                day: 'numeric',
                year: 'numeric', 
              }).format(date);
            const outer = document.createElement('div');
            outer.className = "outer-news";
            outer.innerHTML = `
                <div class="newscard" data-eventid = "${newsid}"  >
                    <div class="row no-gutters" >
                        <div class="col-md-4" >
                            <img src="${data.urlToImage}" class="newscard-img" alt="${data.title}">
                        </div>
                        <div class="col-md-8">
                            <div class="newscard-body" >
                                <h5 class="card-title">${data.title}</h5>
                                <p class="card-text">Author : ${data.author || 'none'}</p>
                                <p class = "newscard-date">Published : ${formattedDate}</p>
                            </div>
                        </div>
                 </div>
                </div>
            `
            document.querySelector('.user-bookmark').append(outer)
    
            document.querySelector(`.newscard[data-eventid = "${newsid}"]`).onclick = function (){
                news_inner(data,formattedDate);
            }
        })
    })
}

//load notification

function  user_noti(){
    document.querySelector('.notification-center').innerHTML = '';
    console.log("noti clicked");
    document.querySelector('.notification-center').style.display = "block";
    fetch('notification').then(response => response.json()).then(data => {
        if(data.count > 0){
            const event =  data.event;
            console.log(event);
            event.forEach(noti => {
                const container = document.createElement('div');
                container.className = "noti-info";
                container.setAttribute("data-id",`${noti.event__pk}`)
                container.innerHTML =  `
                <p><strong>Don't Miss This Celestial Event!:${noti.event__title}</strong></p>
                <p>${noti.event__title} has begun on ${noti.event__date}</p>
                `;
                document.querySelector('.notification-center').append(container);
                document.querySelector(`.noti-info[data-id = "${noti.event__pk}"]`).onclick = function(){
                    const id = document.querySelector(`.noti-info[data-id = "${noti.event__pk}"]`).getAttribute('data-id');
                    inner_event(id);

                }

            })
        }
        else{
            const message = document.createElement('div');
            message.className = "message";
            message.innerHTML = `<p>Empty..<p>`
            document.querySelector('.notification-center').append(message);
        }
    })
    const clear = document.createElement('div');
    clear.className = "clear";
    clear.innerHTML = `<p class = "clearing"><span class="material-symbols-outlined">delete_sweep</span></p>`;
    document.querySelector('.notification-center').append(clear);
    document.querySelector('.clearing').onclick = function(){
        clear_noti();
    }
    
}

//clear notification

function clear_noti(){
    console.log("clear clicked");
    fetch('clear').then(response => response.json()).then(data => {
        console.log(data);
        if(data.success){
            document.querySelector('.noti-num').innerHTML = '';
            const notification  = document.querySelectorAll('.noti-info');
            notification.forEach(event => {
                event.remove();

            })
            const message = document.createElement('div');
            message.className = "message";
            message.innerHTML = `<p>Empty..<p>`
            document.querySelector('.notification-center').append(message);
            display_noti();
        }
    }).catch(error => {
        console.log(error);
    })
}