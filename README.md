# Small Server for testing deepspeech models

A small server to provide a minimal webinterface for the testing of deepspeech models

## Usage

The webpage must run in a [Secure Context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts) for the media API to work, see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/mediaDevices#browser_compatibility For this we need HTTPS.  

* Genrate a self signed certificate: `openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365`
* If necessary adjust the command used for deepspeech in `server.py`, the default assumes a model file named `output_graph.pbmm` and a scorer named `kenlm.scorer`
* Start the server: `python3 server.py`
* Access via `https://localhost:8080`


## Requirements

* python3 with flask
* ffmpeg
* [deepspeech](https://github.com/mozilla/DeepSpeech)
* A model for deepspeech