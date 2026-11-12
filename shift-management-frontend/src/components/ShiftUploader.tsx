import React, { useState } from 'react';
import type { ShiftData } from "../App";
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';


interface Props {
    onSuccess: (data: ShiftData[]) => void;
}

export const ShiftUploader: React.FC<Props> = ({ onSuccess }) => {
    const [jsonInput, setJsonInput] = useState<string>(''); 
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null); //ファイル選択画面のためのstate


    const handleSubmit = async () => {
        if (!jsonInput) return;

        setIsLoading(true);
        setError(null);

        try {
            const parsedData: ShiftData[] = JSON.parse(jsonInput);
        
            const response = await fetch('http://localhost:8080/api/shifts/batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                //credentials: 'include',
                body: JSON.stringify(parsedData),
            });
        
            if (!response.ok) {
                throw new Error(`サーバーエラー: ${response.status} ${response.statusText}`);
            }
            //springで編集したものを受け取る
            const resultData: ShiftData[] = await response.json() as ShiftData[];
            onSuccess(resultData);

        } catch (err: unknown) {
            if (err instanceof SyntaxError) {
                setError('JSONの形式が正しくありません。ファイルの内容を確認してください。');
            } else if (err instanceof Error) {
                setError(`送信に失敗しました: ${err.message}`);
            } else {
                setError('予期せぬエラーが発生しました。');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // ファイル名を画面表示用にセット
        setFileName(file.name);
        console.log("処理するファイル", file);

        // ファイルの中身を読み込んで jsonInput ステートにセットする処理
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setJsonInput(content); // ここでJSON文字列がセットされ、送信ボタンが押せるようになります
            setError(null); 
        };
        reader.onerror = () => {
            setError('ファイルの読み込みに失敗しました。');
        };
        reader.readAsText(file);
        }, []);
    
    const { getRootProps, getInputProps,isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'], // JSONファイルのみを許可
    },
    // multiple: false // もし1つのファイルだけ選択させたい場合はコメントアウトを外す
  });
        
    return (
        <div style={{ marginTop: '20px' }}>
            <div {...getRootProps()} style={{ marginBottom: '10px', padding: '20px', border: '2px dashed #ccc', borderRadius: '8px', backgroundColor: isDragActive ? '#e3f2fd' : '#fafafa'}}>
                <input {...getInputProps()} />

                <button     type="button" style={{ padding: '8px 16px', marginBottom: '10px', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
                    ファイルを選択
                </button>
                <p style={{ fontSize: '0.9em', margin: '0 0 10px 0', color: '#666' }}>
                    もしくはここにファイルをドロップ
                </p>
                {fileName && (
                    <div style={{ marginTop: '15px', color: '#1a73e8', fontWeight: 'bold',fontSize:"14pt" }}>
                        📄 選択中: {fileName}
                    </div>
                )}
            </div>

            {error && (
                <div style={{ color: '#d32f2f', marginBottom: '20px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
                    {error}
                </div>
            )}
            {fileName && (
                    <button
                      onClick={() => {
                        setFileName(null);
                        setJsonInput('');
                        setError(null);
                        // ※ファイル本体のステートもあればここでクリア
                      }}
                      style={{width:'15vw',padding: '8px',marginBottom: '20px', backgroundColor: '#666', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      ✖ ファイルを取り消す
                    </button>
                  )}
            
            <button
                onClick={handleSubmit}
                disabled={isLoading || !jsonInput.trim()}
                style={{ width: '100%',  padding: '12px',  cursor: (isLoading || !jsonInput.trim()) ? 'not-allowed' : 'pointer', backgroundColor: (isLoading || !jsonInput.trim()) ? '#ccc' : '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold'
                }}
            >
                {isLoading ? '処理中...' : 'Spring Bootへ送信して表を作成'}
            </button>
        </div>
    );
};

export default ShiftUploader;
