package baito.shift.demo.service;

import baito.shift.demo.entity.ShiftSchedule;
import baito.shift.demo.repository.ShiftScheduleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class ShiftRegisterService {

    private final ShiftScheduleRepository shiftScheduleRepository;
    private final GoogleCalendarService googleCalendarService;

    // コンストラクタ インジェクション
    public ShiftRegisterService(ShiftScheduleRepository shiftScheduleRepository, GoogleCalendarService googleCalendarService) {
        this.shiftScheduleRepository = shiftScheduleRepository;
        this.googleCalendarService = googleCalendarService;
    }

    /**
     * コントローラーから呼ばれるメインのメソッド
     * DB保存とカレンダー登録を両方実行します。
     */
    @Transactional(rollbackFor = Exception.class)
    public void registerAll(List<ShiftSchedule> shiftList, String accessToken) throws Exception {
        //登録時の不備の確認
        validateAll(shiftList);

        //DBへ保存
        saveAllShiftsToDB(shiftList);

        //カレンダーへ登録
        registerToGoogleCalendar(shiftList, accessToken);
    }

    // --- 以下は内部処理用のprivateメソッド ---

    // DBへの登録
    private void saveAllShiftsToDB(List<ShiftSchedule> shiftList) {
        shiftScheduleRepository.saveAll(shiftList);
    }

    // カレンダーへの登録
    private void registerToGoogleCalendar(List<ShiftSchedule> shiftList, String accessToken) throws Exception {
        // ループは GoogleCalendarService 側で行うので、リストごと渡す
        googleCalendarService.addEventsToCalendar(shiftList, accessToken);
    }

    //validateAll 記述が正しいかの確認
    private void validateAll(List<ShiftSchedule> shiftList) {
    List<String> errors = new ArrayList<>();

    for (int i = 0; i < shiftList.size(); i++) {
        ShiftSchedule s = shiftList.get(i);
        int row = i + 1;

        if (s.getWorkDate() == null) errors.add(row + "件目: 日付がありません");
        if (s.getStartTime() == null) errors.add(row + "件目: 開始時刻がありません");
        if (s.getEndTime() == null) errors.add(row + "件目: 終了時刻がありません");
        if (s.getTaskCode() == null || s.getTaskCode().isBlank()) errors.add(row + "件目: 作業コードがありません");

        if (s.getStartTime() != null && s.getEndTime() != null
                && !s.getEndTime().isAfter(s.getStartTime())) {
            errors.add(row + "件目: 終了時刻が開始時刻より前です");
        }
    }

    if (!errors.isEmpty()) {
        throw new IllegalArgumentException(String.join("\n", errors));
    }
}
}
