document.addEventListener('DOMContentLoaded',()=>{
    document.querySelector('.events').style.display = "none";
    document.querySelector('.event-header').style.display = "none";
    document.querySelector('.inner-event').style.display = "none";
    document.querySelector('#calendar').style.display = "none";
    document.querySelector('.user').style.display = "none"
    document.querySelector('.paginator').style.display = "none";
    document.querySelector('.news-h').style.display = "none";
    document.querySelector('.topnews').style.display = "none";
    document.querySelector('.allnews').style.display = "none";
    document.querySelector('.option').style.display = "none";
    document.querySelector('.notification-center').style.display = "none";
    document.querySelector('.date').style.display = "none";


 
    //clicked item
    document.addEventListener('click',(event) => {
        const clicked_item = event.target;
        if(clicked_item.className === "watch-options-container")
        {
            console.log("watch option clicked");
            watch_selction();
        }
        if (clicked_item.closest(".card-body")) {
            const eventId = clicked_item.closest(".card-body").getAttribute("data-eventid");
            inner_event(eventId);
        }

        if(clicked_item.closest("#username_page")){
            const user_id = clicked_item.closest("#username_page").getAttribute("data-userid");
            user_page(user_id);
        }

        if(clicked_item.closest('.refresh')){
            watch_selction();
        }
    })

    //checks for notification and displays
    fetch('isauthenticated').then(response => response.json()).then(user => {
        if(user.is_auth){
            display_noti();

            //checks for notification every 5 minutes
            setInterval(() => {
                fetchwatchlist();
            },300000);
        }
    })  

})

//selection of events

function watch_selction(curr_page  = 1){

    document.querySelector('.events').style.display = "grid"
    document.querySelector('.quote-container').style.display = "none";
    document.querySelector('.selection').style.display = "none";
    document.querySelector('.events').innerHTML = '';
    document.querySelector('.event-header').style.display = "block"
    document.querySelector('.paginator').style.display = "block";
    document.querySelector('.allnews').style.display = "none";
    document.querySelector('.option').style.display = "none";
    document.querySelector('.notification-center').style.display = "none";
    document.querySelector('#allpost').style.color = 'grey';
    document.querySelector('.date').style.display = "flex";
    document.querySelector('.body').style.background = 'white';
    document.querySelector('.news-h').style.display = "none";
    fetch('events',{
        method:"POST",headers:{
            "Content-Type": "application/json"
        },body: JSON.stringify({
            "curr_page":curr_page
        })
    }).then(response => response.json()).then(data => {

        const events = data.obj;
        const curr_page = data.curr_page
        const max = data.max
        events.forEach(event => {

            const id = event.id
            const event_outer = document.createElement('div');
            event_outer.className = "event_outer"
            event_outer.innerHTML = `
            <div class="card" >
                <div class="row no-gutters" >
                    <div class="col-md-4" data-eventid = "${id}">
                        <img src="${event.image_url}" class="card-img" alt="${event.title}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body" data-eventid = "${id}">
                            <h5 class="card-title">${event.title}</h5>
                            <p class="card-text">${event.description}</p>
                        </div>
                    </div>
             </div>
            </div>

            `
            document.querySelector('.events').append(event_outer);
        })
        paginator_controls(curr_page,max);
    })

    document.querySelector('.formatbtn').onclick = function(){
        sort_event();
    }
}

// pagination 
function paginator_controls(curr_page , max){
    document.querySelector('.paginator').innerHTML = "";
    const container = document.createElement('container');
    container.className = "btn-container";

    if(curr_page > 1 ){
        const prev = document.createElement('button');
        prev.className = "prev-btn";
        prev.textContent = "prev"
        prev.onclick = function (){
            watch_selction(curr_page-1);
        }
        container.appendChild(prev);
    }
    for(let i = 1;i <= max;i++){
        const button = document.createElement('button');
        button.className = "paginator-btn";
        button.textContent = i;

        button.onclick = function() {
            watch_selction(i);
        }
        container.appendChild(button);
    }

    if(curr_page < max ){
        const next = document.createElement('button');
        next.className = "next-btn";
        next.textContent = "next";
        next.onclick = function (){
            watch_selction(curr_page + 1);
        }
        container.appendChild(next);
    }


    document.querySelector('.paginator').append(container);

}

//inner event information

function inner_event(eventId){
    document.querySelector('.inner-event').innerHTML = '';
    console.log(`${eventId} clicked`);
    document.querySelector('.events').style.display = "none"
    document.querySelector('.quote-container').style.display = "none";
    document.querySelector('.selection').style.display = "none";
    document.querySelector('.event-header').style.display = "none"
    document.querySelector('.inner-event').style.display = "block";
    document.querySelector('#calendar').style.display = "none";
    document.querySelector('.user').style.display = "none";
    document.querySelector('.paginator').style.display = "none";
    document.querySelector('.allnews').style.display = "none";
    document.querySelector('.option').style.display = "none";
    document.querySelector('.notification-center').style.display = "none";
    document.querySelector('#allpost').style.color = 'grey';
    document.querySelector('.date').style.display = "none";
    document.querySelector('.body').style.background = 'white';
    document.querySelector('.news-h').style.display = "none";


    fetch(`inner_event/${eventId}`).then(response => response.json()).then(event => {
       
        let lat = event[0].latitude;
        let long = event[0].longitude; 
        const inner = document.createElement('div');
        inner.className = "inner_info";
        inner.innerHTML =   `
            <div class = "float-container">
                <div class = "left">
                    <h1 class ="inner-title">${event[0].title}</h1>
                    <p class = "inner-description">${event[0].description}</p>
                    <p class = "inner-date">${event[0].date}</p>
                    <div class = "watchbtn"></div>
                </div>
                <div class = "right">
                    <img src = "${event[0].image_url}" alt = "${event[0].title}" class = "inner_img" ></a>
                </div>
            </div>
            <hr>
            <div class = "lmap">
                    <p class = "inner-info">${event[0].information}</p>
                    <div class = "inner-map">
                        <div id = "map"> </div>
                        <div class = "comments">  
                        <form>
                            <textarea id = "comment-content" placeholder ="Add comment.."></textarea>
                        </form>
                        <div class = "comment-display"></div>
                        </div>
                    </div>
            </div>
        `
        document.querySelector('.inner-event').append(inner);

        fetch('isauthenticated').then(response => response.json()).then(user => {
            if(user.is_auth){
                fetch(`is_exist/${event[0].id}`).then(response => response.json()).then(event =>{
                    if(event.is_exist){
                        const watch_button = document.createElement('div');
                        watch_button.textContent = `Unwatch 📅 `;
                        watch_button.className = "unwatchbtn"
                        document.querySelector('.watchbtn').append(watch_button);
                    }
                    else{
                        const watch_button = document.createElement('div');
                        watch_button.textContent = "Watch 📅";
                        watch_button.className = "watching";
                        document.querySelector('.watchbtn').append(watch_button);
                    }
                })
            }
        })

        var map = L.map('map').setView([lat,long], 5);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {

            maxZoom: 50,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            noWrap: true
        }).addTo(map);
        var marker = L.marker([lat,long]).addTo(map);
        marker.bindPopup(`<b>${event[0].location}</b>`).openPopup();

        display_comments(event[0].id);


        document.addEventListener('click',(eve) =>{
            btnclick = eve.target
            if(btnclick.closest(".watchbtn")){
                const start = event[0].start_date;
                const name = event[0].title;
                const id  = event[0].id;
                add_calender(start,name,id)
            }
        })

        const id = event[0].id;
        const comment = document.querySelector('#comment-content');

        fetch('isauthenticated').then(response => response.json()).then(user => {
            if(user.is_auth){
                comment.addEventListener('keydown',(event) =>{
                    if(event.key === "Enter"){
                        console.log("comment sent");
                        const comment_text = comment.value;
                        console.log(comment_text);
                        comment.value = '';
                        send_comment(id,comment_text);
                    } 
                })
            }
        })

        countdown(event[0].start_date,event[0].id);

    })
}



//posting comments
function send_comment(id,comment){
    fetch('add_comment',{method:"POST",headers:{"Content-Type" : "application/json"},body:JSON.stringify({
        "event_id":id,
        "comment":comment
    })}).then(response => response.json()).then(comments => {
        console.log(comments);
        if(comments.success){
            const new_date = new Date();
            const date = new_date.toLocaleString();
            const comment_section = document.createElement('div')
            comment_section.className = "comment-section"
            comment_section.innerHTML = `
                <div class = "comment-header">
                    <img id = "cmt-img" src = "${comments.img}" alt = "${comments.username}"></a>
                    <p class = "c-name"><strong>${comments.username}</strong></p>
                    <p class = "c-date">${date}<p>
                    <p class = "c-comment">${comments.comment}</p>
                </div>
                `
                document.querySelector('.comment-display').prepend(comment_section);
        }
    }).catch(error => {
        console.log(error);
    })


}

//display comments
function display_comments(id){
    fetch(`event_comment/${id}`).then(response => response.json()).then(comments => {
        comments.forEach(comment =>{
            const new_date = new Date(comment.date);
            const date = new_date.toLocaleString();
            const comment_section = document.createElement('div')
            comment_section.className = "comment-section"
            comment_section.innerHTML = `
                <div class = "comment-header">
                    <img id = "cmt-img" src = "${comment.img}" alt = "${comment.username}"></a>
                    <p class = "c-name"><strong>${comment.username}</strong></p>
                    <p class = "c-date">${date}<p>
                    <p class = "c-comment">${comment.comment}</p>
                </div>
                `
                document.querySelector('.comment-display').append(comment_section);
        })
    })

}
// add to calender

function add_calender(date,name,id){

    const formattedDate = new Date(date).toISOString().split('T')[0];

    fetch("add_event",{
        method:"POST",headers:{"Content-Type":"application/json"},body : JSON.stringify({
            "date":formattedDate,"title":name,"id":id
        })
    }).then(response => response.json()).then(data => {
        console.log(data)
        if(data.is_exist){
            const watch_button = document.querySelector('.watchbtn');
            watch_button.textContent = "Unwatch 📅";
            watch_button.style.background = "#0A84FF";
            watch_button.style.color = "white";
            document.querySelector('.watchbtn').append(watch_button);
        }
        else{
            const watch_button = document.querySelector('.watchbtn');
            watch_button.textContent = "Watch 📅";
            watch_button.style.background = "#f1f0f0";
            watch_button.style.color = "#0A84FF";
            document.querySelector('.watchbtn').append(watch_button);
        }

    }).catch(error => {
        console.log("Error : ",error);
    })
}

//calendar event display

function fetchEvents(fetchInfo, successCallback, failureCallback) {
    fetch('get_event')
        .then(response => response.json())
        .then(events => {
            const formattedEvents = events.map(event => ({
                title: event.title,  
                start: event.date,   
            }));
            successCallback(formattedEvents); 
        })
        .catch(error => { 
            console.error("Error fetching events:", error);
            failureCallback(error); 
        });
}

//User Page

function user_page(user_id){
    document.querySelector('.events').style.display = "none"
    document.querySelector('.quote-container').style.display = "none";
    document.querySelector('.selection').style.display = "none";
    document.querySelector('.event-header').style.display = "none"
    document.querySelector('.inner-event').style.display = "none";
    document.querySelector('.user').style.display = "block";
    document.querySelector('#calendar').style.display = "block";
    document.querySelector('.paginator').style.display = "none";
    document.querySelector('.user').innerHTML = "";
    document.querySelector('.allnews').style.display = "none";
    document.querySelector('.inner-news').style.display = "none";
    document.querySelector('.option').style.display = "block";
    document.querySelector('#nav-c').style.color = "#0A84FF";
    document.querySelector('#nav-b').style.color = "grey";
    document.querySelector('.notification-center').style.display = "none";
    document.querySelector('#allpost').style.color = 'grey';
    document.querySelector('.date').style.display = "none";
    document.querySelector('.body').style.background = 'white';
    document.querySelector('.topnews').style.display = "none";
    document.querySelector('.news-h').style.display = "none";
    
    fetch('isauthenticated').then(response => response.json()).then(user => {
        if(user.is_auth){
        //load calender
        const calendarEl = document.getElementById('calendar')
        const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: { 
            left: 'prev,next today', 
            center: 'title', 
            right: 'dayGridMonth,timeGridWeek' 
        },
        views: {
            dayGridMonth: {
                eventLimit: 3,
            }
        },
        events: fetchEvents,
        })
        calendar.render()
        }


        fetch(`user_info`).then(response => response.json()).then(data => {
            console.log(data);
            const user_info = document.createElement('div');
            user_info.classNames ="userinfo";
            user_info.innerHTML = `<div class = "user-img">
            <img src = "${data.image}" alt = "${data.name}" id = "uimg"></a>
            </div>
            <h3>${data.name}</h3>
            <p id = "mail">${data.email}</p>
            <div class = "user-noti">
            <p class = "noti-logo" ><svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"  x="0" y="0" viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><linearGradient id="a"><stop offset="0" stop-color="#138bd7"></stop><stop offset="1" stop-color="#62aafb"></stop></linearGradient><linearGradient xlink:href="#a" id="b" x1="19" x2="19" y1="2" y2="8" gradientUnits="userSpaceOnUse"></linearGradient><linearGradient xlink:href="#a" id="c" x1="11.5" x2="11.5" y1="3" y2="22" gradientUnits="userSpaceOnUse"></linearGradient><path fill="url(#b)" d="M19 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" opacity="1" data-original="url(#b)"></path><path fill="url(#c)" d="M19.8 9.42c-.02 0-.04.01-.06.01-.1.02-.2.03-.31.05-.42.04-.87.02-1.33-.07-.12-.03-.22-.05-.33-.09-.33-.08-.64-.21-.93-.38-.12-.06-.24-.14-.35-.21-.48-.33-.89-.74-1.22-1.22-.07-.11-.15-.23-.21-.35-.17-.29-.3-.6-.38-.93-.04-.11-.06-.21-.09-.33a4.65 4.65 0 0 1-.07-1.33c.02-.11.03-.21.05-.31 0-.02.01-.04.01-.06A1 1 0 0 0 13.6 3H7.52c-.14 0-.28.01-.41.02-.12.01-.23.02-.35.04-.12.01-.24.03-.35.05-2.41.35-3.95 1.88-4.3 4.3-.02.11-.04.23-.05.35-.02.12-.03.23-.04.35-.01.13-.02.27-.02.41v7.96c0 .14.01.28.02.41.01.12.02.23.04.35.01.12.03.24.05.35.35 2.42 1.89 3.95 4.3 4.3.11.02.23.04.35.05.12.02.23.03.35.04.13.01.27.02.41.02h7.96c.14 0 .28-.01.41-.02.12-.01.23-.02.35-.04.12-.01.24-.03.35-.05 2.41-.35 3.95-1.88 4.3-4.3.02-.11.04-.23.05-.35.02-.12.03-.23.04-.35.01-.13.02-.27.02-.41V10.4a1 1 0 0 0-1.2-.98zM6.75 12.5h5c.41 0 .75.34.75.75s-.34.75-.75.75h-5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75zm9 5.5h-9c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h9c.41 0 .75.34.75.75s-.34.75-.75.75z" opacity="1" data-original="url(#c)" ></path></g></svg></p>
            </div>
            `
            document.querySelector('.user').append(user_info);
        })

    })
}



function fetchwatchlist(){
    fetch('notification').then(response => response.json()).then(data =>{
        if(data.count > 0){
            display_noti(data);
            const events = data.event;
            events.forEach(event => {
                console.log(event);
                const event_date = event.event__start_date;
                const id = event.event__pk;
                countdown(event_date,id);
            })
        }
    })
}


function countdown(date,id){
    const timer = document.createElement('div');
    timer.className = "timer";
    timer.id = `timer-${id}`;

    const interval  = setInterval(() =>{
        const now = new Date();
        const event =  new Date(date)
        const timeleft  = event - now;

        if(timeleft <= 0 ){
            console.log('event over');

            timer.innerHTML =  `<p id = "over">Event Ended</p>`;
    
            fetch(`is_exist/${id}`).then(response => response.json()).then(event =>{


                if(event.is_exist){
                    console.log('event watchlisted for notification');
                    fetch('add_noti',{
                        method:"POST",headers:{
                            "Content-Type":"application/json"
                        },
                        body:JSON.stringify({
                            'id':id
                        })
                    }).then(response => response.json()).then(not => {
                        console.log(not);
                        document.querySelector('#noti-id').innerHTML = '';
                        display_noti();
                    })

                }
            })
            clearInterval(interval);
            return;

        }
        const days = Math.floor(timeleft / (24 * 60 * 60 * 1000 ));
        const hours = Math.floor((timeleft % (24 * 60 * 60 * 1000 ))/ ( 60 * 60 * 1000 ));
        const minutes = Math.floor((timeleft % ( 60 * 60 * 1000 ))/ (60 * 1000 ));
        const seconds = Math.floor((timeleft % ( 60 * 1000 ))/ (1000 ));

        timer.innerHTML =  `
        <div>
         <p>${days}</p> 
        <span>Days</span>
        </div>
        <div>
         <p>${hours}</p> 
        <span>Hours</span>
        </div>
        <div>
         <p>${minutes}</p> 
        <span>Minutes</span>
        </div>

        <div>
         <p>${seconds}</p> 
        <span>Seconds</span>
        </div>
        
        `

    },1000)

    if(document.querySelector('.left')){
        document.querySelector('.left').append(timer);
    }

    
}


//display notification
function display_noti(){

    fetch('notification').then(response => response.json()).then(noti => {
        console.log(noti);
        if(noti.count > 0){
            const noti_exist = document.querySelector('#noti-id');
            if(noti_exist){
                noti_exist.remove();
            }
            console.log("there is notification");
            const noti_num = document.createElement('p');
            noti_num.className = "noti-num";
            noti_num.id = "noti-id";
            noti_num.innerHTML = `${noti.count}
            `;
            document.querySelector('#username_page').append(noti_num);
        }
    })
}

//sorts the events based on date ranges
function sort_event(){
    const start = document.querySelector('#startdate').value;
    const end = document.querySelector('#enddate').value;
    console.log(start,end);
    if(start && end){
        fetch('filter',{method:"POST",headers:{
            "Content-Type":"application/json"
        },body:JSON.stringify({
            "sdate" :start,
            "edate":end
        })}).then(response => response.json()).then(events=> {
            document.querySelector('.events').innerHTML = '';
            document.querySelector('.paginator').innerHTML = '';
            events.forEach(event => {
                const id = event.id
                const event_outer = document.createElement('div');
                event_outer.className = "event_outer"
                event_outer.innerHTML = `
                <div class="card" >
                    <div class="row no-gutters" >
                        <div class="col-md-4" data-eventid = "${id}">
                            <img src="${event.image_url}" class="card-img" alt="${event.title}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body" data-eventid = "${id}">
                                <h5 class="card-title">${event.title}</h5>
                                <p class="card-text">${event.description}</p>
                            </div>
                        </div>
                 </div>
                </div>
    
                `
                document.querySelector('.events').append(event_outer);
            })
        }).catch(error =>{
            console.log(error);
        })
    }
    else{
        alert('Select Start and End date');
    }
}