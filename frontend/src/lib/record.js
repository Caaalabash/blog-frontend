var MediaUtils = {
  /**
   * 获取用户媒体设备(处理兼容的问题)
   * @param videoEnable {boolean} - 是否启用摄像头
   * @param audioEnable {boolean} - 是否启用麦克风
   * @param callback {Function} - 处理回调
   */
  getUserMedia(videoEnable, audioEnable, callback) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
      || navigator.msGetUserMedia || window.getUserMedia
    var constraints = {video: videoEnable, audio: audioEnable}
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        callback(false, stream)
      })['catch'](function(err) {
        callback(err)
      })
    } else if (navigator.getUserMedia) {
      navigator.getUserMedia(constraints, function (stream) {
        callback(false, stream)
      }, function (err) {
        callback(err)
      })
    } else {
      callback(new Error('Not support userMedia'))
    }
  },

  /**
   * 关闭媒体流
   * @param stream {MediaStream} - 需要关闭的流
   */
  closeStream: function (stream) {
    if (typeof stream.stop === 'function') {
      stream.stop()
    }
    else {
      let trackList = [stream.getAudioTracks(), stream.getVideoTracks()]

      for (let i = 0; i < trackList.length; i++) {
        let tracks = trackList[i]
        if (tracks && tracks.length > 0) {
          for (let j = 0; j < tracks.length; j++) {
            let track = tracks[j]
            if (typeof track.stop === 'function') {
              track.stop()
            }
          }
        }
      }
    }
  }
}

// 用于存放 MediaRecorder 对象和音频Track，关闭录制和关闭媒体设备需要用到
var recorder, mediaStream

// 用于存放录制后的音频文件对象和录制结束回调
var recorderFile, stopRecordCallback

// 用于存放是否开启了视频录制
var videoEnabled = false

// 录制短语音
export function startRecord(enableVideo) {
  videoEnabled = enableVideo
  MediaUtils.getUserMedia(enableVideo, true, function (err, stream) {
    if (err) {
      throw err
    } else {
      // 通过 MediaRecorder 记录获取到的媒体流
      recorder = new MediaRecorder(stream)

      mediaStream = stream
      var chunks = [], startTime = 0
      recorder.ondataavailable = function(e) {
        chunks.push(e.data)
      }
      recorder.onstop = function (e) {
        recorderFile = new Blob(chunks, { 'type' : recorder.mimeType })
        chunks = []
        if (null != stopRecordCallback) {
          stopRecordCallback()
        }
      }
      recorder.start()
    }
  })
}

// 停止录制
export function stopRecord(callback) {
  stopRecordCallback = callback
  // 终止录制器
  recorder.stop()
  // 关闭媒体流
  MediaUtils.closeStream(mediaStream)
}

// 获取文件
export function getRecordFile(){
  return recorderFile
}
