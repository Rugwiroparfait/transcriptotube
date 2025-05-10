from django.shortcuts import render, redirect
from .forms import RegisterForm
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from youtube_transcript_api import YouTubeTranscriptApi
import re
from .models import VideoHistory



def register_view(request):
    """
    Handles user registration.
    """
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = RegisterForm()
    return render(request, "register.html", {"form": form})


def login_view(request):
    """
    Handles user login.
    """
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, "Login successful!")
                return redirect('home')  # Replace 'home' with your desired redirect URL
            else:
                messages.error(request, "Invalid username or password.")
        else:
            messages.error(request, "Invalid username or password.")
    else:
        form = AuthenticationForm()
    return render(request, 'registration/login.html', {'form': form})


def get_video_id(url):
    """
    Extracts the video ID from a YouTube URL.
    """
    regex = r'(?:https?://)?(?:www\.)?(?:youtube\.com/(?:[^/]+/.*[^\w\s-]|(?:v|e(?:mbed)?)|.*[?&]v=)|youtu\.be/)([a-zA-Z0-9_-]{11})'
    match = re.match(regex, url)
    if match:
        return match.group(1)
    return None


def home(request):
    """
    Handles the home page view.
    """
    transcript = None
    video_id = None
    if request.method == "POST":
        url = request.POST.get("url")
        video_id = get_video_id(url)
        if video_id:
            try:
                transcript = YouTubeTranscriptApi.get_transcript(video_id)
                # Save video history if the user is authenticated
                if request.user.is_authenticated:
                    VideoHistory.objects.create(user=request.user, video_id=video_id)
            except Exception as e:
                transcript = f"Error retrieving transcript: {str(e)}"
    return render(request, "home.html", {"transcript": transcript, "video_id": video_id})