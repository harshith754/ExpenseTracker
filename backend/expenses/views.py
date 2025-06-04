from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.shortcuts import render

@require_GET
def ping(request):
    return JsonResponse({'message': 'pong'})

# Create your views here.
