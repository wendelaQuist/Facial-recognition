
let video = document.querySelector("#video");
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas");
let taken = 0;
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

function takePicture() {
  taken = 0;
}

setInterval(takePicture, 10000)

//setInterval(async () => {
//  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
//  let image_data_url = canvas.toDataURL('image/jpeg');
//  console.log(image_data_url);
//}, 1000)

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    if (taken == 0){
      const canvas = faceapi.createCanvasFromMedia(video)
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      let image_data_url = canvas.toDataURL('image/jpeg');
      taken = 1;
      console.log(image_data_url);
    }
    
  }, 100)
})