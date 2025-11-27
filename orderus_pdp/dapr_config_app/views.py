from django.shortcuts import render
from django.http import JsonResponse

def dapr_subscribe(request):
    # Return an empty list since this service does not subscribe to any topics
    return JsonResponse([], safe=False)

def dapr_config(request):
    return JsonResponse({
        "entities": [],       # list of actor types if using actors
        "scopes": ["*"],      # optional, default
    })