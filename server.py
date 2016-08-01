#!/usr/bin/python3
# url format for sending data: /?data=<urlencoded json of the data>
# pass -v as first arg to print the received json data
# current tab title is written to /tmp/$USER.chrome-playlist-notifier.now-playing

port = 1234

import json
import os
import sys
import time

from http.server import HTTPServer
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

import gi ; gi.require_version('Notify', '0.7')
from gi.repository import Notify, GdkPixbuf

Notify.init("Chrome Playlist Notifier")
notification = Notify.Notification.new('Chrome Playlist Notifier')

verbose = len(sys.argv) > 1 and sys.argv[1] == '-v'

now_playing_path = os.path.expandvars('/tmp/$USER.chrome-playlist-notifier.now-playing')
titles = {}  # tab id -> title

def set_title(title):
    notification.update('Now playing', title)
    notification.show()
    with open(now_playing_path, 'w') as f:
        f.write(title)

def del_tab(tab_id):
    del titles[tab_id]
    for title in titles.values():  # get first if any
        set_title( title)
        break
    else:
        notification.close()
        try: os.remove(now_playing_path)
        except FileNotFoundError: pass

class WebServer(BaseHTTPRequestHandler):
    def do_GET(self):
        # Chrome needs a proper response
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin","*")
        self.end_headers()

        url = urlparse(self.path)
        query = parse_qs(url.query)
        data = json.loads(query['data'][0])

        if verbose:
            print(data)

        if data['audible']:
            titles[data['id']] = data['title']
            set_title(data['title'])

        elif data['id'] in titles:
            del_tab(data['id'])

    def log_request(self, *args, **kwargs):
        if verbose:
            super().log_request(*args, **kwargs)

try:
    HTTPServer(('localhost', port), WebServer).serve_forever()
except KeyboardInterrupt:
    try: os.remove(now_playing_path)
    except FileNotFoundError: pass
