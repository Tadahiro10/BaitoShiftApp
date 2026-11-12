package baito.shift.demo.controller;

import org.springframework.web.bind.annotation.RestController;
import baito.shift.demo.entity.ShiftSchedule;
import baito.shift.demo.service.ShiftScheduleService;
import baito.shift.demo.service.ShiftRegisterService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/shifts")                  //フロントエンドの fetch URL に合わせるためパスを指定
@CrossOrigin(origins = "http://localhost:5173") //Reactからのアクセスを許可
public class ShiftScheduleController {
    
    private final ShiftScheduleService service;
    private final ShiftRegisterService registerService;

    public ShiftScheduleController(ShiftScheduleService service,  ShiftRegisterService registerService){
        this.service = service;
        this.registerService = registerService;
    }
    
     // 役割: JSONを受け取り、serviceクラスで加工してReactに返す 人名、タスク名の割り振り
    @PostMapping("/batch")
    public ResponseEntity<List<ShiftSchedule>> processShiftData(@RequestBody List<ShiftSchedule> shiftdata) {
        // serviceクラスでデータの編集（不要なデータの削除や変換）
        List<ShiftSchedule> processedData = service.EditShiftData(shiftdata);
        
        // 加工後のデータをそのままReact（ShiftUploader.tsx）に返す
        return ResponseEntity.ok(processedData);
    }
     
    //Reactの画面でユーザーが最終確認・修正したデータを受け取り、DB、Google Calendarへの登録をする。
    @PostMapping("/register")
    public ResponseEntity<String> registerShiftData(@RequestBody List<ShiftSchedule> finalShiftData,@RegisteredOAuth2AuthorizedClient("google") OAuth2AuthorizedClient client) {
        try {
            String accessToken = client.getAccessToken().getTokenValue();
            registerService.registerAll(finalShiftData, accessToken);
            return ResponseEntity.ok("カレンダー登録とデータの保存が完了しました！");
        } catch (Exception e) {
            e.printStackTrace(); // コンソールで原因を確認できるようにする
            return ResponseEntity.internalServerError().body("登録処理中にエラーが発生しました: " + e.getMessage());
        }
    }
}
