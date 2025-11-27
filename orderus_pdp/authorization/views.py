from django.shortcuts import render

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Dummy RBAC rules
USER_ROLES = {
    1: 'admin',
    2: 'user',
    3: 'guest'
}

ACTION_PERMISSIONS = {
    'create_order': ['admin', 'user'],
    'cancel_order': ['admin'],
    'update_order': ['admin', 'user'],
}

@csrf_exempt
def authorize(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST method required'}, status=405)

    try:
        body = json.loads(request.body)
        user_id = body.get('userId')
        action = body.get('action')

        role = USER_ROLES.get(user_id)
        if not role:
            return JsonResponse({'decision': 'deny', 'reason': 'user not found'})

        allowed_roles = ACTION_PERMISSIONS.get(action, [])
        if role in allowed_roles:
            return JsonResponse({'decision': 'allow'})
        else:
            return JsonResponse({'decision': 'deny', 'reason': 'action not permitted'})

    except Exception as e:
        return JsonResponse({'decision': 'deny', 'reason': str(e)}, status=400)
