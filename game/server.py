from bottle import Bottle, static_file, run

app = Bottle()

@app.route('/')
def serve_index():
    return static_file('index.html', root='.')

@app.route('/static/<filename>')
def serve_static(filename):
    return static_file(filename, root='./static')

if __name__ == '__main__':
    run(app, host='localhost', port=8080)