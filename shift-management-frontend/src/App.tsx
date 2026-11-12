import React, { useState, useEffect } from 'react';
import ShiftUploader from './components/ShiftUploader';
import ShiftTabulate from './components/ShiftTabulate';
import ShiftCompare from './components/ShiftCompare'
//import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export interface ShiftData {
  workDate: string;      // yyyy-MM-dd
  startTime: string;     // HH:mm
  endTime: string;       // HH:mm
  taskCode: string;
  partnerName1: string;
  partnerName2: string;
  partnerTask1: string;
  partnerTask2: string;
}

const App: React.FC = () => {
  const [shiftData, setShiftData] = useState<ShiftData[]>([]); // 編集・送信用データ
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);  // 比較用画像URL
  const [isComparing, setIsComparing] = useState(false);   // モード切替フラグ
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);// 画面上部に出す通知(null のときは非表示)
  const [isRegistering, setIsRegistering] = useState(false);// 登録処理中かどうか(ボタンの連打防止)
  const [authStatus, setAuthStatus] = useState<'checking' | 'loggedIn' | 'loggedOut'>('checking');
  const [userName, setUserName] = useState('');

  // ShiftUploaderから「Spring Bootでの処理結果」を受け取る
  const handleProcessCompleted = (data: ShiftData[]) => {
    setShiftData(data);
  };

  // 最終確認後、Googleカレンダーに登録する処理（Java側へ送信）
  const handleRegisterCalendar = async () => {
    setIsRegistering(true);
    try {
      const response = await fetch('http://localhost:8080/api/shifts/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shiftData),
        credentials: 'include',
      });
      if (response.status === 401) {
        // 未ログインならGoogleログインへ
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
        return;
      }
      if (response.ok) {
        setNotice({ type: 'success', text: 'Googleカレンダーへの登録が完了しました🎉' });
      } else {
        const message = await response.text(); // Spring Boot から返ってきたエラー文
        setNotice({ type: 'error', text: message || '登録に失敗しました。' });
        alert("登録に失敗しました。");
      }
    } catch (e) {
      alert("通信エラーが発生しました。");
    } finally {
    setIsRegistering(false);
    }
  };
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
  fetch('http://localhost:8080/api/auth/status', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      if (data.loggedIn) {
        setUserName(data.name ?? '');
        setAuthStatus('loggedIn');
      } else {
        setAuthStatus('loggedOut');
      }
    })
    .catch(() => setAuthStatus('loggedOut'));
}, []);
  //確認中
if (authStatus === 'checking') {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
      ログイン状態を確認中...
    </div>
  );
}

// 未ログイン:ログイン画面だけを表示
if (authStatus === 'loggedOut') {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', backgroundColor: '#f5f7f9', fontFamily: 'sans-serif' }}>
      <h2 style={{ margin: 0, color: '#333' }}>シフト登録</h2>
      <p style={{ margin: 0, color: '#666' }}>
        Googleカレンダーに登録するため、最初にGoogleアカウントでログインしてください。
      </p>
      <a
        href="http://localhost:8080/oauth2/authorization/google"
        style={{ padding: '12px 32px', backgroundColor: '#1a73e8', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
      >
        Googleでログイン
      </a>
    </div>
  );
}
  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', height: '100%', width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f7f9' }}>
      {notice && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '12px 24px',
          borderRadius: '8px',
          color: '#fff',
          fontWeight: 'bold',
          backgroundColor: notice.type === 'success' ? '#4caf50' : '#d32f2f',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          animation: 'slideDown 0.3s ease-out',
          whiteSpace: 'pre-line',
      }}>{notice.type === 'success' ? '✅ ' : '⚠️ '}{notice.text}</div>)}
      
      {/* ヘッダー：タイトル + ログインユーザー */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <h2 style={{ textAlign: 'center', margin: 0, color: '#333' }}>シフト登録</h2>
        <div style={{
          position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
          display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#555',
        }}>
          <span>👤 {userName || 'Googleユーザー'} でログイン中</span>
          <form action="http://localhost:8080/logout" method="post" style={{ margin: 0 }}>
          <button type="submit" style={{
            padding: '6px 12px', border: '1px solid #ccc', borderRadius: '6px',
            backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px',
          }}>
            ログアウト
            </button>
          </form>
        </div>
      </div>
      
      <div style={{ display: 'flex', flex: 1, gap: '20px', overflow: 'hidden' }}>
        
        {/* === 左カラム：入力 or 画像比較 (flex: 1 で画面の 1/3 を占める) === */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid #ccc', borderRadius: '8px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          {!isComparing ? (
            //JSONファイルの読み込み
            <div>
              <h3 style={{ marginTop: 0, color: '#1a73e8' }}>シフトデータの読み込み(JSONファイルを選択してください)</h3>
              <ShiftUploader onSuccess={handleProcessCompleted} />
            </div>
            
          ) : (
            //画像比較のコンポーネントから操作する
            <ShiftCompare
              previewUrl={previewUrl}
              onImageUpload={setPreviewUrl} // App.tsxのsetPreviewUrlを渡す
              onBack={() => setIsComparing(false)}
            />
          )}
        </div>
      
        {/* === 右カラム：プレビュー・編集・登録 (flex: 2 で画面の 2/3 を占める) === */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', border: '1px solid #ccc', borderRadius: '8px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>プレビュー・編集</h3>
          
          {/* 表エリア */}
          <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #eee', borderRadius: '4px', backgroundColor: '#fafafa' }}>
            {shiftData.length > 0 ? (
              <ShiftTabulate data={shiftData} onChange={setShiftData} />
            ) : (
              <div style={{ color: '#888', textAlign: 'center', marginTop: '10%' }}>
                左側でデータを読み込み、自分の担当の日がここに表が表示されます。
              </div>
            )}
          </div>
  
          {/* 下部アクションエリア */}
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
            {!isComparing ? (
              <div 
                onClick={() => setIsComparing(true)}
                style={{ textAlign: 'center', color: '#1a73e8', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline', padding: '10px' }}
              >
                🖼️ 写真と比較する
              </div>
            ) : (
            <button
              onClick={handleRegisterCalendar}
              disabled={isRegistering}
              style={{ width: '100%', padding: '15px', backgroundColor: isRegistering ? '#ccc' : '#4caf50', color: '#fff', fontSize: '16px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: isRegistering ? 'not-allowed' : 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                {isRegistering ? '登録中...' : '✅ 確認OK!Googleカレンダーに登録する'}
            </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
