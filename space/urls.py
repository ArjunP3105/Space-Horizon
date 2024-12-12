from django.urls import path
from . import views

urlpatterns = [
    path('',views.index,name= "index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path('news',views.news,name="news"),
    path('events',views.events,name="events"),
    path('inner_event/<int:id>',views.inner_event,name="inner_event"),
    path('add_comment',views.add_comments,name="add_comment"),
    path('event_comment/<str:id>',views.event_comment,name="event_comment"),
    path('isauthenticated',views.authenticated,name = "authenticated"),
    path('add_event',views.add_event,name="add_event"),
    path('get_event',views.get_event,name="get_event"),
    path('is_exist/<int:id>',views.is_exist, name="is_exist"),
    path('user_info',views.user_info,name="user_info"),
    path('top',views.top_news,name="top_news"),
    path('add_news',views.add_news,name="add_news"),
    path('news_exist',views.news_exist, name = "news_exist"),
    path('bookmark_news',views.bookmark_news,name="bookmark_news"),
    path('add_noti',views.add_noti, name="add_noti"),
    path('notification',views.notification, name= "notification"),
    path('clear',views.clear_noti,name= "clear"),
    path('filter',views.filter_event,name="filter"),
]