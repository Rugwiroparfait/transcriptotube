from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db import models



class VideoHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    video_id = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)


