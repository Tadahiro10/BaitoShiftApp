package baito.shift.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import baito.shift.demo.entity.ShiftSchedule;
@Repository
public interface ShiftScheduleRepository extends JpaRepository<ShiftSchedule, Long>{
    //JpaRepository<T,ID> T:テーブルの名前、ID:tableの中で private Long idだからLong
    //Repositroyはデータの取得、保存、削除をやってくれる
}
