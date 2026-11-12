import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface Props {
  previewUrl: string | null;
  onImageUpload: (url: string | null) => void;
  onBack: () => void;
}

export const ShiftCompare: React.FC<Props> = ({ previewUrl, onImageUpload, onBack }) => {
  // 画像がドロップされた時の処理
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onImageUpload(URL.createObjectURL(file)); // 親コンポーネントの状態を更新
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }, // 画像ファイルのみ受け付ける
    multiple: false,
    noClick: !!previewUrl, // 画像表示中はクリックでのファイル選択を無効化（ズーム操作を優先）
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <h3 style={{ marginTop: 0, color: '#2e7d32' }}>画像と比較中</h3>

      {/* === ドロップエリア 兼 写真表示エリア === */}
      <div {...getRootProps()}style={{ position: 'relative', flex: 2, border: '2px dashed #ccc', borderRadius: '8px', overflow: 'hidden', backgroundColor: isDragActive ? '#e8f5e9' : '#fafafa',}}>
        <input {...getInputProps()} />

        {previewUrl ? (
          // 画像表示（既存のロジック）
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <TransformWrapper initialScale={1} minScale={0.5} maxScale={5} centerOnInit={true} wheel={{ step: 0.02 }}>
              <TransformComponent 
                wrapperStyle={{ width: "100%", height: "100%" }}
                contentStyle={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                <img 
                  src={previewUrl} 
                  alt="シフト表プレビュー" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', cursor: 'grab' }} 
                />
              </TransformComponent>
            </TransformWrapper>
          </div>
        ) : (
          // 画像がない時のメッセージ（ShiftUploaderのようなスタイルに）
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
            <button　type="button" style={{ padding: '8px 16px', marginBottom: '10px', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
                ファイルを選択
            </button>
            <p style={{ fontSize: '1.2em', fontWeight: 'bold', margin: '0 0 10px 0' }}>
              ここにシフト表の画像をドロップ
            </p>
            <p style={{ fontSize: '0.9em', margin: 0 }}>
              (もしくはここをクリックしてファイルを選択)
            </p>
          </div>
        )}
      </div>

      {/* === アクションボタン area === */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '1px', marginTop: '5px', width: '100%' }}>
        <button 
          onClick={onBack}
          style={{ flex: 1, padding: '5px', cursor: 'pointer', backgroundColor: '#f1f3f4', border: '1px solid #ddd', borderRadius: '4px', fontWeight: 'bold' }}
        >
          ← 入力画面に戻る
        </button>
        {/* 取り消すボタン（右側） */}
        {previewUrl && (
          <button
            onClick={() => onImageUpload(null)} // URLをnullにして取り消す
            style={{ flex: 1, padding: '5px', backgroundColor: '#666', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✖ 取り消す
          </button>
        )}
      </div>
    </div>
  );
};
export default ShiftCompare
