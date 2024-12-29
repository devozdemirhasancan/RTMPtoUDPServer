# RTMP to SRT Stream Server

Simple and lightweight server application that converts RTMP stream from GoPro to SRT protocol.

GoPro kameradan gelen RTMP yayınını SRT protokolüne dönüştüren basit ve hafif bir sunucu uygulaması.

## Features / Özellikler

- RTMP server for GoPro streaming / GoPro yayını için RTMP sunucusu
- Automatic SRT conversion for OBS / OBS için otomatik SRT dönüştürme
- Windows and macOS support / Windows ve macOS desteği
- Low latency / Düşük gecikme süresi
- Easy to use / Kolay kullanım

## Use Cases / Kullanım Senaryoları

1. Low Latency Streaming from GoPro to OBS / GoPro'dan OBS'ye Düşük Gecikmeli Yayın:
   - Receives RTMP stream from GoPro / GoPro'dan RTMP yayını alınır
   - Converts to SRT protocol / SRT protokolüne dönüştürülür
   - Use as Media Source in OBS / OBS'de Media Source olarak kullanılır

2. Local Network Streaming / Yerel Ağda Yayın:
   - GoPro and OBS must be on same network / GoPro ve OBS aynı ağda olmalı
   - No port forwarding required / Port yönlendirme gerekmez
   - Stream with low latency / Düşük gecikme ile yayın yapılır

## Requirements / Gereksinimler

- FFmpeg (Must be installed on your system / Sisteminizde yüklü olmalıdır)
  ```bash
  # For Windows / Windows için:
  # Download FFmpeg from / FFmpeg'i buradan indirin: https://ffmpeg.org/download.html
  # Copy ffmpeg.exe to this folder / İndirdiğiniz ffmpeg.exe dosyasını bu klasöre kopyalayın
  
  # For macOS / macOS için:
  brew install ffmpeg
  ```

## Installation / Kurulum

### Using Pre-built Binaries / Hazır Executable Kullanımı:

1. Download the latest release from GitHub / GitHub'dan son sürümü indirin:
   - Windows: Download `rtmp-srt-server-win.exe`
   - macOS: Download `rtmp-srt-server-macos`

2. Start the application / Uygulamayı başlatın:
   ```bash
   # For Windows / Windows için:
   ./rtmp-srt-server-win.exe
   
   # For macOS / macOS için:
   ./rtmp-srt-server-macos
   ```

### Using NPM Package / NPM Paketi Kullanımı:

1. Install globally / Global olarak yükleyin:
   ```bash
   npm install -g @devozdemirhasancan/rtmp-srt-server
   ```

2. Run the server / Sunucuyu çalıştırın:
   ```bash
   rtmp-srt-server
   ```

### From Source / Kaynak Koddan:

1. Clone and install / Klonlayın ve yükleyin:
   ```bash
   git clone https://github.com/devozdemirhasancan/rtmp-srt-server.git
   cd rtmp-srt-server
   npm install
   ```

2. Run / Çalıştırın:
   ```bash
   npm start
   ```

## Configuration / Yapılandırma

1. GoPro Settings / GoPro Ayarları:
   - RTMP URL: `rtmp://localhost:7002/live`
   - Stream Key: `test`

2. OBS Media Source Settings / OBS Media Source Ayarları:
   - SRT URL: `srt://127.0.0.1:7005`
   - Format: mpegts

## Notes / Notlar

- Press Ctrl+C to stop the application / Uygulamayı durdurmak için Ctrl+C tuşlarına basın
- Works in SRT Listener mode on Windows, Caller mode on macOS / Windows'ta SRT Listener modunda, macOS'ta Caller modunda çalışır
- Logs will be displayed in case of errors / Hata durumunda loglar ekranda görüntülenecektir

## Development / Geliştirme

1. Install Node.js dependencies / Node.js bağımlılıklarını yükleyin:
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