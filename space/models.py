from django.contrib.auth.models import AbstractUser
from django.db import models
import datetime


class User(AbstractUser):
    user_img = models.CharField(max_length=255, blank=True,null=True,default="https://cdn2.iconfinder.com/data/icons/instagram-ui/48/jee-75-512.png")

class Events(models.Model):
    title = models.CharField(max_length=1000,null=True)
    image_url = models.CharField(max_length=1000,null=True)
    description = models.CharField(max_length=1000,null=True)
    information = models.TextField(max_length=10000, null=True)
    date = models.CharField(max_length=100,null=True)
    location = models.CharField(max_length=500, null=True)
    latitude = models.FloatField(null=True)  
    longitude = models.FloatField(null=True)
    start_date = models.DateField(null=True,blank=True)

    def __str__(self):
        return f"{self.title} on {self.date}"

class comments(models.Model):
    event = models.ForeignKey(Events, on_delete= models.CASCADE,null= True,related_name="comments")
    user = models.ForeignKey(User,on_delete=models.CASCADE,null=True,related_name="user")
    date = models.DateTimeField(default= datetime.datetime.now , null= True)
    comment = models.TextField(max_length=10000,null= True)

    def __str__(self):
        return f"{self.comment} added by {self.user.username} on  {self.event.title} by {self.user.username}"
    
class Add_event(models.Model):
    title = models.CharField(max_length=1000,null=True)
    user = models.ForeignKey(User,related_name="calender",on_delete= models.CASCADE)
    event_id = models.IntegerField(null=True,blank=True)
    start_date = models.DateField(null=True)

    def __str__(self):
        return f"{self.title} added to calender on {self.start_date}"
    
class Add_news(models.Model):
    user = models.ForeignKey(User,related_name= "news_user", on_delete= models.CASCADE)
    author = models.CharField(max_length=1000,null=True)
    description = models.TextField(max_length=1000,null=True)
    publishedAt = models.TextField(max_length= 1000,null=True)
    content = models.TextField(max_length=1000,null=True)
    url = models.TextField(max_length=1000,null=True)
    urlToImage = models.TextField(max_length=1000,null=True)
    title =  models.CharField(max_length=1000,null=True)

    def __str__(self):
        return f"{self.title} by {self.author}"

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete= models.CASCADE, null= True , related_name="noti_user")
    event = models.ForeignKey(Events, on_delete= models.CASCADE, null= True , related_name="noti_event")

    def __str__(self):
        return f"{self.event.title} added to {self.user.username} notification"