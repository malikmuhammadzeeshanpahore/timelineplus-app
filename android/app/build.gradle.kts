// ... other contents of build.gradle.kts

packaging {
    resources {
        exclude("**/*.gz")
    }
} // New packaging syntax

// ... other contents of build.gradle.kts