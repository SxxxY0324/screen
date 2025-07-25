package com.jwsxy.screenback.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * JWT工具类
 * 提供JWT令牌的生成、解析、验证等功能
 */
@Component
public class JwtUtils {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    /**
     * JWT密钥，从配置文件读取
     * 如果没有配置，使用默认值
     */
    @Value("${jwt.secret:JW-MES-Phone-Secret-Key-For-JWT-Token-Generation-2024}")
    private String secret;

    /**
     * JWT令牌过期时间（毫秒），默认24小时
     */
    @Value("${jwt.expiration:86400000}")
    private Long expiration;

    /**
     * 刷新令牌过期时间（毫秒），默认7天
     */
    @Value("${jwt.refresh.expiration:604800000}")
    private Long refreshExpiration;

    /**
     * 令牌前缀
     */
    private static final String TOKEN_PREFIX = "Bearer ";

    /**
     * 获取签名密钥
     * @return 签名密钥
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * 从令牌中获取用户名
     * @param token JWT令牌
     * @return 用户名
     */
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    /**
     * 从令牌中获取过期时间
     * @param token JWT令牌
     * @return 过期时间
     */
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    /**
     * 从令牌中获取指定声明
     * @param token JWT令牌
     * @param claimsResolver 声明解析器
     * @param <T> 返回类型
     * @return 声明值
     */
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    /**
     * 从令牌中获取所有声明
     * @param token JWT令牌
     * @return 所有声明
     */
    private Claims getAllClaimsFromToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            logger.warn("JWT令牌已过期: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("解析JWT令牌失败: {}", e.getMessage());
            throw new RuntimeException("无效的JWT令牌", e);
        }
    }

    /**
     * 检查令牌是否过期
     * @param token JWT令牌
     * @return 是否过期
     */
    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    /**
     * 为用户生成访问令牌
     * @param username 用户名
     * @return JWT令牌
     */
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username, expiration);
    }

    /**
     * 为用户生成访问令牌（带额外声明）
     * @param username 用户名
     * @param employeeId 员工ID
     * @param roleName 角色名称
     * @return JWT令牌
     */
    public String generateToken(String username, String employeeId, String roleName) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("employeeId", employeeId);
        claims.put("roleName", roleName);
        claims.put("tokenType", "access");
        return createToken(claims, username, expiration);
    }

    /**
     * 为用户生成刷新令牌
     * @param username 用户名
     * @return 刷新令牌
     */
    public String generateRefreshToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("tokenType", "refresh");
        return createToken(claims, username, refreshExpiration);
    }

    /**
     * 创建令牌
     * @param claims 声明
     * @param subject 主题（通常是用户名）
     * @param expiration 过期时间（毫秒）
     * @return JWT令牌
     */
    private String createToken(Map<String, Object> claims, String subject, Long expiration) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * 验证令牌
     * @param token JWT令牌
     * @param username 用户名
     * @return 是否有效
     */
    public Boolean validateToken(String token, String username) {
        try {
            final String tokenUsername = getUsernameFromToken(token);
            return (username.equals(tokenUsername) && !isTokenExpired(token));
        } catch (Exception e) {
            logger.warn("令牌验证失败: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 验证令牌有效性（不验证用户名）
     * @param token JWT令牌
     * @return 是否有效
     */
    public Boolean validateToken(String token) {
        try {
            // 只验证令牌是否未过期且格式正确
            return !isTokenExpired(token);
        } catch (Exception e) {
            logger.warn("令牌验证失败: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 从请求头中提取令牌
     * @param authHeader Authorization头
     * @return JWT令牌（不含前缀）
     */
    public String extractTokenFromHeader(String authHeader) {
        if (authHeader != null && authHeader.startsWith(TOKEN_PREFIX)) {
            return authHeader.substring(TOKEN_PREFIX.length());
        }
        return null;
    }

    /**
     * 检查令牌是否为刷新令牌
     * @param token JWT令牌
     * @return 是否为刷新令牌
     */
    public Boolean isRefreshToken(String token) {
        try {
            Claims claims = getAllClaimsFromToken(token);
            return "refresh".equals(claims.get("tokenType"));
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 从令牌中获取员工ID
     * @param token JWT令牌
     * @return 员工ID
     */
    public String getEmployeeIdFromToken(String token) {
        try {
            Claims claims = getAllClaimsFromToken(token);
            return (String) claims.get("employeeId");
        } catch (Exception e) {
            logger.warn("从令牌获取员工ID失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 从令牌中获取角色名称
     * @param token JWT令牌
     * @return 角色名称
     */
    public String getRoleNameFromToken(String token) {
        try {
            Claims claims = getAllClaimsFromToken(token);
            return (String) claims.get("roleName");
        } catch (Exception e) {
            logger.warn("从令牌获取角色名称失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 获取令牌剩余过期时间（秒）
     * @param token JWT令牌
     * @return 剩余过期时间（秒）
     */
    public Long getTokenRemainingTime(String token) {
        try {
            Date expirationDate = getExpirationDateFromToken(token);
            long remaining = expirationDate.getTime() - System.currentTimeMillis();
            return remaining > 0 ? remaining / 1000 : 0;
        } catch (Exception e) {
            return 0L;
        }
    }

    /**
     * 刷新令牌
     * 使用旧的令牌生成新的访问令牌
     * @param refreshToken 刷新令牌
     * @return 新的访问令牌
     */
    public String refreshAccessToken(String refreshToken) {
        try {
            if (!isRefreshToken(refreshToken) || isTokenExpired(refreshToken)) {
                throw new RuntimeException("无效的刷新令牌");
            }

            String username = getUsernameFromToken(refreshToken);
            String employeeId = getEmployeeIdFromToken(refreshToken);
            String roleName = getRoleNameFromToken(refreshToken);

            return generateToken(username, employeeId, roleName);
        } catch (Exception e) {
            logger.error("刷新令牌失败: {}", e.getMessage());
            throw new RuntimeException("刷新令牌失败", e);
        }
    }
} 