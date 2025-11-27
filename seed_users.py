import requests
import json
import os

DAPR_HTTP_PORT = os.getenv("DAPR_HTTP_PORT", 3502)
STATE_STORE = "pdp-statestore"

users = {
    1: "admin",
    2: "user",
    3: "guest"
}

for user_id, role in users.items():
    url = f"http://localhost:{DAPR_HTTP_PORT}/v1.0/state/{STATE_STORE}"
    payload = [
        {
            "key": f"user:{user_id}",
            "value": {"role": role}
        }
    ]
    resp = requests.post(url, json=payload)
    if resp.status_code == 204:
        print(f"Saved user {user_id} -> {role}")
    else:
        print(f"Error saving user {user_id}: {resp.text}")
