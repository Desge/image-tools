'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { cropImage, formatFileSize, getExtension, type ImageFormat } from '@/lib/canvas-utils';
import type { Translations } from '@/i18n';

export function ImageCropper({ t }: { t?: Translations } = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [aspectLock, setAspectLock] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [format, setFormat] = useState<ImageFormat>('image/png');
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 });
  const scaleRef = useRef(1);

  const aspectRatios = useMemo(() => [
    { label: t?.tools.crop.free || 'Free', w: 0, h: 0 },
    { label: '1:1', w: 1, h: 1 },
    { label: '4:3', w: 4, h: 3 },
    { label: '3:2', w: 3, h: 2 },
    { label: '16:9', w: 16, h: 9 },
    { label: '9:16', w: 9, h: 16 },
    { label: '3:4', w: 3, h: 4 },
    { label: '2:1', w: 2, h: 1 },
  ], [t]);

  const handleFile = useCallback((files: File[]) => {
    if (!files[0]) return;
    setFile(files[0]);
    setResultBlob(null);
    const reader = new FileReader();
    reader.onload = () => {
      const i = new Image();
      i.onload = () => {
        setImg(i);
        const maxW = 800;
        const scale = i.naturalWidth > maxW ? maxW / i.naturalWidth : 1;
        scaleRef.current = 1 / scale;
        setDisplaySize({ w: Math.round(i.naturalWidth * scale), h: Math.round(i.naturalHeight * scale) });
        setCrop({ x: 0, y: 0, w: Math.round(i.naturalWidth * scale), h: Math.round(i.naturalHeight * scale) });
      };
      i.src = reader.result as string;
    };
    reader.readAsDataURL(files[0]);
  }, []);

  const constrainCrop = useCallback((c: typeof crop, aspect: number) => {
    let { x, y, w, h } = c;
    if (x < 0) { w += x; x = 0; }
    if (y < 0) { h += y; y = 0; }
    if (x + w > displaySize.w) w = displaySize.w - x;
    if (y + h > displaySize.h) h = displaySize.h - y;
    if (aspect > 0) {
      const targetRatio = aspect;
      const currentRatio = w / h;
      if (currentRatio > targetRatio) w = h * targetRatio;
      else h = w / targetRatio;
      if (x + w > displaySize.w) { w = displaySize.w - x; h = w / targetRatio; }
      if (y + h > displaySize.h) { h = displaySize.h - y; w = h * targetRatio; }
    }
    return { x: Math.max(0, x), y: Math.max(0, y), w: Math.max(10, w), h: Math.max(10, h) };
  }, [displaySize]);

  // Draw preview
  useEffect(() => {
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, displaySize.w, displaySize.h);
    // Dark overlay
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Crop area highlight
    ctx.save();
    ctx.beginPath();
    ctx.rect(crop.x, crop.y, crop.w, crop.h);
    ctx.clip();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, displaySize.w, displaySize.h);
    ctx.restore();
    // Crop box
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 3]);
    ctx.strokeRect(crop.x, crop.y, crop.w, crop.h);
    // Grid lines
    ctx.setLineDash([4, 8]);
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(crop.x + crop.w * i / 3, crop.y);
      ctx.lineTo(crop.x + crop.w * i / 3, crop.y + crop.h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(crop.x, crop.y + crop.h * i / 3);
      ctx.lineTo(crop.x + crop.w, crop.y + crop.h * i / 3);
      ctx.stroke();
    }
  }, [img, crop, displaySize]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!img) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setDragStart({ x: mx, y: my });

    const handle = 8;
    const edges = {
      nw: Math.abs(mx - crop.x) < handle && Math.abs(my - crop.y) < handle,
      ne: Math.abs(mx - (crop.x + crop.w)) < handle && Math.abs(my - crop.y) < handle,
      sw: Math.abs(mx - crop.x) < handle && Math.abs(my - (crop.y + crop.h)) < handle,
      se: Math.abs(mx - (crop.x + crop.w)) < handle && Math.abs(my - (crop.y + crop.h)) < handle,
      n: Math.abs(my - crop.y) < handle && mx > crop.x + handle && mx < crop.x + crop.w - handle,
      s: Math.abs(my - (crop.y + crop.h)) < handle && mx > crop.x + handle && mx < crop.x + crop.w - handle,
      w: Math.abs(mx - crop.x) < handle && my > crop.y + handle && my < crop.y + crop.h - handle,
      e: Math.abs(mx - (crop.x + crop.w)) < handle && my > crop.y + handle && my < crop.y + crop.h - handle,
    };

    if (edges.nw) setDragging('nw');
    else if (edges.ne) setDragging('ne');
    else if (edges.sw) setDragging('sw');
    else if (edges.se) setDragging('se');
    else if (edges.n) setDragging('n');
    else if (edges.s) setDragging('s');
    else if (edges.w) setDragging('w');
    else if (edges.e) setDragging('e');
    else if (mx > crop.x && mx < crop.x + crop.w && my > crop.y && my < crop.y + crop.h) {
      setDragging('move');
    }
  }, [img, crop]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !img) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const dx = mx - dragStart.x;
    const dy = my - dragStart.y;
    let newCrop = { ...crop };

    const lock = aspectLock;
    switch (dragging) {
      case 'move': newCrop.x += dx; newCrop.y += dy; break;
      case 'se': newCrop.w += dx; newCrop.h += dy; break;
      case 'sw': newCrop.x += dx; newCrop.w -= dx; newCrop.h += dy; break;
      case 'ne': newCrop.w += dx; newCrop.y += dy; newCrop.h -= dy; break;
      case 'nw': newCrop.x += dx; newCrop.w -= dx; newCrop.y += dy; newCrop.h -= dy; break;
      case 'n': newCrop.y += dy; newCrop.h -= dy; break;
      case 's': newCrop.h += dy; break;
      case 'e': newCrop.w += dx; break;
      case 'w': newCrop.x += dx; newCrop.w -= dx; break;
    }

    if (lock > 0 && dragging !== 'move') {
      const ratio = lock;
      if (dragging === 'se' || dragging === 'nw') newCrop.h = newCrop.w / ratio;
      else if (dragging === 'sw' || dragging === 'ne') newCrop.h = newCrop.w / ratio;
      else if (dragging === 's') newCrop.w = newCrop.h * ratio;
      else if (dragging === 'e') newCrop.h = newCrop.w / ratio;
      else if (dragging === 'n') { newCrop.w = newCrop.h * ratio; newCrop.x = crop.x + crop.w - newCrop.w; }
      else if (dragging === 'w') { newCrop.h = newCrop.w / ratio; newCrop.y = crop.y + crop.h - newCrop.h; }
    }

    setCrop(constrainCrop(newCrop, lock));
    setDragStart({ x: mx, y: my });
  }, [dragging, crop, dragStart, img, constrainCrop, aspectLock]);

  const handleCrop = useCallback(async () => {
    if (!img) return;
    const s = scaleRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(crop.w * s);
    canvas.height = Math.round(crop.h * s);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, crop.x * s, crop.y * s, crop.w * s, crop.h * s, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((b) => b && setResultBlob(b), format, 0.92);
  }, [img, crop, format]);

  return (
    <div className="space-y-6">
      {!file && <FileDropzone onFilesSelected={handleFile} multiple={false} />}
      {file && img && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">{file.name} · {formatFileSize(file.size)}</span>
            <button onClick={() => { setFile(null); setImg(null); setResultBlob(null); }} className="text-sm text-blue-600 hover:underline">{t?.tools.crop.changeImage ?? '← Change'}</button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {aspectRatios.map((r, i) => (
              <button key={i} onClick={() => setAspectLock(r.w / (r.h || 1))}
                className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${(aspectLock === (r.w / (r.h || 1))) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}`}>
                {i === 0 ? (t?.tools.crop.free ?? r.label) : r.label}
              </button>
            ))}
          </div>
          <canvas ref={canvasRef} width={displaySize.w} height={displaySize.h}
            className="max-w-full border border-gray-200 dark:border-gray-700 rounded-xl cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setDragging(null)}
            onMouseLeave={() => setDragging(null)}
          />
          <div className="flex items-center gap-3 flex-wrap">
            <select value={format} onChange={(e) => setFormat(e.target.value as ImageFormat)}
              className="rounded-lg border px-3 py-2 text-sm">
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPG</option>
              <option value="image/webp">WebP</option>
            </select>
            <button onClick={handleCrop} className="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">{t?.tools.crop.cropBtn ?? 'Crop'}</button>
            {resultBlob && <DownloadButton blob={resultBlob} filename={`cropped-${file.name.replace(/\.[^.]+$/, '')}${getExtension(format)}`} />}
          </div>
          {resultBlob && <p className="text-sm text-green-600">{formatFileSize(resultBlob.size)}</p>}
        </div>
      )}
    </div>
  );
}
