from django.shortcuts import render
from django.http import HttpResponse,JsonResponse,HttpResponseRedirect
from django.urls import reverse
from datetime import datetime
import requests
from django.contrib.auth import authenticate,login,logout
from .models import User,Events,comments,Add_event,Add_news,Notification
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
import json
from django.db.models import F
from django.core.paginator import Paginator

def index(request):
    return render(request,"space/index.html",{
    })

#function for login 
def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "space/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "space/login.html")

#function for logout
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

#function to regitser new users
def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "space/register.html", {
                "message": "Passwords must match."
            })
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "space/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "space/register.html")

#Retrieves news from the news api based on space using parameters and paginates them
@csrf_exempt
def news(request):
    if request.method == "POST":
        data =  json.loads(request.body)
        curr_page = data.get('page',1)
        url = "https://newsapi.org/v2/everything"
        params = {
        "q": "space OR astronomy OR NASA OR asteroid",
        "apiKey": "436b855d50c840fe9f84ee7f4b69ff27",
        "language": "en",
        }
        top_response = requests.get(url,params)
        if top_response.status_code == 200:
            data = top_response.json().get('articles')
            paginator = Paginator(data,5)
            page = paginator.page(curr_page)
            return JsonResponse({
            "news":page.object_list,
            "curr_page":page.number,
            "max":paginator.num_pages
            },safe=False)
        else:
            return JsonResponse({'error': 'Failed to fetch space news'}, status=400)

#Retrieves top news from the news api and paginates them
@csrf_exempt
def top_news(request):
    if request.method == "POST":
        data =  json.loads(request.body)
        curr_page = data.get('page',1)
        top_url = "https://newsapi.org/v2/top-headlines"
        top_parms = {
        "category": "science", 
        "apiKey": "436b855d50c840fe9f84ee7f4b69ff27",   
        "language": "en",                            
        }
        top_response = requests.get(top_url,top_parms)
        if top_response.status_code == 200:
            data = top_response.json().get('articles')
            paginator = Paginator(data,1)
            page = paginator.page(curr_page)
            return JsonResponse({
            "news":page.object_list,
            "curr_page":page.number,
            "max":paginator.num_pages
            },safe=False)
        else:
            return JsonResponse({'error': 'Failed to fetch space news'}, status=400)

#adds new events into the event model
@csrf_exempt
def events(request):
    if request.method == "POST":
        data = json.loads(request.body)
        curr_page = data.get('curr_page',1)
        events = Events.objects.all().values('id','title','image_url', 'description', 'information' , 'date' , 'location' , 'latitude' ,'longitude','start_date' ).order_by('start_date')
        paginator  = Paginator(events,4)
        page = paginator.page(curr_page)
        return JsonResponse({
            "obj":list(page.object_list),
            "curr_page":page.number,
            "max":paginator.num_pages

        })

#retrieves information about a particular event based on the event id
def inner_event(request,id):
    info = Events.objects.filter(pk = id).values('id','title','image_url', 'description', 'information' , 'date' , 'location' , 'latitude' ,'longitude','start_date' )
    return JsonResponse(list(info),safe=False)

#adds user comments to events
@csrf_exempt
def add_comments(request):
    if request.method == "POST":
        data = json.loads(request.body)
        event_id = data.get('event_id')
        text = data.get('comment')
        event_info = Events.objects.get(pk = event_id)
        curr_user = request.user
        if(curr_user.is_authenticated):
            try:
                comment = comments(event = event_info,comment = text,user = curr_user)
                comment.save()

                return JsonResponse({
                    "success":True,"message":f"{text} added by {curr_user.username}",
                    "username":curr_user.username,"comment":text,"img":curr_user.user_img
                })
            except Events.DoesNotExist:
                return JsonResponse({
                "success":False,"message":"no such event"
                })
        else:
            return JsonResponse({
            "success":False,"message":"log in to comment"
            })
            
#retrieves the comments for each post
def event_comment(request,id):
    try:
        event_info =Events.objects.get(pk = id)
        comment = comments.objects.filter(event = event_info).annotate(username = F('user__username'),img = F('user__user_img')).values('comment','username','date','img').order_by('-date')
        return JsonResponse(list(comment),safe=False)
    except comments.DoesNotExist:
        return JsonResponse({
            "Success":False, "message":"No comments for this event"
        })

#to check if the current user is authenticated or not 
def authenticated(request):
    user = request.user
    isauth = user.is_authenticated
    return JsonResponse({
        "is_auth":isauth
    })

#adds the watchlited event by the current user into the add_event model
@csrf_exempt
def add_event(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_curr = request.user
            date = data.get('date')
            event = data.get('title')
            id = data.get('id')
            is_exist = Add_event.objects.filter(title = event,user = user_curr,start_date = date,event_id = id).first()
            if(not is_exist):   
                add = Add_event(title = event,user = user_curr,start_date = date,event_id = id)
                add.save()
                return JsonResponse({
                             "success":True,"message":f"{event} added on {date}","is_exist":True
                             })
            else:
                is_exist.delete()
                return JsonResponse({
                    "success":True,"message":f"{event} deleted","is_exist":False
                         })
        except Add_event.DoesNotExist:
            return JsonResponse({
                "success":False,"message":"No such event"
            })
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method'})

#retrieves the current users watch listed events  
def get_event(request):
    curr_user = request.user
    user_events = Add_event.objects.filter(user=curr_user).values('title', 'start_date')
    foramted_data = []
    for event in user_events:
        value = {
            "title":event['title'],
            "date" :event['start_date'].isoformat()
        }
        foramted_data.append(value)
    return JsonResponse(foramted_data,safe=False)

#checks if a spefiic event is present in the add_event model
def is_exist(request,id):
    event = Events.objects.get(pk = id)
    title = event.title
    date = event.start_date
    is_exist = Add_event.objects.filter(title = title,user = request.user , start_date = date).exists()
    return JsonResponse({
        "is_exist":is_exist
    })

#retrieves the user information of the current user
def user_info(request):
    curr_user = request.user
    username = curr_user.username
    email = curr_user.email
    img = curr_user.user_img
    return JsonResponse({
        "name":username,"image":img,"email":email
    })

#adds the bookmarked news into the Add_news model
@csrf_exempt
def add_news(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user = request.user
        author = data.get('author')
        description = data.get('description')
        publishedAt = data.get('publishedAt')
        content = data.get('content')
        url = data.get('url')
        urlToImage = data.get('urlToImage')
        title = data.get('title')
        is_exist = Add_news.objects.filter(user = user , author = author , description = description , publishedAt = publishedAt , content = content , url = url , urlToImage = urlToImage ,title = title).exists()
        if not is_exist:
            add = Add_news(user = user , author = author , description = description , publishedAt = publishedAt , content = content , url = url , urlToImage = urlToImage ,title = title)
            add.save()
            return JsonResponse({
                "success":True,"message":f"{title} added for {user.username}","is_exist":True
            })
        else:
            news = Add_news.objects.filter(user = user , author = author , description = description , publishedAt = publishedAt , content = content , url = url , urlToImage = urlToImage ,title = title).first()
            news.delete()
            return JsonResponse({
                "success":True,"message":f"{title} deleted from {user.username}","is_exist":False
            })
    else:
        return JsonResponse({
            "success":False,"message":"Wrong method used"
        })

#checks if a news article is bookmarked by the current user 
@csrf_exempt
def news_exist(request):
    if request.method == "POST":
            data = json.loads(request.body)
            url = data.get('url')
            curr_user = request.user
            is_exist = Add_news.objects.filter(user = curr_user,url = url).exists()
            return JsonResponse({
            "is_exist" : is_exist
             })
    else:
        return JsonResponse({
            "error":"wrong method"
        })

#retrives all the news article that were bookmarked by the current user 
def bookmark_news(request):
    curr_user = request.user
    news = Add_news.objects.filter(user = curr_user).values('author','description','publishedAt','content','url','urlToImage','title')
    return JsonResponse(list(news),safe=False)

#adds the watchlisted events that have begun into the Notification model
@csrf_exempt
def add_noti(request):
    if request.method == "POST":    
        data =  json.loads(request.body)
        event_id = data.get('id')
        event = Events.objects.get(pk = event_id)
        curr_user = request.user
        is_exist = Notification.objects.filter(user = curr_user , event = event).exists()
        if not is_exist:      
            add =  Notification(user = curr_user , event = event)
            add.save()
            return JsonResponse({
                "success":True,"message":"Added to notification"
            })
        else:
            return JsonResponse({
                "success":False,"message":"Already exists"
            })
    else:
        return JsonResponse({
            "success":False,"message":"Wrong method"
        })

#retrieves all the notifications of the current user from the Notification model
def notification(request):
    curr_user = request.user
    events = Notification.objects.filter(user = curr_user).select_related('event').values('event__pk','event__description','event__date','event__start_date','event__title').order_by('-event__start_date')
    eve_count = events.count()
    return JsonResponse({
        "count":eve_count,
        "event":list(events)
    },safe=False)

#function to clear the current users notification and to remove those events from the Add_event model
def clear_noti(request):
    user = request.user
    user_noti = Notification.objects.filter(user = user)
    count = user_noti.count()
    if count > 0:
        for notification in user_noti:
            id = notification.event.pk
            event = Add_event.objects.get(event_id = id)
            event.delete()
            notification.delete()
        return JsonResponse({
            "success":True,"message":"Notification Cleared"
        })
    else:
        return JsonResponse({
            "success":False,"message":"No Notification to clear"
        })

#function to filter the events based on date range
@csrf_exempt
def filter_event(request):
    if request.method == "POST":
        data = json.loads(request.body)
        sdate = data.get('sdate')
        edate = data.get('edate')
        try:
            start_date = datetime.strptime(sdate,"%Y-%m-%d").date()
            end_date = datetime.strptime(edate, "%Y-%m-%d").date()
            events = Events.objects.filter(start_date__gte = start_date , start_date__lte = end_date).values('id','title','image_url', 'description', 'information' , 'date' , 'location' , 'latitude' ,'longitude','start_date' ).order_by('start_date')
            return JsonResponse(list(events),safe=False)
        except Events.DoesNotExist :
            return JsonResponse({
                "success":False,"message":"Event dosent exist"
            })
    else:
        return JsonResponse({
                "success":False,"message":"Wrong method"
            })

