// The root build file now only defines the versions of plugins
// available to the subprojects. It does not apply or configure them.
plugins {
    id("org.springframework.boot") version "3.3.1" apply false
    id("io.spring.dependency-management") version "1.1.5" apply false
    kotlin("jvm") version "1.9.24" apply false
}