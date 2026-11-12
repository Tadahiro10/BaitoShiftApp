package baito.shift.demo.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/status")
    public Map<String, Object> status(Authentication authentication) {
        Map<String, Object> result = new HashMap<>();   // HashMap は null が入っても大丈夫

        // 未ログイン、またはGoogleログイン以外の状態
        if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User user)) {
            result.put("loggedIn", false);
            return result;
        }

        result.put("loggedIn", true);
        result.put("name", user.getAttribute("name"));
        return result;
    }
}
