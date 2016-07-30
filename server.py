#!/usr/bin/python3
import time

from http.server import HTTPServer
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

import gi ; gi.require_version('Notify', '0.7')
from gi.repository import Notify, GdkPixbuf

Notify.init("Chrome Monitor")

class WebServer(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        url = urlparse(self.path)
        query = parse_qs(url.query)

        notification = Notify.Notification.new(
            'Request at ' + url.path,
            'query: ' + str(query)
        ).show()

HTTPServer(('', 8080), WebServer).serve_forever()

# notification.set_icon_from_pixbuf(GdkPixbuf.Pixbuf.new_from_file("/home/gjum/src/chrome-extensions/inspect-client/icon.png"))
