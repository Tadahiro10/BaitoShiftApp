import React, { useState } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import {type ChangeEvent } from 'react';

const CLIENT_ID = '820781720380-vmhts2blfu0tt98aq6g3bic4oejjl3qu.apps.googleusercontent.com';
const STAFE_LIST = ['丸山さん','家吉さん','榮福さん','市邊さん','中野さん','大峡さん','太田さん'];

function AppContent() {
  // --- ① 記憶ボックス ---
  const [workDate, setWorkDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [taskCode, setTaskCode] = useState('');
  const [partnerName1, setPartnerName1] = useState('');
  const [partnerTask1, setPartnerTask1] = useState('');
  const [partnerName2, setPartnerName2] = useState('');
  const [partnerTask2, setPartnerTask2] = useState('');
  
  // 🔑 新規追加：Googleのカギ（アクセストークン）を保存する箱
  const [accessToken, setAccessToken] = useState('');

  // --- ② ログイン処理 ---
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('特別な鍵を取得:', tokenResponse.access_token);
      setAccessToken(tokenResponse.access_token); // 🔑 もらったカギを箱にしまう！
      alert('Googleカレンダー連携の準備が整いました！');
    },
    onError: () => console.log('ログイン失敗'),
    scope: 'https://www.googleapis.com/auth/calendar.events',
  });

  // --- ③ フォーム送信処理（DB保存 ＋ カレンダー連携） ---
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    // カギを持っていない（ログインしていない）場合は警告して止める
    if (!accessToken) {
      alert('先に「Googleでログイン」ボタンを押して、カレンダー連携を許可してください！');
      return;
    }

    // ---Spring Boot（データベース）への送信 ---
    const shiftData = {
      workDate, startTime, endTime, taskCode, 
      partnerName1, partnerTask1, partnerName2, partnerTask2
    };

    try {
      // Spring Bootへの通信
      const dbResponse = await fetch('http://localhost:8080/shift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shiftData),
      });

      if (!dbResponse.ok) {
        throw new Error('データベースへの保存に失敗しました');
      }

      // --- 【後半】Googleカレンダーへの送信 ---
      // Googleが読める形式（RFC3339）に日付と時間を合体させる（日本時間 +09:00）
      const startDateTime = `${workDate}T${startTime}:00+09:00`;
      const endDateTime = `${workDate}T${endTime}:00+09:00`;

      // Googleカレンダー用のデータ構造
      const calendarEvent = {
        summary: ` (${taskCode}ライン)`, // カレンダーに表示されるタイトル
        description: `${partnerName1}(${partnerTask1})\n${partnerName2}(${partnerTask2})`, // メモ欄
        start: { dateTime: startDateTime, timeZone: 'Asia/Tokyo' },
        end: { dateTime: endDateTime, timeZone: 'Asia/Tokyo' },
      };

      // GoogleカレンダーAPIへ通信！
      const calResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`, // 🔑 ここで特別なカギを見せる！
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(calendarEvent),
      });

      if (calResponse.ok) {
        alert('🎉 大成功！データベース保存とGoogleカレンダーへの登録が完了しました！');
      } else {
        alert('データベースには保存されましたが、カレンダー登録に失敗しました。');
      }

    } catch (error) {
      console.error('通信エラー:', error);
      alert('システムエラーが発生しました。');
    }
  };
  //I, G, Hラインを入力したら開始、終了時間を自動入力できる
  const handleTaskChange = (e:ChangeEvent<HTMLSelectElement>) => {
    const Task = e.target.value;
    setTaskCode(Task);

    if (Task === 'I') {
      setStartTime('17'); // 自動で時間を決める
      setEndTime('22')
    } else if(Task === 'G'||'H') {
      setStartTime('18');
      setEndTime('23');
    }
    else{
      setStartTime('');
      setEndTime('');
    }
  }

  return (
      <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>シフト登録アプリ</h2>
                
        {/* ログインボタンエリア */}
        <div style={{ marginBottom: '10px' }}>
          <button 
            onClick={() => login()} 
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Googleでログイン（カレンダー連携）
          </button>
        </div>
  
        <hr style={{ marginBottom: '30px', borderColor: '#ccc' }} />

        {/* シフト入力フォームエリア */}
        <h3>シフトを入力する</h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', width: '100%', maxWidth: '600px' }}>
            <div>
              <label>日付: </label>
              <input type="date"  value={workDate}  onChange={(e) => setWorkDate(e.target.value)} required
              style={{
                padding: '12px 15px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#fff',
                color: '#333',
                width: '100%',
                maxWidth: '150px',
                cursor: 'pointer'
              }}
               />
            </div>

            <div>
              <label>パートナー1: </label>
              <select 
                value={partnerName1} 
                onChange={(e) => setPartnerName1(e.target.value)} 
                required 
                style={{ padding: '5px', fontSize: '16px' }} // 少し見栄えを良くするためのオマケ
              >
                <option value="">入力してください</option>
                {STAFE_LIST.map((staffName) =>(
                  <option
                  key={staffName}
                  value={staffName}
                  disabled={staffName === partnerName2}
                  >
                    {staffName}
                  </option>
                ))}
                </select>
            </div>

            <div>
              <label>タスク1: </label>
              <select 
                value={partnerTask1} 
                onChange={(e) => setPartnerTask1(e.target.value)} 
                required 
                style={{ padding: '5px', fontSize: '16px' }} // 少し見栄えを良くするためのオマケ
              >
                <option value="">選択してください</option>
                <option value="I">I</option>
                <option value="G">G</option>
                <option value="H">H</option>
              </select>
            </div>

            <div>
              <label>開始時間: </label>
              <select 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)} 
                required
                style={{ padding: '5px', fontSize: '16px'}}
                >
                  <option value=""> 時間を選択してください</option>]
                  <option value="17">17:00</option>
                  <option value="18">18:00</option>
                </select>
            </div>

            <div>
              <label>パートナー2: </label>
              <select 
                value={partnerName2} 
                onChange={(e) => setPartnerName2(e.target.value)} 
                required 
                style={{ padding: '5px', fontSize: '16px' }} // 少し見栄えを良くするためのオマケ
              >
                <option value="">入力してください</option>
                {STAFE_LIST.map((staffName) => (
                  <option
                    key={staffName}
                    value={staffName}
                    disabled={staffName === partnerName1}
                    >
                      {staffName}
                    </option>
                ))}
                </select>
            </div>

            <div>
              <label>タスク2: </label>
              <select   
                value={partnerTask2} 
                onChange={(e) => setPartnerTask2(e.target.value)} 
                required
                style={{ padding: '5px', fontSize: '16px' }} // 少し見栄えを良くするためのオマケ
              >
                <option value="">選択してください</option>
                <option value="I">I</option>
                <option value="G">G</option>
                <option value="H">H</option>
              </select>
            </div>

            <div>
              <label>終了時間: </label>
              <select 
              value={endTime} 
              onChange={(e) => setStartTime(e.target.value)} 
              required
              style={{ padding: '5px', fontSize: '16px'}}
              >
                <option value=""> 時間を選択してください</option>]
                <option value="22">22:00</option>
                <option value="23">23:00</option>
              </select>            
            </div>
            <div>
              <label>自分のタスク: </label>
              <select   
                value={taskCode} 
                onChange={handleTaskChange} 
                required
                style={{ padding: '5px', fontSize: '16px' }} // 少し見栄えを良くするためのオマケ
              >
                <option value="">選択してください</option>
                <option value="I">I</option>
                <option value="G">G</option>
                <option value="H">H</option>
              </select>
            </div>
            
          </div> {/* Gridの箱はここまで */}

          <button type="submit" style={{ padding: '10px 30px', fontSize: '16px', cursor: 'pointer', marginTop: '20px' }}>
            登録する
          </button>
          
        </form>
      </div>
    //</GoogleOAuthProvider>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      {/* 上で作った中身をここで呼び出す */}
      <AppContent />
    </GoogleOAuthProvider>
  );
}

export default App;
