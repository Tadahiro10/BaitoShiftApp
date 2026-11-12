package baito.shift.demo.service;

import org.springframework.scheduling.config.Task;
import org.springframework.stereotype.Service;

import baito.shift.demo.entity.ShiftSchedule;
import baito.shift.demo.repository.ShiftScheduleRepository;
import java.util.*;

/*Seriveクラスでやること
・受け取ったJSONファイルの中にある「休日、希望休を削除する」
・A列, B列, C列, D列を人の名前に変える
・Google calendarに追加したい
 */
@Service
public class ShiftScheduleService{
    //人名割り振り、休日の削除
    private final Map<String, String> nameMap = Map.of(
        "A列", "榮福さん",
        "B列", "自分",
        "C列", "丸山さん",
        "D列", "家吉さん",
        "E列", "中野さん",
        "F列", "市邊さん",
        "G列", "高橋さん",
        "H列", "大峡さん",
        "I列", ""
    );
    public List<ShiftSchedule> EditShiftData(List<ShiftSchedule> shiftList) {
        //removeifはラムダ式での記述
        shiftList.removeIf(shift -> 
            "休日".equals(shift.getTaskCode()) || "希望休".equals(shift.getTaskCode())
        );
        //PartnerName1,2の変更
        for (ShiftSchedule shift : shiftList) {
            // getOrDefault: 辞書にあればその名前を、なければ元の文字（A列など）をそのまま使う
            //ヌルぽが発生するため、!=nullの条件付き
            if (shift.getPartnerName1() != null) {
                String realName1 = nameMap.getOrDefault(shift.getPartnerName1(), shift.getPartnerName1());
                shift.setPartnerName1(realName1);
            }
            if(shift.getPartnerName2() != null){
                String realName2 = nameMap.getOrDefault(shift.getPartnerName2(), shift.getPartnerName2());
                shift.setPartnerName2(realName2);   
            }
        }
        return shiftList;
    }

}
