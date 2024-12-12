from django.contrib import admin
from .models import User,Events,comments,Add_event,Add_news,Notification

# Register your models here.

admin.site.register(User)
admin.site.register(Events)
admin.site.register(comments)
admin.site.register(Add_event)
admin.site.register(Add_news)
admin.site.register(Notification)