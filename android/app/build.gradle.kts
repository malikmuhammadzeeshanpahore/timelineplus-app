// ... other contents of build.gradle.kts

packaging {
    resources {
        excludes += "**/*.gz"
    }
} // New packaging syntax

// ... other contents of build.gradle.kts