from http.server import HTTPServer, BaseHTTPRequestHandler
import datetime

gts = 0
class RequestHandler(BaseHTTPRequestHandler):
	def do_GET(self):
		global gts
		if self.path == "/reset":
			self.send_response(200)
			self.end_headers()
			ts = datetime.datetime.now().timestamp()
			ts = int(ts * 1000 + 30000)
			gts = ts
			self.wfile.write(str(ts).encode())
			return
		elif self.path == "/fetch":
			self.send_response(200)
			self.end_headers()
			self.wfile.write(str(gts).encode())
			return
		
		self.send_response(404)
		self.end_headers()
		




httpd = HTTPServer(("0.0.0.0", 8244), RequestHandler)


httpd.serve_forever()
