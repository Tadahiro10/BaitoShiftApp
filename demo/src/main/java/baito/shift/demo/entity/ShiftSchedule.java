package baito.shift.demo.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

//以下はJPAの書き方になっている
@Entity                             // このクラスはデータベースのテーブルと対応することの宣言
@Table(name = "shift_schedules")    //テーブルを指定する
@Data                               //Getter, Setterの自動生成
public class ShiftSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate workDate;
    private String taskCode;

    private LocalTime startTime;
    private LocalTime endTime;

    private String partnerName1;
    private String partnerTask1;    
    
    private String partnerName2;
    private String partnerTask2;
}
