window.addEventListener('load', () => {
    let recordButton = document.getElementById('recordButton')
    let downloadLink = document.getElementById('download')
    let sttResult = document.getElementById('sstResult')
    let spinner = document.getElementById('spinner')

    let state
    let mediaRecorder
    let recordedChunks

    setState('not_initialized')

    recordButton.addEventListener('click', (event) => {
        recordButton.disabled = true
        switch(state){
            case "idle":  
                setState('recording')
                recordedChunks = []
                mediaRecorder.start(100)
                break
            case "recording":  
                setState('stopping')
                break
            default:
                alert("invalid state")
        }
    })

    function setState(newState) {
        state = newState
        document.getElementById('state').innerHTML = "State: " + state
        switch(newState) {
            case "not_initialized":
                recordButton.innerHTML = "Audio not initialized"
                recordButton.disabled = true
            case "idle":
                recordButton.innerHTML = "Start Recording"
                recordButton.disabled = false
                recordedChunks = []
                spinner.classList.add("invisible")
                break
            case "recording":  
                recordButton.innerHTML = "Stop"
                recordButton.disabled = false
                break
            case "stopping":  
                recordButton.disabled = true
                break
            case "stopped":  
                recordButton.disabled = true
                break
            case "processing":  
                recordButton.disabled = true
                spinner.classList.remove("invisible")
                break
            default:
                alert("unknown state")    
        }
    }

    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

        mediaRecorder.addEventListener('dataavailable', function(e) {
            if (e.data.size > 0) {
              recordedChunks.push(e.data);
            }
      
            if(state == 'stopping') {
              mediaRecorder.stop();
              setState('stopped')
            }
        })
    
        mediaRecorder.addEventListener('stop', function() {
            setState("processing")
            let dataBlob = new Blob(recordedChunks)

            fetch(`/stt`, { method: "POST", body: dataBlob })
                .then(response => {
                    if (response.ok)
                        return response;
                    else 
                        throw Error(`Server returned ${response.status}: ${response.statusText}`)
                })
                .then(response => {
                    return response.text()
                })
                .then((text) => {
                    sttResult.innerHTML = text
                    setState("idle")
                })
                .catch(error => {
                    alert(error);
                })


            downloadLink.href = URL.createObjectURL(dataBlob);
            downloadLink.download = 'recording.wav';
            downloadLink.classList.remove("d-none")

        })
      
        setState('idle')
    })

})
