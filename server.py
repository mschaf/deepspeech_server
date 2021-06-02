from flask import Flask, request, redirect
import subprocess

app = Flask(__name__, static_url_path='', static_folder='frontend')

@app.route('/', methods=['GET'])
def index():
    return redirect("index.html", code=302)

@app.route('/stt', methods=['POST'])
def post():
    with open("file.ogg", "wb") as audioFile:
        audioFile.write(request.data)

    proc = subprocess.Popen("ffmpeg -y -i file.ogg file.wav", shell=True)

    proc = subprocess.Popen(
        "deepspeech --model output_graph.pbmm --scorer kenlm.scorer --audio file.wav",
        shell=True, 
        stdout=subprocess.PIPE
    )
 
    output = proc.communicate()[0].strip()
    print(output)
    return output

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, ssl_context=('cert.pem', 'key.pem'))
