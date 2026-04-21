plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

val googleServicesFile = file("google-services.json")
val hasGoogleServices = googleServicesFile.exists()
if (hasGoogleServices) {
    apply(plugin = "com.google.gms.google-services")
}

android {
    namespace = "com.timelineplus.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.timelineplus.app"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }



    val keystoreFile = file("keystore.jks")
    val keystorePassword: String? = System.getenv("KEYSTORE_PASSWORD")
    val keyAlias: String? = System.getenv("KEY_ALIAS")
    val keyPassword: String? = System.getenv("KEY_PASSWORD")
    val canSign = keystoreFile.exists() && !keystorePassword.isNullOrBlank()
        && !keyAlias.isNullOrBlank() && !keyPassword.isNullOrBlank()

    if (canSign) {
        signingConfigs {
            create("release") {
                storeFile = keystoreFile
                storePassword = keystorePassword
                this.keyAlias = keyAlias
                this.keyPassword = keyPassword
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            if (canSign) {
                signingConfig = signingConfigs.getByName("release")
            }
        }
        debug {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        viewBinding = true
        buildConfig = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
    implementation("androidx.webkit:webkit:1.11.0")
    implementation("androidx.activity:activity-ktx:1.9.2")

    // Firebase Cloud Messaging — only functional when google-services.json is present
    implementation(platform("com.google.firebase:firebase-bom:33.3.0"))
    implementation("com.google.firebase:firebase-messaging-ktx")
}