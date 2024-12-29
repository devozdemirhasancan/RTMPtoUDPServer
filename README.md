# RTMP to UDP Stream Server

Simple and lightweight server application that converts RTMP stream from GoPro to UDP protocol.

GoPro kameradan gelen RTMP yayınını UDP protokolüne dönüştüren basit ve hafif bir sunucu uygulaması.

## Features / Özellikler

- RTMP server for GoPro streaming / GoPro yayını için RTMP sunucusu
- UDP converter for OBS / OBS için UDP dönüştürücü
- Quality presets / Kalite profilleri
- Real-time statistics / Gerçek zamanlı istatistikler
- Detailed logging / Detaylı loglama
- Settings persistence / Ayarları kaydetme
- Windows and macOS support / Windows ve macOS desteği
- Low latency / Düşük gecikme
- Easy to use / Kolay kullanım

## Use Cases / Kullanım Senaryoları

1. Low Latency Streaming from GoPro to OBS / GoPro'dan OBS'ye Düşük Gecikmeli Yayın:
   - Receives RTMP stream from GoPro / GoPro'dan RTMP yayını alınır
   - Converts to UDP protocol / UDP protokolüne dönüştürülür
   - Use as Media Source in OBS / OBS'de Media Source olarak kullanılır

2. Quality Presets / Kalite Profilleri:
   - High Quality (10 Mbps) / Yüksek Kalite
   - Balanced (5 Mbps) / Dengeli
   - Low Latency (3 Mbps) / Düşük Gecikme

## Requirements / Gereksinimler

- Node.js (>= 18.0.0)
- FFmpeg (Must be installed on your system / Sisteminizde yüklü olmalıdır)
  ```bash
  # For Windows / Windows için:
  # Download FFmpeg from / FFmpeg'i buradan indirin: https://ffmpeg.org/download.html
  # Add ffmpeg.exe to your PATH / FFmpeg'i PATH'e ekleyin
  
  # For macOS / macOS için:
  brew install ffmpeg
  ```

## Installation / Kurulum

### Using Pre-built Binaries / Hazır Executable Kullanımı:

1. Download the latest release from GitHub / GitHub'dan son sürümü indirin:
   - Windows: Download `rtmp-udp-server-win.exe`
   - macOS: Download `rtmp-udp-server-macos`

2. Start the application / Uygulamayı başlatın:
   ```bash
   # For Windows / Windows için:
   ./rtmp-udp-server-win.exe
   
   # For macOS / macOS için:
   ./rtmp-udp-server-macos
   ```

### Using NPM Package / NPM Paketi Kullanımı:

1. Install globally / Global olarak yükleyin:
   ```bash
   npm install -g @devozdemirhasancan/rtmp-udp-server
   ```

2. Run the server / Sunucuyu çalıştırın:
   ```bash
   rtmp-udp-server
   ```

### From Source / Kaynak Koddan:

1. Clone and install / Klonlayın ve yükleyin:
   ```bash
   git clone https://github.com/devozdemirhasancan/rtmp-udp-server.git
   cd rtmp-udp-server
   npm install
   ```

2. Run / Çalıştırın:
   ```bash
   npm start
   ```

## Configuration / Yapılandırma

1. Server Settings / Sunucu Ayarları:
   - Select quality preset / Kalite profili seçin
   - Configure ports / Port ayarları yapın
   - Set log level / Log seviyesi ayarlayın

2. GoPro Settings / GoPro Ayarları:
   - RTMP URL: `rtmp://localhost:7002/live`
   - Stream Key: `test`

3. OBS Media Source Settings / OBS Media Source Ayarları:
   - URL: `udp://127.0.0.1:7005`
   - Format: mpegts

## Statistics / İstatistikler

Real-time information shown during streaming / Yayın sırasında gösterilen bilgiler:
- RTMP Input FPS / RTMP Giriş FPS
- RTMP Input Bitrate / RTMP Giriş Bitrate
- UDP Output FPS / UDP Çıkış FPS
- UDP Output Bitrate / UDP Çıkış Bitrate
- FFmpeg Logs / FFmpeg Logları

## Notes / Notlar

- Press Ctrl+C to stop the application / Uygulamayı durdurmak için Ctrl+C tuşlarına basın
- Settings are stored in config.json / Ayarlar config.json dosyasında saklanır
- Each preset has different buffer and bitrate settings / Her preset için farklı buffer ve bitrate ayarları vardır
- Logs will be displayed based on selected log level / Seçilen log seviyesine göre loglar gösterilir

## Development / Geliştirme

1. Install dependencies / Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. Run in development mode / Geliştirici modunda çalıştırın:
   ```bash
   npm start
   ```

3. Build executables / Executable oluşturun:
   ```bash
   npm run build
   ```

## Release Process / Yayınlama Süreci

1. Update version / Versiyon güncelleyin:
   ```bash
   npm version patch|minor|major
   ```

2. Push with tags / Tag'lerle push yapın:
   ```bash
   git push --follow-tags
   ```

GitHub Actions will automatically:
- Create a new GitHub release
- Upload Windows and macOS executables
- Publish to NPM registry

GitHub Actions otomatik olarak:
- Yeni bir GitHub release oluşturur
- Windows ve macOS executable'larını yükler
- NPM registry'ye yayınlar

## License / Lisans

MIT License - See LICENSE file for details / Detaylar için LICENSE dosyasına bakın.

## Contact / İletişim

Hasan Can Özdemir
- GitHub: [@devozdemirhasancan](https://github.com/devozdemirhasancan)
- Email/E-posta: devozdemirhasancan@gmail.com 