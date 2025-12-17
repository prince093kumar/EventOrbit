# Auto-Logout Feature Walkthrough

I have implemented the auto-logout feature for the Organizer Panel and updated the Backend session configuration.

## Changes
### Organizer Frontend
1.  **New Component**: `SessionTimeoutHandler.jsx`
    - Monitors user activity (`mousemove`, `click`, `keydown`, `scroll`, `touchstart`).
    - Resets a **10-minute** timer on any activity.
    - If the timer expires (10 minutes of inactivity):
        - Shows an alert: "Your session is expired".
        - Logs the user out.
        - Redirects to the login page (via state change).

2.  **Integration**: `App.jsx`
    - Added `<SessionTimeoutHandler />` inside the main `Router`.
    - This ensures it is active across all pages in the Organizer panel.

### Backend
1.  **Server Configuration**: `server.js`
    - Updated `express-session` cookie `maxAge` to **10 minutes** to match the frontend timeout.

## Verification
You can verify this by:
1.  Logging into the Organizer Panel.
2.  Leaving the tab open without moving the mouse or pressing keys.
3.  After 10 minutes, you will see a popup "Your session is expired".
4.  Upon clicking OK, you will be redirected to the Login page.

To test more quickly, you can temporarily change `TIMEOUT_DURATION` in `src/components/SessionTimeoutHandler.jsx` to `10000` (10 seconds).
