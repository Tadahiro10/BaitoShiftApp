package baito.shift.demo.service;

import baito.shift.demo.entity.ShiftSchedule;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.*;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class GoogleCalendarService {
    private static final ZoneId TOKYO = ZoneId.of("Asia/Tokyo");

    // シフトの一覧をまとめてカレンダーに登録する
    public void addEventsToCalendar(List<ShiftSchedule> shifts, String accessToken) throws Exception {
        Calendar client = createClient(accessToken);

        // 先に全件の予定データを作っておく(ここで失敗すれば何も登録されない)
        List<Event> events = new ArrayList<>();
        for (ShiftSchedule shift : shifts) {
            events.add(buildEvent(shift));
        }
    
        // 登録できた予定のIDを覚えておく
        List<String> createdIds = new ArrayList<>();
        try {
            for (Event event : events) {
                Event created = client.events().insert("primary", event).execute();
                createdIds.add(created.getId());
            }
        } catch (Exception e) {
            // 途中で失敗したら、登録済みの予定を削除して元に戻す
            for (String id : createdIds) {
                try {
                    client.events().delete("primary", id).execute();
                } catch (Exception deleteError) {
                    System.out.println("予定の取り消しに失敗しました: " + id);
                }
            }
         throw e; // エラーはそのまま上に伝える(DBも取り消される)
    }
}

    // ログインした人のトークンから Google Calendar のクライアントを作る
    private Calendar createClient(String accessToken) throws Exception {
        GoogleCredentials credentials = GoogleCredentials.create(new AccessToken(accessToken, null));
        return new Calendar.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance(),
                new HttpCredentialsAdapter(credentials))
            .setApplicationName("baito-shift")
            .build();
    }

    // シフト1件から予定を作る
    private Event buildEvent(ShiftSchedule shift) {
        Event event = new Event()
            .setSummary(shift.getTaskCode()+"ライン")
            .setColorId("7")
            .setDescription(
                shift.getPartnerTask1() + "：" + shift.getPartnerName1() + "\n" +
                shift.getPartnerTask2() + "：" + shift.getPartnerName2()
            );
        LocalDate workDate = shift.getWorkDate();
        
        //開始と終了の設定
        event.setStart(toEventDateTime(workDate, shift.getStartTime()));
        event.setEnd(toEventDateTime(workDate, shift.getEndTime()));   

        return event;
    }
    //calendarに送るように時間を整えている
    private EventDateTime toEventDateTime(LocalDate date, LocalTime time) {
        // ① 日付と時刻を合体 → 2026-11-10T10:30
        // ② 東京のタイムゾーンを付与 → 2026-11-10T10:30+09:00[Asia/Tokyo]
        // ③ RFC3339 形式の文字列に変換 → "2026-11-10T10:30:00+09:00"
        String rfc3339 = LocalDateTime.of(date, time).atZone(TOKYO).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);

        // ④ Google API 用のオブジェクトを作成して返す 日時をセット タイムゾーン名もセット
        return new EventDateTime().setDateTime(new DateTime(rfc3339)).setTimeZone("Asia/Tokyo");
    }
}
