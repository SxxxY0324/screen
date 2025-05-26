#!/bin/bash

echo "正在启动应用程序..."

# 设置JVM参数以允许旧的TLS协议和弱加密算法
JAVA_OPTS="-Djdk.tls.client.protocols=TLSv1,TLSv1.1,TLSv1.2 -Dhttps.protocols=TLSv1,TLSv1.1,TLSv1.2 -Djava.security.properties=./security.properties"

# 启动应用
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="$JAVA_OPTS"

echo "应用已停止" 