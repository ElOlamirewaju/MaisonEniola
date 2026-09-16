#!/usr/bin/env python3
"""Downloads the licensed Adobe Stock photos and videos (16 Sep 2026) and builds the site's
destination assets: 16:11 cards (640/1280), 16:9 wide posters and 6-second seamless loops.
The previous illustration assets are moved to assets/_illustrations-backup first.
Needs Python 3 with Pillow and ffmpeg (libx264 + libvpx-vp9)."""
import os, shutil, subprocess, sys, urllib.request, time
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(ROOT, 'assets')
TMP = os.path.join(ROOT, '.stock-src')

SRC = {
  'amalfi': {
    'photo': 'https://stock-apex-images-prod-ew1.s3.eu-west-1.amazonaws.com/633d768ea1b9c155deefff6c5389f20975ad265157bb439797675e54a382abc7.jpg?response-content-disposition=attachment%3B%20filename%3D%22AdobeStock_293536413.jpeg%22&response-content-type=image%2Fjpeg&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUMGGMQGERDWXM64M%2F20260916%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20260916T152611Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=a8883c7304c905bcd5d8c3f2a98edeea05519e6928ef2e3e5f667ded73026ed9',
    'video': 'https://fotolia-prod-videos-0.s3.eu-west-1.amazonaws.com/04/85/65/81/F_485658163_swHF94LwqYSVc1Udk7LkaH9eFBSpOcaI.video?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAUMGGMQGEWQT4MZ67%2F20260916%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20260916T152658Z&X-Amz-Expires=3600&X-Amz-Signature=002feb1c93e8c289e25baf9b37ee7e9b3bbc95fa550bbec3a37e7df3d73dae89&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3D%22AdobeStock_485658163.mov%22&x-amz-checksum-mode=ENABLED&x-id=GetObject',
    'focus': (0.62, 0.55), 'start': 2},
  'iceland': {
    'photo': 'https://stock-apex-images-prod-ew1.s3.eu-west-1.amazonaws.com/4bd1b87edc6de7cd69937f709e4df24aa0642dd39ecebb54fd9e5225bd506c2f.jpg?response-content-disposition=attachment%3B%20filename%3D%22AdobeStock_607467931.jpeg%22&response-content-type=image%2Fjpeg&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUMGGMQGERDWXM64M%2F20260916%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20260916T152626Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=06058dee414372ecca163b2e651e0a9ec7db22ecf9cc8adc591ee3c7060a0478',
    'video': 'https://fotolia-prod-videos-0.s3.eu-west-1.amazonaws.com/02/14/58/82/F_214588216_0ui9OzcwW8cS6jTTIsezWi4D0nXzWSnM.video?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAUMGGMQGEWQT4MZ67%2F20260916%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20260916T152701Z&X-Amz-Expires=3600&X-Amz-Signature=bd47582761dafea6107c6819cbe92377d9ae571e4d11d8e2135f7642dff0238e&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3D%22AdobeStock_214588216.mov%22&x-amz-checksum-mode=ENABLED&x-id=GetObject',
    'focus': (0.5, 0.5), 'start': 4},
  'mallorca': {
    'photo': 'https://stock-apex-images-prod-ew1.s3.eu-west-1.amazonaws.com/9aaf2980b6d4797c82ab9159c2c37adbf929b482e2761c1824e52eb82af993f2.jpg?response-content-disposition=attachment%3B%20filename%3D%22AdobeStock_1207102316.jpeg%22&response-content-type=image%2Fjpeg&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUMGGMQGERDWXM64M%2F20260916%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20260916T152630Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=7adb62c788cfd3ba516312660625a14fe83b3b3962b477b952418f01c0af67a0',
    'video': 'https://fotolia-prod-videos-0.s3.eu-west-1.amazonaws.com/02/33/23/83/F_233238335_zK7o9qLa9PZkEg3zmwsKVTvbGrKqLRDB.video?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAUMGGMQGEWQT4MZ67%2F20260916%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20260916T152705Z&X-Amz-Expires=3600&X-Amz-Signature=493fc68b8f6ba2e7701b545b359769444c67d3790fb24d0cd1663f6f2ac09b7c&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3D%22AdobeStock_233238335.mov%22&x-amz-checksum-mode=ENABLED&x-id=GetObject',
    'focus': (0.5, 0.45), 'start': 12},
  'lisbon': {
    'photo': 'https://stock-apex-images-prod-ew1.s3.eu-west-1.amazonaws.com/85b63c80c5ec9e7bf0c9fb30bf0f9426e0efa60b9d72e8e27ddc1d62071c0f27.jpg?response-content-disposition=attachment%3B%20filename%3D%22AdobeStock_225254446.jpeg%22&response-content-type=image%2Fjpeg&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUMGGMQGERDWXM64M%2F20260916%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20260916T152633Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=47730cae4ab875e9fc018324f3490e4a2e79050912b99713d9c0d1a4af97e992',
    'video': 'https://fotolia-prod-videos-0.s3.eu-west-1.amazonaws.com/04/88/00/47/F_488004773_KlmJlu4dU18lylvRr6bNYYTet7PBIyOK.video?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAUMGGMQGEWQT4MZ67%2F20260916%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20260916T152708Z&X-Amz-Expires=3600&X-Amz-Signature=4e222e0a7dd5932b8569ca7c06d1af3d8e90fe2d5969218e6beb6793f442d657&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3D%22AdobeStock_488004773.mov%22&x-amz-checksum-mode=ENABLED&x-id=GetObject',
    'focus': (0.62, 0.62), 'start': 1},
}

def crop(im, ratio, fx, fy):
    W, H = im.size
    w, h = (int(H * ratio), H) if W / H > ratio else (W, int(W / ratio))
    x = int(min(max(fx * W - w / 2, 0), W - w)); y = int(min(max(fy * H - h / 2, 0), H - h))
    return im.crop((x, y, x + w, y + h))

def run(cmd):
    subprocess.run(cmd, check=True)

def main():
    os.makedirs(TMP, exist_ok=True)
    backup = os.path.join(A, '_illustrations-backup')
    if not os.path.exists(backup):
        os.makedirs(backup)
        for sub in ('images/places', 'video'):
            src = os.path.join(A, sub)
            if os.path.exists(src):
                shutil.copytree(src, os.path.join(backup, sub))
        print('Backed up illustrations to assets/_illustrations-backup')
    os.makedirs(os.path.join(A, 'images/places'), exist_ok=True)
    os.makedirs(os.path.join(A, 'video'), exist_ok=True)

    for n, s in SRC.items():
        jpg, mov = os.path.join(TMP, n + '.jpg'), os.path.join(TMP, n + '.mov')
        for url, path in ((s['photo'], jpg), (s['video'], mov)):
            if not os.path.exists(path):
                print('Downloading', os.path.basename(path)); urllib.request.urlretrieve(url, path)
        im = ImageOps.exif_transpose(Image.open(jpg)).convert('RGB')
        card, wide = crop(im, 16 / 11, *s['focus']), crop(im, 16 / 9, *s['focus'])
        for name, src, size, q in ((f'{n}-card-1280', card, (1280, 880), 72), (f'{n}-card-640', card, (640, 440), 78), (f'{n}-wide-1280', wide, (1280, 720), 72)):
            src.resize(size, Image.LANCZOS).save(os.path.join(A, 'images/places', name + '.webp'), 'WEBP', quality=q, method=6)
        mp4, webm = os.path.join(A, 'video', n + '.mp4'), os.path.join(A, 'video', n + '.webm')
        fc = ('[0:v]fps=24,scale=1280:720:flags=lanczos,format=yuv420p,split[a][b];'
              '[a]trim=1:7,setpts=PTS-STARTPTS[main];[b]trim=0:1,setpts=PTS-STARTPTS[head];'
              '[main][head]xfade=transition=fade:duration=1:offset=5,format=yuv420p[v]')
        run(['ffmpeg', '-y', '-v', 'error', '-ss', str(s['start']), '-t', '7', '-i', mov, '-an', '-filter_complex', fc, '-map', '[v]',
             '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-maxrate', '1500k', '-bufsize', '3000k', '-movflags', '+faststart', mp4])
        run(['ffmpeg', '-y', '-v', 'error', '-i', mp4, '-c:v', 'libvpx-vp9', '-b:v', '1100k', '-crf', '36', '-row-mt', '1', '-an', webm])
        print('Done', n)
    shutil.rmtree(TMP, ignore_errors=True)
    print('All destination assets installed.')

if __name__ == '__main__':
    main()
