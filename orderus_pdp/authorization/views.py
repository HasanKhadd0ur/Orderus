from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests
import os

DAPR_HTTP_PORT = os.getenv("DAPR_HTTP_PORT", 3502)
STATE_STORE = "pdp-statestore"

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

        state_url = f"http://localhost:{DAPR_HTTP_PORT}/v1.0/state/{STATE_STORE}/user:{user_id}"
        resp = requests.get(state_url)

        if resp.status_code != 200 or not resp.json():
            return JsonResponse({'decision': 'deny', 'reason': 'user not found in state store'})

        role_data = resp.json()[0].get("value") if isinstance(resp.json(), list) else resp.json()
        role = role_data.get("role")
        if not role:
            return JsonResponse({'decision': 'deny', 'reason': 'role not found'})

        # Check permission
        allowed_roles = ACTION_PERMISSIONS.get(action, [])
        if role in allowed_roles:
            return JsonResponse({'decision': 'allow'})
        else:
            return JsonResponse({'decision': 'deny', 'reason': 'action not permitted'})

    except Exception as e:
        return JsonResponse({'decision': 'deny', 'reason': str(e)}, status=400)
