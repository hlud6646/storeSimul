"""
This is a toy server to assist in containerising this project.
"""

from http.server import BaseHTTPRequestHandler, HTTPServer

class HelloWorldHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Send response status code
        self.send_response(200)
        # Send headers
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        # Send the message
        self.wfile.write(b"Hello, World!")

def run(server_class=HTTPServer, handler_class=HelloWorldHandler, port=8080):
    server_address = ('0.0.0.0', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()