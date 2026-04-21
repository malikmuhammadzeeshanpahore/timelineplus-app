# TimelinePlus Android

Native Android WebView wrapper for `https://timelineplus.site/dashboard`.

## Features

- Single-activity WebView pinned to `timelineplus.site` (external links open in the browser)
- **Pull-to-refresh** via `SwipeRefreshLayout` (only active when scrolled to top)
- **Deep links**: any `https://timelineplus.site/*` URL opens directly in the app, plus the custom scheme `timelineplus://path`
- **File uploads** from the web (gallery, documents, and camera capture) using `WebChromeClient.onShowFileChooser`
- **File downloads** routed through Android's `DownloadManager` (saved to the public Downloads folder, with cookies forwarded)
- **Push notifications** scaffolded with Firebase Cloud Messaging (FCM) — works once you drop in `google-services.json`
- Cookies (including third-party), DOM/local storage, dark mode (algorithmic darkening on Android 13+), back-button navigation, state restoration on rotation

## Project layout

```
android/
├── app/
│   ├── build.gradle.kts
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── java/com/timelineplus/app/
│       │   ├── MainActivity.kt
│       │   ├── TimelinePlusApp.kt
│       │   └── fcm/AppFirebaseMessagingService.kt
│       └── res/...
├── build.gradle.kts
├── settings.gradle.kts
└── gradle/wrapper/gradle-wrapper.properties
```

- Application ID: `com.timelineplus.app`
- Min SDK 24 (Android 7.0), Target SDK 34
- JDK 17, Kotlin 1.9, AGP 8.5

## Building the APK with GitHub Actions (recommended)

A workflow at `.github/workflows/android.yml` builds both `debug` and `release` (unsigned) APKs on every push that touches `android/`, and uploads them as workflow artifacts you can download from the Actions tab.

1. Push the repo to GitHub.
2. Open the **Actions** tab → **Build Android APK** → pick the latest run → **Artifacts** → download `TimelinePlus-debug-apk`.
3. Side-load the APK on your device (allow installs from unknown sources).

### Enabling FCM in CI

To produce a build with working push notifications:

1. Create a Firebase project, add an Android app with package id `com.timelineplus.app`, download `google-services.json`.
2. Base64-encode it: `base64 -w 0 google-services.json | pbcopy`
3. In your GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `GOOGLE_SERVICES_JSON`
   - Value: paste the base64 string
4. Re-run the workflow. The build will inject the file before assembling.

Without that secret the app still builds and runs — push notifications are simply a no-op until the file is present.

## Building locally with Android Studio

1. Open `android/` in Android Studio (Hedgehog or newer).
2. Let it sync Gradle (downloads ~1 GB of dependencies the first time).
3. **Run ▶** to install on a connected device or emulator.
4. To produce a release APK: **Build → Generate Signed App Bundle / APK**.

## Signing the release APK for distribution

The CI build produces an **unsigned** release APK. To distribute via Play Store or as a side-load, sign it:

```bash
keytool -genkey -v -keystore timelineplus.jks -keyalg RSA -keysize 2048 -validity 10000 -alias timelineplus
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore timelineplus.jks app-release-unsigned.apk timelineplus
$ANDROID_HOME/build-tools/34.0.0/zipalign -v 4 app-release-unsigned.apk TimelinePlus.apk
$ANDROID_HOME/build-tools/34.0.0/apksigner verify TimelinePlus.apk
```

(Or set up `signingConfigs` in `app/build.gradle.kts` and let CI sign it — happy to wire that up if you want.)

## Verifying app-link auto-verification (deep links)

For Android to open `https://timelineplus.site/*` URLs directly without the chooser, host this file at `https://timelineplus.site/.well-known/assetlinks.json`:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.timelineplus.app",
    "sha256_cert_fingerprints": ["YOUR:SIGNING:CERT:SHA256:FINGERPRINT"]
  }
}]
```

Get the fingerprint after signing:

```bash
keytool -list -v -keystore timelineplus.jks -alias timelineplus | grep SHA256
```

Until that file is published, deep links still work — Android just shows the "Open with" chooser the first time.
