from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests
import os
import logging

# Configure logger
logger = logging.getLogger("PDP")
logger.setLevel(logging.INFO)

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
        logger.warning("Received non-POST request")
        return JsonResponse({'error': 'POST method required'}, status=405)

    try:
        logger.info("Authorization request received")

        body = json.loads(request.body)
        logger.debug(f"Request body: {body}")

        user_id = body.get('userId')
        action = body.get('action')

        logger.info(f"Checking authorization → userId={user_id}, action={action}")

        # State store lookup
        state_url = f"http://localhost:{DAPR_HTTP_PORT}/v1.0/state/{STATE_STORE}/user:{user_id}"
        logger.debug(f"Fetching state from: {state_url}")

        resp = requests.get(state_url)
        logger.debug(f"State store response: {resp.status_code} → {resp.text}")

        if resp.status_code != 200 or not resp.json():
            logger.warning(f"User {user_id} not found in state store")
            return JsonResponse({'decision': 'deny', 'reason': 'user not found in state store'})

        # Extracting role info
        role_data = resp.json()[0].get("value") if isinstance(resp.json(), list) else resp.json()
        role = role_data.get("role")

        logger.info(f"User {user_id} has role: {role}")

        if not role:
            logger.warning(f"No role found for user {user_id}")
            return JsonResponse({'decision': 'deny', 'reason': 'role not found'})

        # Permission check
        allowed_roles = ACTION_PERMISSIONS.get(action, [])
        logger.debug(f"Allowed roles for {action}: {allowed_roles}")

        if role in allowed_roles:
            logger.info(f"Authorization ALLOW → userId={user_id}, action={action}")
            return JsonResponse({'decision': 'allow'})
        else:
            logger.info(f"Authorization DENY → userId={user_id}, action={action}")
            return JsonResponse({'decision': 'deny', 'reason': 'action not permitted'})

    except Exception as e:
        logger.error(f"Authorization error: {str(e)}")
        return JsonResponse({'decision': 'deny', 'reason': str(e)}, status=400)
