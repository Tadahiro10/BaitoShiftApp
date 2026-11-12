import React from 'react';
import type { ShiftData } from '../App';

interface ShiftTabulateProps {
  data: ShiftData[];
  onChange: (newData: ShiftData[]) => void; // 親のデータを更新するためのコールバックを追加
}

export const ShiftTabulate: React.FC<ShiftTabulateProps> = ({ data, onChange }) => {

  // セルの値が変更されたときの処理（直接親のStateを更新する）
  const handleInputChange = (rowIndex: number, field: keyof ShiftData, value: string) => {
    const newData = [...data];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [field]: value
    };
    onChange(newData); // App.tsxのsetShiftDataを呼び出す
  };
  
  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '800px', backgroundColor: '#fff' }}>
          
          <thead style={{ backgroundColor: '#f8f9fa', position: 'sticky', top: 0, zIndex: 1 }}>
            <tr>
              <th style={styles.th}>日付</th>
              <th style={styles.th}>開始</th>
              <th style={styles.th}>終了</th>
              <th style={styles.th}>タスク</th>
              <th style={styles.th}>パートナー1</th>
              <th style={styles.th}>パートナー2</th>
              <th style={styles.th}>1のタスク</th>
              <th style={styles.th}>2のタスク</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} style={{ borderBottom: '1px solid #eee' }}>
                <td style={styles.td}>
                  <input type="date" style={styles.input} value={row.workDate || ''}
                    onChange={(e) => handleInputChange(rowIndex, 'workDate', e.target.value)} />
                </td>
                <td style={styles.td}>
                  <input type="time" style={styles.input} value={row.startTime || ''}
                    onChange={(e) => handleInputChange(rowIndex, 'startTime', e.target.value)} />
                </td>
                <td style={styles.td}>
                  <input type="time" style={styles.input} value={row.endTime || ''}
                    onChange={(e) => handleInputChange(rowIndex, 'endTime', e.target.value)} />
                </td>
                <td style={styles.td}>
                  <input type="text" style={styles.input} value={row.taskCode || ''}
                    onChange={(e) => handleInputChange(rowIndex, 'taskCode', e.target.value)} />
                </td>
                <td style={styles.td}>
                  <input type="text" style={styles.input} value={row.partnerName1 || ''}
                    onChange={(e) => handleInputChange(rowIndex, 'partnerName1', e.target.value)} />
                </td>
                <td style={styles.td}>
                  <input type="text" style={styles.input} value={row.partnerName2 || ''}
                    onChange={(e) => handleInputChange(rowIndex, 'partnerName2', e.target.value)} />
                </td>
                <td style={styles.td}>
                  <input type="text" style={styles.input} value={row.partnerTask1 || ''}
                    onChange={(e) => handleInputChange(rowIndex, 'partnerTask1', e.target.value)} />
                </td>
                <td style={styles.td}>
                  <input type="text" style={styles.input} value={row.partnerTask2 || ''}
                    onChange={(e) => handleInputChange(rowIndex, 'partnerTask2', e.target.value)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  th: {
    border: '1px solid #ccc', padding: '10px', textAlign: 'center' as const, fontWeight: 'bold', color: '#333', whiteSpace: 'nowrap' as const,
  },
  td: {
    border: '1px solid #ccc', padding: '0',
  },
  input: {
    width: '100%', height: '100%', boxSizing: 'border-box' as const, border: 'none', padding: '10px 8px', fontSize: '14px', outline: 'none', backgroundColor: 'transparent', transition: 'box-shadow 0.1s',
  }
};

const styleTag = document.createElement('style');
styleTag.innerHTML = `
  input:focus {
    box-shadow: inset 0 0 0 2px #1a73e8 !important;
    background-color: #f0f8ff !important;
  }
`;
document.head.appendChild(styleTag);

export default ShiftTabulate;
