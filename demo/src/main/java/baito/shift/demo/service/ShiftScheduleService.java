package baito.shift.demo.service;

import org.springframework.scheduling.config.Task;
import org.springframework.stereotype.Service;

import baito.shift.demo.entity.ShiftSchedule;
import baito.shift.demo.repository.ShiftScheduleRepository;

@Service
public class ShiftScheduleService{
    //Repositoryからデータを受け取り、必要な計算や加工をする
    private final ShiftScheduleRepository repository;
    
    //DI Dependency Injection(依存注入)
    public ShiftScheduleService(ShiftScheduleRepository repository) {
        this.repository = repository;
    } 
    public ShiftSchedule SaveShift(ShiftSchedule Entity){
        return repository.save(Entity);
    }
}
