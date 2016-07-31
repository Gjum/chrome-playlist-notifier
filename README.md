# Chrome Playlist Notifier
when an audible chrome tab changes its title, show it via libnotify

## Installation
1. make sure you have Python 3 and a notification daemon
1. clone the repo: `git clone https://github.com/Gjum/chrome-playlist-notifier.git && cd chrome-playlist-notifier`
1. change the default port: replace `1234` in `server.py` and `background.js`
1. start the notifier server: `python3 server.py &`
  - you should run this on login, for example in `~/.xinitrc` or in your desktop environment
1. install the chrome extension:
  1. open the extensions page: `chrome://extensions/`
  1. enable `Developer mode`
  1. select `Load unpacked extension`, choose `chrome-playlist-notifier`

## Usage
1. open a page with a playlist, for example YouTube, Soundcloud, Bandcamp, ...
1. open the context menu (right-click) and select `watch this music`

Now you will receive notifications of the page title when the page status changes.
The page title is also written to `/tmp/$USER.chrome-playlist-notifier.now-playing`.
To no longer receive notifications, open the context menu again and select `unwatch this music`.
When the tab closes, it will also be removed from the watched tabs.
