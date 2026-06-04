package baito.shift.demo.controller;

import org.springframework.web.bind.annotation.RestController;

import baito.shift.demo.entity.ShiftSchedule;
import baito.shift.demo.repository.ShiftScheduleRepository;
import baito.shift.demo.service.ShiftScheduleService;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/shift")
@CrossOrigin(origins = "http://localhost:5173") //Reactからのアクセスを許可
public class ShiftScheduleController {
    //public final ShiftScheduleService service;
    public final ShiftScheduleRepository repository;
    
    // Serviceクラスを使えるようにする（DI：依存性の注入）
     public ShiftScheduleController(ShiftScheduleRepository repository){
        this.repository = repository;
    }
    @GetMapping
    public List<ShiftSchedule> showdata() {
        return repository.findAll();
    }
    @PostMapping
    public ShiftSchedule transferShiftSchedule(@RequestBody ShiftSchedule entity) {
        System.out.print("You are sent data by React");
        return repository.save(entity);
    }
}
