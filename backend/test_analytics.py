import requests
import os

def test_analytics():
    # Attempt to login first to get a token
    login_url = "http://127.0.0.1:8000/api/auth/login"
    login_data = {
        "username": os.getenv("ADMIN_EMAIL", "admin@crm.com"),
        "password": os.getenv("ADMIN_PASSWORD", "admin123")
    }
    
    try:
        response = requests.post(login_url, data=login_data)
        if response.status_code != 200:
            print(f"Login failed: {response.status_code} - {response.text}")
            return
            
        token = response.json()["access_token"]
        print("Login successful.")
        
        analytics_url = "http://127.0.0.1:8000/api/analytics/stats"
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(analytics_url, headers=headers)
        print(f"Analytics status: {response.status_code}")
        if response.status_code == 200:
            print("Analytics data:")
            print(response.json())
        else:
            print(f"Analytics error: {response.text}")
            
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_analytics()
