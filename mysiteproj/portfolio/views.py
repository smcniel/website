"""Django portfolio app views."""
from django.shortcuts import render

# Create your views here.

def index(request):
    """Index render request."""
    return render(request, 'index.html')
