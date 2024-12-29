const NodeMediaServer = require('node-media-server');
const { spawn } = require('child_process');
const os = require('os');

const config = {
  rtmp: {
    port: 7002,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  }
};

const nms = new NodeMediaServer(config);
let ffmpegProcess = null;

nms.on('prePublish', (id, StreamPath, args) => {
  console.log('[RTMP] Yayın başladı:', StreamPath);
  
  if (ffmpegProcess) {
    ffmpegProcess.kill();
    ffmpegProcess = null;
  }
  
  // Windows için farklı SRT parametreleri
  const isWindows = os.platform() === 'win32';
  const srtUrl = isWindows 
    ? 'srt://127.0.0.1:7005?mode=listener&latency=2000000&transtype=live'
    : 'srt://127.0.0.1:7005?mode=caller';
  
  const ffmpegCmd = [
    '-i', `rtmp://localhost:7002${StreamPath}`,
    '-c', 'copy',
    '-f', 'mpegts',
    srtUrl
  ];
  
  console.log('[SRT] Dönüştürücü başlatılıyor...');
  console.log('[SRT] URL:', srtUrl);
  
  ffmpegProcess = spawn('ffmpeg', ffmpegCmd);
  
  ffmpegProcess.stderr.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Error')) {
      console.log('[SRT] Hata:', output);
    }
  });
});

nms.on('donePublish', (id, StreamPath, args) => {
  console.log('[RTMP] Yayın sonlandı:', StreamPath);
  
  if (ffmpegProcess) {
    ffmpegProcess.kill();
    ffmpegProcess = null;
  }
});

nms.run();

const isWindows = os.platform() === 'win32';
console.log(`
=== RTMP to SRT Stream Server by devozdemirhasancan ===

RTMP Girişi (GoPro):
URL: rtmp://localhost:7002/live
Key: test

SRT Çıkışı (OBS):
URL: srt://127.0.0.1:7005
Mode: ${isWindows ? 'Listener' : 'Caller'}
${isWindows ? 'Latency: 2000ms' : ''}

Çıkmak için Ctrl+C
`); 