const NodeMediaServer = require('node-media-server');
const { spawn } = require('child_process');
const os = require('os');
const fs = require('fs');
const readline = require('readline');

// Konfigürasyon yükleme
let config = require('./config.json');
let ffmpegLogs = [];
const MAX_LOGS = 10;
let ffmpegProcess = null;
let nms = null;

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function clearScreen() {
  console.clear();
}

function saveConfig() {
  fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
}

function addLog(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  ffmpegLogs.unshift({ timestamp, message, type });
  if (ffmpegLogs.length > MAX_LOGS) {
    ffmpegLogs.pop();
  }
}

function formatBitrate(bytes) {
  const mbps = (bytes * 8) / (1024 * 1024);
  return `${mbps.toFixed(2)} Mbps`;
}

async function showMenu() {
  clearScreen();
  console.log(`${colors.bright}=== RTMP to UDP Stream Server - Ayarlar ===${colors.reset}\n`);
  console.log(`${colors.cyan}Mevcut Preset:${colors.reset} ${config.presets[config.last_used_preset].name}`);
  console.log('\nPresetler:');
  
  Object.entries(config.presets).forEach(([key, preset], index) => {
    console.log(`${colors.green}${index + 1})${colors.reset} ${preset.name}`);
    console.log(`   ${colors.dim}${preset.description}${colors.reset}`);
  });
  
  console.log(`\n${colors.yellow}4)${colors.reset} Port Ayarları`);
  console.log(`${colors.yellow}5)${colors.reset} Log Seviyesi`);
  console.log(`${colors.yellow}6)${colors.reset} Sunucuyu Başlat`);
  console.log(`${colors.red}0)${colors.reset} Çıkış\n`);
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const answer = await new Promise(resolve => {
    rl.question('Seçiminiz: ', resolve);
  });
  rl.close();
  
  switch(answer) {
    case '1':
      config.last_used_preset = 'high_quality';
      saveConfig();
      return showMenu();
    case '2':
      config.last_used_preset = 'balanced';
      saveConfig();
      return showMenu();
    case '3':
      config.last_used_preset = 'low_latency';
      saveConfig();
      return showMenu();
    case '4':
      return showPortSettings();
    case '5':
      return showLogSettings();
    case '6':
      return startServer();
    case '0':
      process.exit(0);
    default:
      return showMenu();
  }
}

async function showPortSettings() {
  clearScreen();
  console.log(`${colors.bright}=== Port Ayarları ===${colors.reset}\n`);
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const rtmpPort = await new Promise(resolve => {
    rl.question(`RTMP Port (${config.rtmp_port}): `, resolve);
  });
  
  const udpPort = await new Promise(resolve => {
    rl.question(`UDP Port (${config.udp_port}): `, resolve);
  });
  
  if (rtmpPort) config.rtmp_port = parseInt(rtmpPort);
  if (udpPort) config.udp_port = parseInt(udpPort);
  
  saveConfig();
  rl.close();
  return showMenu();
}

async function showLogSettings() {
  clearScreen();
  console.log(`${colors.bright}=== Log Ayarları ===${colors.reset}\n`);
  console.log('1) Detaylı');
  console.log('2) Normal');
  console.log('3) Sadece Hatalar');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const answer = await new Promise(resolve => {
    rl.question('Log seviyesi: ', resolve);
  });
  
  switch(answer) {
    case '1': config.log_level = 'debug'; break;
    case '2': config.log_level = 'info'; break;
    case '3': config.log_level = 'error'; break;
  }
  
  saveConfig();
  rl.close();
  return showMenu();
}

function startFFmpeg(id, StreamPath) {
  const preset = config.presets[config.last_used_preset];
  
  const baseParams = [
    '-fflags', '+genpts',
    '-i', `rtmp://localhost:${config.rtmp_port}${StreamPath}`,
    '-f', 'mpegts'
  ];
  
  const ffmpegCmd = [
    ...baseParams,
    ...preset.ffmpeg_params,
    `udp://127.0.0.1:${config.udp_port}?pkt_size=1316`
  ];
  
  console.log(`[UDP] Dönüştürücü başlatılıyor... (${preset.name})`);
  console.log(`[UDP] URL: udp://127.0.0.1:${config.udp_port}`);
  
  ffmpegProcess = spawn('ffmpeg', ffmpegCmd);
  
  let lastRtmpStats = { time: Date.now(), bytes: 0 };
  let rtmpFps = 0;
  let rtmpBitrate = 0;
  let outputBitrate = 0;
  let frameCount = 0;

  ffmpegProcess.stderr.on('data', (data) => {
    const output = data.toString();
    
    if (config.log_level === 'debug') {
      addLog(output, 'debug');
    }
    
    if (output.includes('fps=')) {
      const fpsMatch = output.match(/fps=\s*(\d+)/);
      const bitrateMatch = output.match(/bitrate=\s*([\d.]+)kbits\/s/);
      
      if (fpsMatch) rtmpFps = parseInt(fpsMatch[1]);
      if (bitrateMatch) outputBitrate = parseFloat(bitrateMatch[1]) * 1024 / 8;
    }

    if (output.includes('Error')) {
      addLog(output, 'error');
    }
  });

  const updateInterval = setInterval(() => {
    clearScreen();
    
    // RTMP istatistikleri
    const rtmpSession = nms.getSession(id);
    if (rtmpSession) {
      const now = Date.now();
      const bytesDiff = rtmpSession.socket.bytesRead - lastRtmpStats.bytes;
      const timeDiff = now - lastRtmpStats.time;
      rtmpBitrate = (bytesDiff / timeDiff) * 1000;
      lastRtmpStats = { time: now, bytes: rtmpSession.socket.bytesRead };
    }

    // İstatistikler
    console.log(`${colors.bright}=== Yayın İstatistikleri ===${colors.reset}`);
    console.log(`${colors.cyan}Preset:${colors.reset} ${preset.name}`);
    console.log(`\n${colors.green}RTMP Giriş:${colors.reset}`);
    console.log(`  FPS: ${rtmpFps}`);
    console.log(`  Bitrate: ${formatBitrate(rtmpBitrate)}`);
    console.log(`\n${colors.yellow}UDP Çıkış:${colors.reset}`);
    console.log(`  FPS: ${rtmpFps}`);
    console.log(`  Bitrate: ${formatBitrate(outputBitrate)}`);
    
    // Son Loglar
    console.log(`\n${colors.bright}Son Loglar:${colors.reset}`);
    ffmpegLogs.forEach(log => {
      const color = log.type === 'error' ? colors.red : 
                   log.type === 'debug' ? colors.dim : colors.reset;
      console.log(`${colors.dim}${log.timestamp}${colors.reset} ${color}${log.message}${colors.reset}`);
    });
    
    frameCount++;
  }, 1000);

  return updateInterval;
}

function startServer() {
  clearScreen();
  const nmsConfig = {
    rtmp: {
      port: config.rtmp_port,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60
    }
  };

  nms = new NodeMediaServer(nmsConfig);
  let statsInterval = null;

  nms.on('prePublish', (id, StreamPath, args) => {
    console.log('[RTMP] Yayın başladı:', StreamPath);
    
    if (ffmpegProcess) {
      ffmpegProcess.kill();
      ffmpegProcess = null;
    }
    
    if (statsInterval) {
      clearInterval(statsInterval);
    }
    
    statsInterval = startFFmpeg(id, StreamPath);
  });

  nms.on('donePublish', (id, StreamPath, args) => {
    console.log('[RTMP] Yayın sonlandı:', StreamPath);
    
    if (ffmpegProcess) {
      ffmpegProcess.kill();
      ffmpegProcess = null;
    }

    if (statsInterval) {
      clearInterval(statsInterval);
      statsInterval = null;
    }
  });

  nms.run();

  console.log(`
${colors.bright}=== RTMP to UDP Stream Server by devozdemirhasancan ===${colors.reset}

${colors.green}RTMP Girişi (GoPro):${colors.reset}
URL: rtmp://localhost:${config.rtmp_port}/live
Key: test

${colors.yellow}UDP Çıkışı (OBS):${colors.reset}
URL: udp://127.0.0.1:${config.udp_port}
Format: mpegts

Preset: ${config.presets[config.last_used_preset].name}
${colors.dim}${config.presets[config.last_used_preset].description}${colors.reset}

Çıkmak için Ctrl+C
`);
}

// Ana menüyü göster
showMenu(); 