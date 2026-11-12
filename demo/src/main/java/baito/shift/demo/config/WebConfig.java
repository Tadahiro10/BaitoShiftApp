package baito.shift.demo.config; // configパッケージなどを新設して配置

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 全てのエンドポイントに対して
                .allowedOrigins("http://localhost:5173") // Reactのポートを許可
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // プレフライト(OPTIONS)を許可
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
