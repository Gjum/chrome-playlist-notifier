#!/usr/bin/python3
import json
import time

from http.server import HTTPServer
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

import gi ; gi.require_version('Notify', '0.7')
from gi.repository import Notify, GdkPixbuf

Notify.init("Chrome Monitor")
noti = Notify.Notification.new('Chrome Music Notifier')

class WebServer(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin","*")
        self.end_headers()

        url = urlparse(self.path)
        query = parse_qs(url.query)
        data = json.loads(query['data'][0])
        print(data)

        noti.update('Now playing', data['title'])
        noti.show()

try:
    HTTPServer(('', 8080), WebServer).serve_forever()
except KeyboardInterrupt: pass

# notification.set_icon_from_pixbuf(GdkPixbuf.Pixbuf.new_from_file("/home/gjum/src/chrome-extensions/inspect-client/icon.png"))
