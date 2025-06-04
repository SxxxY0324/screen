package com.jwsxy.screenback.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.function.Function;

/**
 * JSON工具类，提供JSON解析和数据提取功能
 */
public class JsonUtils {
    private static final Logger logger = LoggerFactory.getLogger(JsonUtils.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * 将JSON字符串解析为JsonNode对象
     * 
     * @param json JSON字符串
     * @return JsonNode对象
     */
    public static JsonNode parseJson(String json) {
        if (json == null || json.trim().isEmpty()) {
            return null;
        }
        
        try {
            return objectMapper.readTree(json);
        } catch (JsonProcessingException e) {
            logger.error("JSON解析错误: {}, JSON内容: {}...", e.getMessage(), 
                    json.substring(0, Math.min(100, json.length())));
            return null;
        }
    }
    
    /**
     * 通用方法：从JsonNode中安全地获取指定类型的值
     * 
     * @param <T> 返回值类型
     * @param jsonNode JsonNode对象
     * @param fieldName 字段名
     * @param defaultValue 默认值
     * @param converter 转换函数
     * @return 转换后的值，如果不存在或转换失败则返回默认值
     */
    private static <T> T getValue(JsonNode jsonNode, String fieldName, T defaultValue, Function<JsonNode, T> converter) {
        if (jsonNode == null || !jsonNode.has(fieldName)) {
            return defaultValue;
        }
        
        try {
            JsonNode node = jsonNode.get(fieldName);
            return converter.apply(node);
        } catch (Exception e) {
            logger.debug("从JSON获取字段 {} 值失败: {}", fieldName, e.getMessage());
            return defaultValue;
        }
    }
    
    /**
     * 通用方法：从JsonNode中安全地获取指定类型的值，支持多个可能的字段名
     * 
     * @param <T> 返回值类型
     * @param jsonNode JsonNode对象
     * @param defaultValue 默认值
     * @param converter 转换函数
     * @param fieldNames 可能的字段名列表
     * @return 转换后的值，如果所有字段都不存在或转换失败则返回默认值
     */
    private static <T> T getValue(JsonNode jsonNode, T defaultValue, Function<JsonNode, T> converter, String... fieldNames) {
        if (jsonNode == null || fieldNames == null || fieldNames.length == 0) {
            return defaultValue;
        }
        
        for (String fieldName : fieldNames) {
            if (jsonNode.has(fieldName)) {
                try {
                    JsonNode node = jsonNode.get(fieldName);
                    return converter.apply(node);
                } catch (Exception e) {
                    // 继续尝试下一个字段
                    logger.trace("从JSON获取字段 {} 值失败: {}", fieldName, e.getMessage());
                    continue;
                }
            }
        }
        
        return defaultValue;
    }
    
    /**
     * 从JsonNode中安全地获取字符串值
     * 
     * @param jsonNode JsonNode对象
     * @param fieldName 字段名
     * @return 字符串值，如果不存在或类型不匹配则返回null
     */
    public static String getStringValue(JsonNode jsonNode, String fieldName) {
        return getValue(jsonNode, fieldName, null, node -> 
            node.isTextual() ? node.asText() : node.toString());
    }
    
    /**
     * 从JsonNode中安全地获取字符串值，支持多个可能的字段名
     * 
     * @param jsonNode JsonNode对象
     * @param fieldNames 可能的字段名列表
     * @return 字符串值，如果所有字段都不存在则返回null
     */
    public static String getStringValue(JsonNode jsonNode, String... fieldNames) {
        return getValue(jsonNode, null, node -> 
            node.isTextual() ? node.asText() : node.toString(), fieldNames);
    }
    
    /**
     * 从JsonNode中安全地获取整数值
     * 
     * @param jsonNode JsonNode对象
     * @param fieldName 字段名
     * @return 整数值，如果不存在或类型不匹配则返回0
     */
    public static Integer getIntegerValue(JsonNode jsonNode, String fieldName) {
        return getValue(jsonNode, fieldName, 0, node -> {
            if (node.isInt()) {
                return node.asInt();
            }
            return Integer.parseInt(node.asText());
        });
    }
    
    /**
     * 从JsonNode中安全地获取整数值，支持多个可能的字段名
     * 
     * @param jsonNode JsonNode对象
     * @param fieldNames 可能的字段名列表
     * @return 第一个找到的整数值，如果所有字段都不存在则返回0
     */
    public static Integer getIntegerValue(JsonNode jsonNode, String... fieldNames) {
        return getValue(jsonNode, 0, node -> {
            if (node.isInt()) {
                return node.asInt();
            }
            return Integer.parseInt(node.asText());
        }, fieldNames);
    }
    
    /**
     * 从JsonNode中安全地获取布尔值
     * 
     * @param jsonNode JsonNode对象
     * @param fieldName 字段名
     * @return 布尔值，如果不存在或类型不匹配则返回false
     */
    public static Boolean getBooleanValue(JsonNode jsonNode, String fieldName) {
        return getValue(jsonNode, fieldName, false, node -> {
            if (node.isBoolean()) {
                return node.asBoolean();
            }
            return Boolean.parseBoolean(node.asText());
        });
    }
    
    /**
     * 从JsonNode中安全地获取Double值
     * 
     * @param jsonNode JsonNode对象
     * @param fieldName 字段名
     * @return Double值，如果不存在或类型不匹配则返回0.0
     */
    public static Double getDoubleValue(JsonNode jsonNode, String fieldName) {
        return getValue(jsonNode, fieldName, 0.0, node -> {
            if (node.isDouble() || node.isInt()) {
                return node.asDouble();
            }
            return Double.parseDouble(node.asText());
        });
    }
    
    /**
     * 从JsonNode中安全地获取Double值，支持多个可能的字段名
     * 
     * @param jsonNode JsonNode对象
     * @param fieldNames 可能的字段名列表
     * @return 第一个找到的Double值，如果所有字段都不存在则返回0.0
     */
    public static Double getDoubleValue(JsonNode jsonNode, String... fieldNames) {
        return getValue(jsonNode, 0.0, node -> {
            if (node.isDouble() || node.isInt()) {
                return node.asDouble();
            }
            return Double.parseDouble(node.asText());
        }, fieldNames);
    }
    
    /**
     * 打印JsonNode的结构，用于调试
     * 
     * @param jsonNode JsonNode对象
     * @param prefix 前缀，用于显示层次结构
     */
    public static void printJsonStructure(JsonNode jsonNode, String prefix) {
        if (jsonNode == null) {
            logger.debug("{}null", prefix);
            return;
        }
        
        if (jsonNode.isObject()) {
            logger.debug("{}Object {{", prefix);
            jsonNode.fields().forEachRemaining(entry -> {
                logger.debug("{}  {}:", prefix, entry.getKey());
                printJsonStructure(entry.getValue(), prefix + "    ");
            });
            logger.debug("{}}}", prefix);
        } else if (jsonNode.isArray()) {
            logger.debug("{}Array [", prefix);
            for (int i = 0; i < jsonNode.size(); i++) {
                logger.debug("{}  [{}]:", prefix, i);
                printJsonStructure(jsonNode.get(i), prefix + "    ");
            }
            logger.debug("{}]", prefix);
        } else {
            logger.debug("{}Value: {}", prefix, jsonNode.asText());
        }
    }
} 