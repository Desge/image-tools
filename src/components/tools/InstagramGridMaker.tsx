'use client';

import { useState, useCallback, useMemo } from 'react';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { formatFileSize } from '@/lib/canvas-utils';
import JSZip from 'jszip';
import type { Translations } from '@/i18n';

export function InstagramGridMaker({ t }: { t?: Translations } = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [tiles, setTiles] = useState<{ blob: Blob; idx: number }[]>([]);
  const [layout, setLayout] = useState(0);

  const layouts = useMemo(() => [
    { label: t?.tools.instagramGrid.layout3x3 ?? '3×3 Grid (9 posts)', cols: 3, rows: 3 },
    { label: t?.tools.instagramGrid.layout3x2 ?? '3×2 Grid (6 posts)', cols: 3, rows: 2 },
    { label: t?.tools.instagramGrid.layout3x1 ?? '3×1 Row (3 posts)', cols: 3, rows: 1 },
    { label: t?.tools.instagramGrid.layout2x2 ?? '2×2 Grid (4 posts)', cols: 2, rows: 2 },
    { label: t?.tools.instagramGrid.layout2x1 ?? '2×1 Row (2 posts)', cols: 2, rows: 1 },
  ], [t]);

  const handleFile = useCallback((files: File[]) => {
    if (!files[0]) return;
    setFile(files[0]);
    setTiles([]);
  }, []);

  const split = useCallback(async () => {
    if (!file) return;
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = URL.createObjectURL(file);
    });
    const { cols, rows } = layouts[layout];
    const tileW = Math.floor(img.naturalWidth / cols);
    const tileH = Math.floor(img.naturalHeight / rows);
    const res: { blob: Blob; idx: number }[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const canvas = document.createElement('canvas');
        canvas.width = tileW; canvas.height = tileH;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, col * tileW, row * tileH, tileW, tileH, 0, 0, tileW, tileH);
        const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.92));
        res.push({ blob, idx: row * cols + col + 1 });
      }
    }
    setTiles(res);
  }, [file, layout]);

  const downloadAll = useCallback(async () => {
    const zip = new JSZip();
    tiles.forEach((t) => zip.file(`instagram-tile-${t.idx}.jpg`, t.blob));
    const z = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(z);
    const a = document.createElement('a'); a.href = url; a.download = 'instagram-grid.zip';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [tiles]);

  return (
    <div className="space-y-6">
      {!file && <FileDropzone onFilesSelected={handleFile} multiple={false} hint={t?.tools.instagramGrid.dropHint ?? 'Select a large image. Best results: square or portrait, high resolution.'} />}
      {file && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{file.name} · {formatFileSize(file.size)}</span>
            <button onClick={() => { setFile(null); setTiles([]); }} className="text-sm text-blue-600 hover:underline">{t?.tools.instagramGrid.changeImage ?? '← Change'}</button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select value={layout} onChange={(e) => setLayout(Number(e.target.value))} className="rounded-lg border px-3 py-2 text-sm">
              {layouts.map((l, i) => (<option key={i} value={i}>{l.label}</option>))}
            </select>
            <button onClick={split} className="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">{t?.tools.instagramGrid.splitBtn ?? 'Split'}</button>
          </div>
          {tiles.length > 0 && (
            <div className="space-y-3">
              <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${layouts[layout].cols}, 1fr)`, maxWidth: layouts[layout].cols * 130 }}>
                {tiles.map((tile) => (
                  <div key={tile.idx} className="relative group">
                    <img src={URL.createObjectURL(tile.blob)} alt={`Tile ${tile.idx}`}
                      className="w-full aspect-square object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">{tile.idx}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500">
                {t?.tools.instagramGrid.postOrder ?? 'Post in order'} {tiles.map((tile) => tile.idx).join(' → ')}
              </div>
              <div className="flex flex-wrap gap-2">
                {tiles.map((tile) => (<DownloadButton key={tile.idx} blob={tile.blob} filename={`ig-tile-${tile.idx}.jpg`} label={`${t?.tools.instagramGrid.downloadTile ?? 'Tile'} ${tile.idx}`} />))}
                <button onClick={downloadAll} className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700">{t?.tools.instagramGrid.downloadAll ?? 'Download All (ZIP)'}</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
