#!/usr/bin/python3
# url format for sending data: /?data=<urlencoded json of the data>
# pass -v as first arg to print the received json data

port = 1234

import json
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

        notification.update('Now playing', data['title'])
        notification.show()

    def log_request(self, *args, **kwargs):
        if verbose:
            super().log_request(*args, **kwargs)

try:
    HTTPServer(('localhost', port), WebServer).serve_forever()
except KeyboardInterrupt: pass
