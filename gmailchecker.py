
import sys
import requests

def check_calendar_url(email):
    url = f"https://calendar.google.com/calendar/ical/{email}/public/basic.ics"
    try:
        response = requests.head(url)  # Send a HEAD request to fetch only the headers
        x_frame_options = response.headers.get('X-Frame-Options', '').upper()
        if x_frame_options == 'SAMEORIGIN':
            print("The email address is valid!")
        elif not x_frame_options:
            print("The email address is invalid and does not exist.")
        else:
            print("The email address is valid but the calendar is not public.")
    except requests.RequestException as e:
        print(f"Error fetching calendar URL: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <email>")
        sys.exit(1)
    email = sys.argv[1]
    check_calendar_url(email)