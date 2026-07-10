<script setup>
import SiteNav from "@/components/SiteNav.vue";
import SiteFooter from "@/components/SiteFooter.vue";
</script>

<template>
    <div class="w-full min-h-[100dvh]">
        <div class="report-shell mx-auto px-4 sm:px-6 pt-12 pb-16">
            <SiteNav />

            <main class="report-content mt-12">

                <h1>Proprietary Code Leakage Audit</h1>
                <p class="meta"><b>ThePixelMusic</b> (suspect fork) vs <b>PixelPlayerOSS</b> (permitted GPL base) vs <b>PixelPlayer</b> (proprietary reference) · 2026-07-02</p>
                <p class="meta">
                FORK: <code>github.com/ianshulyadav/ThePixelMusic</code> @ <code>1c5c731</code> · 346 commits · 1,269 files&ensp;|&ensp;
                OSS: <code>github.com/PixelPlayerHQ/PixelPlayerOSS</code> @ <code>01d7927</code> · 57 commits · 822 files&ensp;|&ensp;
                PROPRIETARY: <code>/home/f1sh/PixelPlayer</code> @ <code>8b91d99c</code> · 3,872 commits — license: <i>“Redistribution of this Software or any derivative work, in binary or source form, is strictly prohibited.”</i></p>

                <div class="verdict-box">
                <b>VERDICT: YES — the fork contains a large volume of proprietary-only code.</b><br>
                Of 411 fork files absent from OSS, <b>193 match proprietary files by name, 139 at ≥80% content similarity, 92 at ≥95%, and 20 are 100% identical</b>. 43 git blobs are <b>byte-identical</b> between fork and proprietary while absent from OSS. Dozens of Kotlin sources differ from the proprietary originals <b>only in the package declaration</b> (<code>com.theveloper.pixelplay → com.unshoo.pixelmusic</code>). The OSS README confirms these integrations (Telegram, Wear OS, Google Drive, Gemini, Cast, QQ Music, NetEase) were <b>removed</b> from the GPL release — so none of this code can have come from the permitted base.
                </div>

                <div class="cards">
                <div class="card"><div class="n">411</div><div class="l">fork-only files (absent from OSS)</div></div>
                <div class="card"><div class="n">193</div><div class="l">with a proprietary counterpart</div></div>
                <div class="card crit"><div class="n">139</div><div class="l">≥80% similar to proprietary</div></div>
                <div class="card crit"><div class="n">92</div><div class="l">≥95% (rename-only copies)</div></div>
                <div class="card crit"><div class="n">20</div><div class="l">100% identical files</div></div>
                <div class="card crit"><div class="n">43</div><div class="l">byte-identical git blobs not in OSS</div></div>
                </div>

                <h2>1 · Fork-only files vs proprietary</h2>
                <p>Fork-only = present in FORK, absent from OSS by both path <i>and</i> basename (path-only renames excluded). Sorted by similarity (normalized-line sequence matching). The 218 fork-only files with no proprietary match are mostly the YouTube Music/InnerTube and Last.fm Smart Mix trees — see §4. Feature-area breakdown of the 139 files ≥80%: <b>Wear OS 67 · Telegram 16 · AI/Gemini 14 · Google Drive 11 · Chromecast 11 · QQ Music 5 · NetEase 2 · Android Auto 2 · other 11</b>.</p>
                <div class="tablewrap"><table>
                <thead><tr><th>Fork-only file</th><th>Proprietary counterpart</th><th>Similarity</th><th>Verdict</th></tr></thead>
                <tbody><tr><td><code>app/src/main/assets/qq_sign.js</code></td><td><code>app/src/main/assets/qq_sign.js</code></td><td class="num">100.0%<div class="bar"><div class="fill v-crit" style="width:100.0%"></div></div></td><td><span class="badge v-crit">COPIED — identical</span></td></tr><tr><td><code>app/src/main/res/drawable-nonav/netease_cloud_music_logo_icon_206716__1_.xml</code></td><td><code>app/src/main/res/drawable-nonav/netease_cloud_music_logo_icon_206716__1_.xml</code></td><td class="num">100.0%<div class="bar"><div class="fill v-crit" style="width:100.0%"></div></div></td><td><span class="badge v-crit">COPIED — identical</span></td></tr><tr><td><code>app/src/main/res/drawable/gemini_ai.xml</code></td><td><code>app/src/main/res/drawable/gemini_ai.xml</code></td><td class="num">100.0%<div class="bar"><div class="fill v-crit" style="width:100.0%"></div></div></td><td><span class="badge v-crit">COPIED — identical</span></td></tr><tr><td><code>app/src/main/res/drawable/generate_playlist_ai.xml</code></td><td><code>app/src/main/res/drawable/generate_playlist_ai.xml</code></td><td class="num">100.0%<div class="bar"><div class="fill v-crit" style="width:100.0%"></div></div></td><td><span class="badge v-crit">COPIED — identical</span></td></tr><tr><td><code>app/src/main/res/drawable/netease_cloud_music_logo_icon_206716__1_.xml</code></td><td><code>app/src/main/res/drawable/netease_cloud_music_logo_icon_206716__1_.xml</code></td><td class="num">100.0%<div class="bar"><div class="fill v-crit" style="width:100.0%"></div></div></td><td><span class="badge v-crit">COPIED — identical</span></td></tr><tr><td><code>app/src/main/res/drawable/qq_music.xml</code></td><td><code>app/src/main/res/drawable/qq_music.xml</code></td><td class="num">100.0%<div class="bar"><div class="fill v-crit" style="width:100.0%"></div></div></td><td><span class="badge v-crit">COPIED — identical</span></td></tr><tr><td><code>app/src/main/res/drawable/rounded_cast_24.xml</code></td><td><code>app/src/main/res/drawable/rounded_cast_24.xml</code></td><td class="num">100.0%<div class="bar"><div class="fill v-crit" style="width:100.0%"></div></div></td><td><span class="badge v-crit">COPIED — identical</span></td></tr><tr><td><code>app/src/main/res/drawable/rounded_music_cast_24.xml</code></td><td><code>app/src/main/res/drawable/rounded_music_cast_24.xml</code></td><td class="num">100.0%<div class="bar"><div class="fill v-crit" style="width:100.0%"></div></div></td><td><span class="badge v-crit">COPIED — identical</span></td></tr><tr><td><code>app/src/main/res/drawable/rounded_watch_arrow_down_24.xml</code></td><td><code>app/src/main/res/drawable/rounded_watch_arrow_down_24.xml</code></td><td class="num">100.0%<div class="bar"><div class="fill v-crit" style="width:100.0%"></div></div></td><td><span class="badge v-crit">COPIED — identical</span></td></tr><tr><td><code>app/src/main/res/font/montserrat_bold.xml</code></td><td><code>app/src/main/res/font/montserrat_bold.xml</code></td><td class="num">100.0%<div class="bar"><div class="fill v-crit" style="width:100.0%"></div></div></td><td><span class="badge v-crit">COPIED — identical</span></td></tr><tr><td><code>app/src/main/res/values/font_certs.xml</code></td><td><code>app/src/main/res/values/font_certs.xml</code></td><td class="num">100.0%<div class="bar"><div class="fill v-crit" style="width:100.0%"></div></div></td><td><span class="badge v-crit">COPIED — identical</span></td></tr><tr><td><code>app/src/main/res/values/preloaded_fonts.xml</code></td><td><code>app/src/main/res/values/preloaded_fonts.xml</code></td><td class="num">100.0%<div class="bar"><div class="fill v-crit" style="width:100.0%"></div></div></td><td><span class="badge v-crit">COPIED — identical</span></td></tr><tr><td><code>app/src/main/res/xml/automotive_app_desc.xml</code></td><td><code>app/src/main/res/xml/automotive_app_desc.xml</code></td><td class="num">100.0%<div class="bar"><div class="fill v-crit" style="width:100.0%"></div></div></td><td><span class="badge v-crit">COPIED — identical</span></td></tr><tr><td><code>app/src/main/res/xml/locales_config.xml</code></td><td><code>app/src/main/res/xml/locales_config.xml</code></td><td class="num">100.0%<div class="bar"><div class="fill v-crit" style="width:100.0%"></div></div></td><td><span class="badge v-crit">COPIED — identical</span></td></tr><tr><td><code>wear/src/main/res/values-de/strings_wear.xml</code></td><td><code>wear/src/main/res/values-de/strings_wear.xml</code></td><td class="num">100.0%<div class="bar"><div class="fill v-crit" style="width:100.0%"></div></div></td><td><span class="badge v-crit">COPIED — identical</span></td></tr><tr><td><code>wear/src/main/res/values-es/strings_wear.xml</code></td><td><code>wear/src/main/res/values-es/strings_wear.xml</code></td><td class="num">100.0%<div class="bar"><div class="fill v-crit" style="width:100.0%"></div></div></td><td><span class="badge v-crit">COPIED — identical</span></td></tr><tr><td><code>wear/src/main/res/values-ko/strings_wear.xml</code></td><td><code>wear/src/main/res/values-ko/strings_wear.xml</code></td><td class="num">100.0%<div class="bar"><div class="fill v-crit" style="width:100.0%"></div></div></td><td><span class="badge v-crit">COPIED — identical</span></td></tr><tr><td><code>wear/src/main/res/values-nb/strings_wear.xml</code></td><td><code>wear/src/main/res/values-nb/strings_wear.xml</code></td><td class="num">100.0%<div class="bar"><div class="fill v-crit" style="width:100.0%"></div></div></td><td><span class="badge v-crit">COPIED — identical</span></td></tr><tr><td><code>wear/src/main/res/values-ru/strings_wear.xml</code></td><td><code>wear/src/main/res/values-ru/strings_wear.xml</code></td><td class="num">100.0%<div class="bar"><div class="fill v-crit" style="width:100.0%"></div></div></td><td><span class="badge v-crit">COPIED — identical</span></td></tr><tr><td><code>wear/src/main/res/values/strings_wear.xml</code></td><td><code>wear/src/main/res/values/strings_wear.xml</code></td><td class="num">100.0%<div class="bar"><div class="fill v-crit" style="width:100.0%"></div></div></td><td><span class="badge v-crit">COPIED — identical</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/remote/qqmusic/QQSignGenerator.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/remote/qqmusic/QQSignGenerator.kt</code></td><td class="num">99.6%<div class="bar"><div class="fill v-crit" style="width:99.6%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/telegram/TelegramCacheManager.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/telegram/TelegramCacheManager.kt</code></td><td class="num">99.6%<div class="bar"><div class="fill v-crit" style="width:99.6%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/data/WearVolumeRepository.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/data/WearVolumeRepository.kt</code></td><td class="num">99.5%<div class="bar"><div class="fill v-crit" style="width:99.5%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/gdrive/GDriveApiService.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/gdrive/GDriveApiService.kt</code></td><td class="num">99.4%<div class="bar"><div class="fill v-crit" style="width:99.4%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/service/http/CastSessionSecurity.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/service/http/CastSessionSecurity.kt</code></td><td class="num">99.4%<div class="bar"><div class="fill v-crit" style="width:99.4%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/gdrive/GDriveStreamProxy.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/gdrive/GDriveStreamProxy.kt</code></td><td class="num">99.2%<div class="bar"><div class="fill v-crit" style="width:99.2%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/data/WearTransferRepository.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/data/WearTransferRepository.kt</code></td><td class="num">99.2%<div class="bar"><div class="fill v-crit" style="width:99.2%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/service/wear/PhoneWatchTransferStateStore.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/service/wear/PhoneWatchTransferStateStore.kt</code></td><td class="num">99.1%<div class="bar"><div class="fill v-crit" style="width:99.1%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/service/wear/WearThemePaletteFactory.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/service/wear/WearThemePaletteFactory.kt</code></td><td class="num">99.0%<div class="bar"><div class="fill v-crit" style="width:99.0%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/telegram/TelegramStreamProxy.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/telegram/TelegramStreamProxy.kt</code></td><td class="num">99.0%<div class="bar"><div class="fill v-crit" style="width:99.0%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/presentation/theme/WearTheme.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/presentation/theme/WearTheme.kt</code></td><td class="num">98.9%<div class="bar"><div class="fill v-crit" style="width:98.9%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/presentation/viewmodel/CastRouteStateHolder.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/presentation/viewmodel/CastRouteStateHolder.kt</code></td><td class="num">98.8%<div class="bar"><div class="fill v-crit" style="width:98.8%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/remote/qqmusic/QQMusicEncryptInterceptor.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/remote/qqmusic/QQMusicEncryptInterceptor.kt</code></td><td class="num">98.7%<div class="bar"><div class="fill v-crit" style="width:98.7%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/telegram/TelegramRepository.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/telegram/TelegramRepository.kt</code></td><td class="num">98.6%<div class="bar"><div class="fill v-crit" style="width:98.6%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/data/WearDeviceMusicRepository.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/data/WearDeviceMusicRepository.kt</code></td><td class="num">98.6%<div class="bar"><div class="fill v-crit" style="width:98.6%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/database/TelegramDao.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/database/TelegramDao.kt</code></td><td class="num">98.5%<div class="bar"><div class="fill v-crit" style="width:98.5%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/presentation/telegram/auth/TelegramLoginViewModel.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/presentation/telegram/auth/TelegramLoginViewModel.kt</code></td><td class="num">98.5%<div class="bar"><div class="fill v-crit" style="width:98.5%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/test/java/com/unshoo/pixelmusic/data/service/http/CastSessionSecurityTest.kt</code></td><td><code>app/src/test/java/com/theveloper/pixelplay/data/service/http/CastSessionSecurityTest.kt</code></td><td class="num">98.5%<div class="bar"><div class="fill v-crit" style="width:98.5%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/presentation/screens/DownloadsScreen.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/presentation/screens/DownloadsScreen.kt</code></td><td class="num">98.5%<div class="bar"><div class="fill v-crit" style="width:98.5%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/remote/qqmusic/QQMusicSecurity.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/remote/qqmusic/QQMusicSecurity.kt</code></td><td class="num">98.0%<div class="bar"><div class="fill v-crit" style="width:98.0%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>shared/src/main/java/com/unshoo/pixelmusic/shared/WearPlaybackCommand.kt</code></td><td><code>shared/src/main/java/com/theveloper/pixelplay/shared/WearPlaybackCommand.kt</code></td><td class="num">98.0%<div class="bar"><div class="fill v-crit" style="width:98.0%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/presentation/gdrive/auth/GDriveLoginViewModel.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/presentation/gdrive/auth/GDriveLoginViewModel.kt</code></td><td class="num">97.9%<div class="bar"><div class="fill v-crit" style="width:97.9%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>shared/src/main/java/com/unshoo/pixelmusic/shared/WearDataPaths.kt</code></td><td><code>shared/src/main/java/com/theveloper/pixelplay/shared/WearDataPaths.kt</code></td><td class="num">97.9%<div class="bar"><div class="fill v-crit" style="width:97.9%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/data/WearPlaybackController.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/data/WearPlaybackController.kt</code></td><td class="num">97.9%<div class="bar"><div class="fill v-crit" style="width:97.9%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/presentation/components/scoped/CastSheetState.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/presentation/components/scoped/CastSheetState.kt</code></td><td class="num">97.7%<div class="bar"><div class="fill v-crit" style="width:97.7%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/database/GDriveDao.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/database/GDriveDao.kt</code></td><td class="num">97.5%<div class="bar"><div class="fill v-crit" style="width:97.5%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/data/local/LocalSongDao.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/data/local/LocalSongDao.kt</code></td><td class="num">97.5%<div class="bar"><div class="fill v-crit" style="width:97.5%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/service/wear/WearCommandReceiver.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/service/wear/WearCommandReceiver.kt</code></td><td class="num">97.4%<div class="bar"><div class="fill v-crit" style="width:97.4%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/data/WearLifecycleState.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/data/WearLifecycleState.kt</code></td><td class="num">97.4%<div class="bar"><div class="fill v-crit" style="width:97.4%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/database/GDriveSongEntity.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/database/GDriveSongEntity.kt</code></td><td class="num">97.3%<div class="bar"><div class="fill v-crit" style="width:97.3%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/presentation/screens/SongListScreen.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/presentation/screens/SongListScreen.kt</code></td><td class="num">97.3%<div class="bar"><div class="fill v-crit" style="width:97.3%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/data/local/WearMusicDatabase.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/data/local/WearMusicDatabase.kt</code></td><td class="num">97.2%<div class="bar"><div class="fill v-crit" style="width:97.2%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/presentation/components/CastBottomSheet.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/presentation/components/CastBottomSheet.kt</code></td><td class="num">97.1%<div class="bar"><div class="fill v-crit" style="width:97.1%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/presentation/screens/AiUsageComponents.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/presentation/screens/AiUsageComponents.kt</code></td><td class="num">97.1%<div class="bar"><div class="fill v-crit" style="width:97.1%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>shared/src/main/java/com/unshoo/pixelmusic/shared/WearTransferMetadata.kt</code></td><td><code>shared/src/main/java/com/theveloper/pixelplay/shared/WearTransferMetadata.kt</code></td><td class="num">97.1%<div class="bar"><div class="fill v-crit" style="width:97.1%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/data/WearFavoriteSyncRepository.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/data/WearFavoriteSyncRepository.kt</code></td><td class="num">97.1%<div class="bar"><div class="fill v-crit" style="width:97.1%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/data/WearLibraryRepository.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/data/WearLibraryRepository.kt</code></td><td class="num">97.1%<div class="bar"><div class="fill v-crit" style="width:97.1%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>shared/src/main/java/com/unshoo/pixelmusic/shared/WearThemePalette.kt</code></td><td><code>shared/src/main/java/com/theveloper/pixelplay/shared/WearThemePalette.kt</code></td><td class="num">97.0%<div class="bar"><div class="fill v-crit" style="width:97.0%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/presentation/telegram/channel/TelegramSongItem.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/presentation/telegram/channel/TelegramSongItem.kt</code></td><td class="num">96.9%<div class="bar"><div class="fill v-crit" style="width:96.9%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/presentation/viewmodel/WearPlayerViewModel.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/presentation/viewmodel/WearPlayerViewModel.kt</code></td><td class="num">96.9%<div class="bar"><div class="fill v-crit" style="width:96.9%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/service/cast/CastOptionsProvider.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/service/cast/CastOptionsProvider.kt</code></td><td class="num">96.8%<div class="bar"><div class="fill v-crit" style="width:96.8%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/github/GitHubAnnouncementPropertiesService.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/github/GitHubAnnouncementPropertiesService.kt</code></td><td class="num">96.7%<div class="bar"><div class="fill v-crit" style="width:96.7%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/presentation/screens/QueueScreen.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/presentation/screens/QueueScreen.kt</code></td><td class="num">96.7%<div class="bar"><div class="fill v-crit" style="width:96.7%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/ai/AiNotificationManager.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/ai/AiNotificationManager.kt</code></td><td class="num">96.6%<div class="bar"><div class="fill v-crit" style="width:96.6%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/database/AiUsageDao.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/database/AiUsageDao.kt</code></td><td class="num">96.4%<div class="bar"><div class="fill v-crit" style="width:96.4%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/database/TelegramSongEntity.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/database/TelegramSongEntity.kt</code></td><td class="num">96.4%<div class="bar"><div class="fill v-crit" style="width:96.4%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>shared/src/main/java/com/unshoo/pixelmusic/shared/WearBrowseRequest.kt</code></td><td><code>shared/src/main/java/com/theveloper/pixelplay/shared/WearBrowseRequest.kt</code></td><td class="num">96.4%<div class="bar"><div class="fill v-crit" style="width:96.4%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>shared/src/main/java/com/unshoo/pixelmusic/shared/WearLibraryItem.kt</code></td><td><code>shared/src/main/java/com/theveloper/pixelplay/shared/WearLibraryItem.kt</code></td><td class="num">96.3%<div class="bar"><div class="fill v-crit" style="width:96.3%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/data/local/LocalSongEntity.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/data/local/LocalSongEntity.kt</code></td><td class="num">96.3%<div class="bar"><div class="fill v-crit" style="width:96.3%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/presentation/screens/BrowseScreen.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/presentation/screens/BrowseScreen.kt</code></td><td class="num">96.3%<div class="bar"><div class="fill v-crit" style="width:96.3%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/presentation/components/WearIndicators.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/presentation/components/WearIndicators.kt</code></td><td class="num">96.2%<div class="bar"><div class="fill v-crit" style="width:96.2%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/presentation/screens/MoreScreen.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/presentation/screens/MoreScreen.kt</code></td><td class="num">96.2%<div class="bar"><div class="fill v-crit" style="width:96.2%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/gdrive/GDriveRepository.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/gdrive/GDriveRepository.kt</code></td><td class="num">96.1%<div class="bar"><div class="fill v-crit" style="width:96.1%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/utils/AppLocaleManager.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/utils/AppLocaleManager.kt</code></td><td class="num">96.0%<div class="bar"><div class="fill v-crit" style="width:96.0%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/presentation/screens/VolumeScreen.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/presentation/screens/VolumeScreen.kt</code></td><td class="num">96.0%<div class="bar"><div class="fill v-crit" style="width:96.0%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/ai/provider/AiProviderSupport.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/ai/provider/AiProviderSupport.kt</code></td><td class="num">95.8%<div class="bar"><div class="fill v-crit" style="width:95.8%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/presentation/gdrive/dashboard/GDriveDashboardViewModel.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/presentation/gdrive/dashboard/GDriveDashboardViewModel.kt</code></td><td class="num">95.8%<div class="bar"><div class="fill v-crit" style="width:95.8%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/presentation/telegram/channel/TelegramChannelSearchViewModel.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/presentation/telegram/channel/TelegramChannelSearchViewModel.kt</code></td><td class="num">95.8%<div class="bar"><div class="fill v-crit" style="width:95.8%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/presentation/screens/TimerScreen.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/presentation/screens/TimerScreen.kt</code></td><td class="num">95.8%<div class="bar"><div class="fill v-crit" style="width:95.8%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/presentation/telegram/channel/TelegramChannelSearchSheet.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/presentation/telegram/channel/TelegramChannelSearchSheet.kt</code></td><td class="num">95.7%<div class="bar"><div class="fill v-crit" style="width:95.7%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>shared/src/main/java/com/unshoo/pixelmusic/shared/WearTransferProgress.kt</code></td><td><code>shared/src/main/java/com/theveloper/pixelplay/shared/WearTransferProgress.kt</code></td><td class="num">95.7%<div class="bar"><div class="fill v-crit" style="width:95.7%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/presentation/screens/LibraryListScreen.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/presentation/screens/LibraryListScreen.kt</code></td><td class="num">95.7%<div class="bar"><div class="fill v-crit" style="width:95.7%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/service/wear/PhoneDirectWatchTransferCoordinator.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/service/wear/PhoneDirectWatchTransferCoordinator.kt</code></td><td class="num">95.6%<div class="bar"><div class="fill v-crit" style="width:95.6%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/worker/AiWorkerManager.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/worker/AiWorkerManager.kt</code></td><td class="num">95.5%<div class="bar"><div class="fill v-crit" style="width:95.5%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>shared/src/main/java/com/unshoo/pixelmusic/shared/WearTransferRequest.kt</code></td><td><code>shared/src/main/java/com/theveloper/pixelplay/shared/WearTransferRequest.kt</code></td><td class="num">95.5%<div class="bar"><div class="fill v-crit" style="width:95.5%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>shared/src/main/java/com/unshoo/pixelmusic/shared/WearVolumeState.kt</code></td><td><code>shared/src/main/java/com/theveloper/pixelplay/shared/WearVolumeState.kt</code></td><td class="num">95.5%<div class="bar"><div class="fill v-crit" style="width:95.5%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/presentation/gdrive/dashboard/GDriveDashboardScreen.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/presentation/gdrive/dashboard/GDriveDashboardScreen.kt</code></td><td class="num">95.3%<div class="bar"><div class="fill v-crit" style="width:95.3%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/database/TelegramTopicEntity.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/database/TelegramTopicEntity.kt</code></td><td class="num">95.2%<div class="bar"><div class="fill v-crit" style="width:95.2%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/presentation/telegram/auth/TelegramLoginActivity.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/presentation/telegram/auth/TelegramLoginActivity.kt</code></td><td class="num">95.2%<div class="bar"><div class="fill v-crit" style="width:95.2%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/presentation/gdrive/auth/GDriveLoginActivity.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/presentation/gdrive/auth/GDriveLoginActivity.kt</code></td><td class="num">95.1%<div class="bar"><div class="fill v-crit" style="width:95.1%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/presentation/components/CurvedVolumeIndicator.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/presentation/components/CurvedVolumeIndicator.kt</code></td><td class="num">95.1%<div class="bar"><div class="fill v-crit" style="width:95.1%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/service/auto/AutoMediaBrowseTree.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/service/auto/AutoMediaBrowseTree.kt</code></td><td class="num">95.0%<div class="bar"><div class="fill v-crit" style="width:95.0%"></div></div></td><td><span class="badge v-crit">COPIED — near-verbatim (rename only)</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/presentation/components/Beta05CleanInstallDisclaimerDialog.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/presentation/components/Beta05CleanInstallDisclaimerDialog.kt</code></td><td class="num">94.9%<div class="bar"><div class="fill v-high" style="width:94.9%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/service/wear/WearPhoneTransferSender.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/service/wear/WearPhoneTransferSender.kt</code></td><td class="num">94.8%<div class="bar"><div class="fill v-high" style="width:94.8%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/presentation/telegram/dashboard/TelegramDashboardScreen.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/presentation/telegram/dashboard/TelegramDashboardScreen.kt</code></td><td class="num">94.8%<div class="bar"><div class="fill v-high" style="width:94.8%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/service/wear/PhoneWatchTransferCancellationStore.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/service/wear/PhoneWatchTransferCancellationStore.kt</code></td><td class="num">94.7%<div class="bar"><div class="fill v-high" style="width:94.7%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>shared/src/main/java/com/unshoo/pixelmusic/shared/WearVolumeCommand.kt</code></td><td><code>shared/src/main/java/com/theveloper/pixelplay/shared/WearVolumeCommand.kt</code></td><td class="num">94.7%<div class="bar"><div class="fill v-high" style="width:94.7%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/presentation/components/WearTopTimeText.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/presentation/components/WearTopTimeText.kt</code></td><td class="num">94.7%<div class="bar"><div class="fill v-high" style="width:94.7%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/presentation/screens/OutputScreen.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/presentation/screens/OutputScreen.kt</code></td><td class="num">94.7%<div class="bar"><div class="fill v-high" style="width:94.7%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/presentation/telegram/dashboard/TelegramDashboardViewModel.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/presentation/telegram/dashboard/TelegramDashboardViewModel.kt</code></td><td class="num">94.6%<div class="bar"><div class="fill v-high" style="width:94.6%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/presentation/viewmodel/CastStateHolder.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/presentation/viewmodel/CastStateHolder.kt</code></td><td class="num">94.3%<div class="bar"><div class="fill v-high" style="width:94.3%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/presentation/viewmodel/WearDownloadsViewModel.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/presentation/viewmodel/WearDownloadsViewModel.kt</code></td><td class="num">94.1%<div class="bar"><div class="fill v-high" style="width:94.1%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/presentation/components/PlayStoreAnnouncementDialog.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/presentation/components/PlayStoreAnnouncementDialog.kt</code></td><td class="num">93.9%<div class="bar"><div class="fill v-high" style="width:93.9%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/database/AiCacheDao.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/database/AiCacheDao.kt</code></td><td class="num">93.8%<div class="bar"><div class="fill v-high" style="width:93.8%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/presentation/WearNavigation.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/presentation/WearNavigation.kt</code></td><td class="num">93.8%<div class="bar"><div class="fill v-high" style="width:93.8%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/data/WearDataListenerService.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/data/WearDataListenerService.kt</code></td><td class="num">93.6%<div class="bar"><div class="fill v-high" style="width:93.6%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/di/WearModule.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/di/WearModule.kt</code></td><td class="num">93.6%<div class="bar"><div class="fill v-high" style="width:93.6%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/database/AiUsageEntity.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/database/AiUsageEntity.kt</code></td><td class="num">93.3%<div class="bar"><div class="fill v-high" style="width:93.3%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/gdrive/GDriveConstants.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/gdrive/GDriveConstants.kt</code></td><td class="num">93.3%<div class="bar"><div class="fill v-high" style="width:93.3%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>shared/src/main/java/com/unshoo/pixelmusic/shared/WearBrowseResponse.kt</code></td><td><code>shared/src/main/java/com/theveloper/pixelplay/shared/WearBrowseResponse.kt</code></td><td class="num">93.3%<div class="bar"><div class="fill v-high" style="width:93.3%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>shared/src/main/java/com/unshoo/pixelmusic/shared/WearFavoriteSyncPayload.kt</code></td><td><code>shared/src/main/java/com/theveloper/pixelplay/shared/WearFavoriteSyncPayload.kt</code></td><td class="num">93.3%<div class="bar"><div class="fill v-high" style="width:93.3%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/service/wear/WatchTransferForegroundService.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/service/wear/WatchTransferForegroundService.kt</code></td><td class="num">93.1%<div class="bar"><div class="fill v-high" style="width:93.1%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/presentation/viewmodel/WearBrowseViewModel.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/presentation/viewmodel/WearBrowseViewModel.kt</code></td><td class="num">93.0%<div class="bar"><div class="fill v-high" style="width:93.0%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/database/TelegramChannelEntity.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/database/TelegramChannelEntity.kt</code></td><td class="num">92.9%<div class="bar"><div class="fill v-high" style="width:92.9%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/data/WearStateRepository.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/data/WearStateRepository.kt</code></td><td class="num">92.7%<div class="bar"><div class="fill v-high" style="width:92.7%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/presentation/theme/WearTitleFonts.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/presentation/theme/WearTitleFonts.kt</code></td><td class="num">92.6%<div class="bar"><div class="fill v-high" style="width:92.6%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/preferences/TelegramTopicDisplayMode.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/preferences/TelegramTopicDisplayMode.kt</code></td><td class="num">92.3%<div class="bar"><div class="fill v-high" style="width:92.3%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>shared/src/main/java/com/unshoo/pixelmusic/shared/WearPlaybackResult.kt</code></td><td><code>shared/src/main/java/com/theveloper/pixelplay/shared/WearPlaybackResult.kt</code></td><td class="num">92.3%<div class="bar"><div class="fill v-high" style="width:92.3%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/WearApp.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/WearApp.kt</code></td><td class="num">92.3%<div class="bar"><div class="fill v-high" style="width:92.3%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/service/player/CastPlayer.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/service/player/CastPlayer.kt</code></td><td class="num">92.2%<div class="bar"><div class="fill v-high" style="width:92.2%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/database/GDriveFolderEntity.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/database/GDriveFolderEntity.kt</code></td><td class="num">90.9%<div class="bar"><div class="fill v-high" style="width:90.9%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/data/WearLocalPlayerRepository.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/data/WearLocalPlayerRepository.kt</code></td><td class="num">90.7%<div class="bar"><div class="fill v-high" style="width:90.7%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/presentation/WearMainActivity.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/presentation/WearMainActivity.kt</code></td><td class="num">90.7%<div class="bar"><div class="fill v-high" style="width:90.7%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/ai/provider/GenericOpenAiClient.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/ai/provider/GenericOpenAiClient.kt</code></td><td class="num">90.0%<div class="bar"><div class="fill v-high" style="width:90.0%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/database/AiCacheEntity.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/database/AiCacheEntity.kt</code></td><td class="num">90.0%<div class="bar"><div class="fill v-high" style="width:90.0%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/data/WearAudioOutputRoute.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/data/WearAudioOutputRoute.kt</code></td><td class="num">90.0%<div class="bar"><div class="fill v-high" style="width:90.0%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>shared/src/main/java/com/unshoo/pixelmusic/shared/WearPlayerState.kt</code></td><td><code>shared/src/main/java/com/theveloper/pixelplay/shared/WearPlayerState.kt</code></td><td class="num">89.7%<div class="bar"><div class="fill v-high" style="width:89.7%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/backup/module/AiUsageBackupHandler.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/backup/module/AiUsageBackupHandler.kt</code></td><td class="num">89.5%<div class="bar"><div class="fill v-high" style="width:89.5%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/presentation/components/OutputRouteIcon.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/presentation/components/OutputRouteIcon.kt</code></td><td class="num">89.5%<div class="bar"><div class="fill v-high" style="width:89.5%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>shared/src/main/java/com/unshoo/pixelmusic/shared/WearLibraryState.kt</code></td><td><code>shared/src/main/java/com/theveloper/pixelplay/shared/WearLibraryState.kt</code></td><td class="num">88.9%<div class="bar"><div class="fill v-high" style="width:88.9%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/presentation/viewmodel/CastTransferStateHolder.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/presentation/viewmodel/CastTransferStateHolder.kt</code></td><td class="num">88.1%<div class="bar"><div class="fill v-high" style="width:88.1%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/presentation/screens/PlayerScreen.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/presentation/screens/PlayerScreen.kt</code></td><td class="num">87.9%<div class="bar"><div class="fill v-high" style="width:87.9%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>wear/src/main/res/values/styles.xml</code></td><td><code>wear/src/main/res/values/styles.xml</code></td><td class="num">87.5%<div class="bar"><div class="fill v-high" style="width:87.5%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/presentation/viewmodel/AiStateHolder.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/presentation/viewmodel/AiStateHolder.kt</code></td><td class="num">86.1%<div class="bar"><div class="fill v-high" style="width:86.1%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/presentation/components/DailyMixMenu.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/presentation/components/DailyMixMenu.kt</code></td><td class="num">84.6%<div class="bar"><div class="fill v-high" style="width:84.6%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>wear/src/main/res/values/wear_capabilities.xml</code></td><td><code>wear/src/main/res/values/wear_capabilities.xml</code></td><td class="num">83.3%<div class="bar"><div class="fill v-high" style="width:83.3%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/telegram/TelegramClientManager.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/telegram/TelegramClientManager.kt</code></td><td class="num">81.1%<div class="bar"><div class="fill v-high" style="width:81.1%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/ai/provider/AiProvider.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/ai/provider/AiProvider.kt</code></td><td class="num">81.0%<div class="bar"><div class="fill v-high" style="width:81.0%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/worker/AiWorker.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/worker/AiWorker.kt</code></td><td class="num">80.4%<div class="bar"><div class="fill v-high" style="width:80.4%"></div></div></td><td><span class="badge v-high">COPIED — lightly modified</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/service/wear/WearStatePublisher.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/service/wear/WearStatePublisher.kt</code></td><td class="num">79.3%<div class="bar"><div class="fill v-med" style="width:79.3%"></div></div></td><td><span class="badge v-med">Derived — substantially copied</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/image/TelegramCoilFetcher.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/image/TelegramCoilFetcher.kt</code></td><td class="num">78.7%<div class="bar"><div class="fill v-med" style="width:78.7%"></div></div></td><td><span class="badge v-med">Derived — substantially copied</span></td></tr><tr><td><code>app/src/test/java/com/unshoo/pixelmusic/data/ai/provider/AiProviderSupportTest.kt</code></td><td><code>app/src/test/java/com/theveloper/pixelplay/data/ai/provider/AiProviderSupportTest.kt</code></td><td class="num">78.3%<div class="bar"><div class="fill v-med" style="width:78.3%"></div></div></td><td><span class="badge v-med">Derived — substantially copied</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/ai/provider/AiClient.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/ai/provider/AiClient.kt</code></td><td class="num">76.1%<div class="bar"><div class="fill v-med" style="width:76.1%"></div></div></td><td><span class="badge v-med">Derived — substantially copied</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/ai/provider/AiClientFactory.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/ai/provider/AiClientFactory.kt</code></td><td class="num">72.7%<div class="bar"><div class="fill v-med" style="width:72.7%"></div></div></td><td><span class="badge v-med">Derived — substantially copied</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/ai/AiPlaylistGenerator.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/ai/AiPlaylistGenerator.kt</code></td><td class="num">72.0%<div class="bar"><div class="fill v-med" style="width:72.0%"></div></div></td><td><span class="badge v-med">Derived — substantially copied</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/ai/UserProfileDigestGenerator.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/ai/UserProfileDigestGenerator.kt</code></td><td class="num">71.7%<div class="bar"><div class="fill v-med" style="width:71.7%"></div></div></td><td><span class="badge v-med">Derived — substantially copied</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/preferences/AiPreferencesRepository.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/preferences/AiPreferencesRepository.kt</code></td><td class="num">70.4%<div class="bar"><div class="fill v-med" style="width:70.4%"></div></div></td><td><span class="badge v-med">Derived — substantially copied</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/service/http/MediaFileHttpServerService.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/service/http/MediaFileHttpServerService.kt</code></td><td class="num">70.3%<div class="bar"><div class="fill v-med" style="width:70.3%"></div></div></td><td><span class="badge v-med">Derived — substantially copied</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/ai/GeminiModelService.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/ai/GeminiModelService.kt</code></td><td class="num">67.6%<div class="bar"><div class="fill v-med" style="width:67.6%"></div></div></td><td><span class="badge v-med">Derived — substantially copied</span></td></tr><tr><td><code>wear/src/main/java/com/unshoo/pixelmusic/data/WearLocalQueueState.kt</code></td><td><code>wear/src/main/java/com/theveloper/pixelplay/data/WearLocalQueueState.kt</code></td><td class="num">66.7%<div class="bar"><div class="fill v-med" style="width:66.7%"></div></div></td><td><span class="badge v-med">Derived — substantially copied</span></td></tr><tr><td><code>shared/src/main/java/com/unshoo/pixelmusic/shared/WearCapabilities.kt</code></td><td><code>shared/src/main/java/com/theveloper/pixelplay/shared/WearCapabilities.kt</code></td><td class="num">62.5%<div class="bar"><div class="fill v-med" style="width:62.5%"></div></div></td><td><span class="badge v-med">Derived — substantially copied</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/presentation/components/AiPlaylistSheet.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/presentation/components/AiPlaylistSheet.kt</code></td><td class="num">60.3%<div class="bar"><div class="fill v-med" style="width:60.3%"></div></div></td><td><span class="badge v-med">Derived — substantially copied</span></td></tr><tr><td><code>shared/src/main/java/com/unshoo/pixelmusic/shared/WearIntents.kt</code></td><td><code>shared/src/main/java/com/theveloper/pixelplay/shared/WearIntents.kt</code></td><td class="num">50.0%<div class="bar"><div class="fill v-low" style="width:50.0%"></div></div></td><td><span class="badge v-low">Partially derived</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/ai/AiSystemPromptEngine.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/ai/AiSystemPromptEngine.kt</code></td><td class="num">46.2%<div class="bar"><div class="fill v-low" style="width:46.2%"></div></div></td><td><span class="badge v-low">Partially derived</span></td></tr><tr><td><code>app/src/main/java/com/unshoo/pixelmusic/data/preferences/AppLanguage.kt</code></td><td><code>app/src/main/java/com/theveloper/pixelplay/data/preferences/AppLanguage.kt</code></td><td class="num">41.3%<div class="bar"><div class="fill v-low" style="width:41.3%"></div></div></td><td><span class="badge v-low">Partially derived</span></td></tr><tr><td><code>.github/workflows/codeql.yml</code></td><td><code>.github/workflows/codeql.yml</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>.github/workflows/wearos-apk.yml</code></td><td><code>.github/workflows/wearos-apk.yml</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/25.json</code></td><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/25.json</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/26.json</code></td><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/26.json</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/27.json</code></td><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/27.json</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/28.json</code></td><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/28.json</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/29.json</code></td><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/29.json</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/30.json</code></td><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/30.json</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/31.json</code></td><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/31.json</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/32.json</code></td><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/32.json</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/33.json</code></td><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/33.json</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/34.json</code></td><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/34.json</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/35.json</code></td><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/35.json</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/36.json</code></td><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/36.json</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/37.json</code></td><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/37.json</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/38.json</code></td><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/38.json</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/39.json</code></td><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/39.json</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/40.json</code></td><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/40.json</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/41.json</code></td><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/41.json</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>app/schemas/com.unshoo.pixelmusic.data.database.PixelMusicDatabase/41.json</code></td><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/41.json</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>app/schemas/com.unshoo.pixelmusic.data.database.PixelMusicDatabase/42.json</code></td><td><code>app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/42.json</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>app/src/main/res/drawable/theveloper_icon.png</code></td><td><code>app/src/main/res/drawable/theveloper_icon.png</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>assets/screenshot1.jpg</code></td><td><code>assets/screenshot1.jpg</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>assets/screenshot2.jpg</code></td><td><code>assets/screenshot2.jpg</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>assets/screenshot3.jpg</code></td><td><code>assets/screenshot3.jpg</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>assets/screenshot4.jpg</code></td><td><code>assets/screenshot4.jpg</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr><tr><td><code>remote-config/app-announcements.properties</code></td><td><code>remote-config/app-announcements.properties</code></td><td class="num">—</td><td><span class="badge v-name">name/asset match</span></td></tr></tbody>
                </table></div>

                <h2>2 · Side-by-side excerpts</h2>

                <div class="excerpt">
                  <h3>TelegramCacheManager.kt — 99.6% similar</h3><p class="sub">The entire diff between the two files is the package declaration. Everything below line 1 is identical.</p>
                  <div class="pair">
                    <div><div class="pane-label fork-l">FORK · app/…/unshoo/pixelmusic/data/telegram/TelegramCacheManager.kt (lines 1–14)</div><pre>package com.unshoo.pixelmusic.data.telegram

                import android.content.Context
                import dagger.hilt.android.qualifiers.ApplicationContext
                import kotlinx.coroutines.CoroutineScope
                import kotlinx.coroutines.Dispatchers
                import kotlinx.coroutines.SupervisorJob
                import kotlinx.coroutines.flow.MutableSharedFlow
                import kotlinx.coroutines.flow.SharedFlow
                import kotlinx.coroutines.flow.asSharedFlow
                import kotlinx.coroutines.launch
                import org.drinkless.tdlib.TdApi
                import timber.log.Timber
                import java.io.File
                </pre></div>
                    <div><div class="pane-label prop-l">PROPRIETARY · app/…/theveloper/pixelplay/data/telegram/TelegramCacheManager.kt (lines 1–14)</div><pre>package com.theveloper.pixelplay.data.telegram

                import android.content.Context
                import dagger.hilt.android.qualifiers.ApplicationContext
                import kotlinx.coroutines.CoroutineScope
                import kotlinx.coroutines.Dispatchers
                import kotlinx.coroutines.SupervisorJob
                import kotlinx.coroutines.flow.MutableSharedFlow
                import kotlinx.coroutines.flow.SharedFlow
                import kotlinx.coroutines.flow.asSharedFlow
                import kotlinx.coroutines.launch
                import org.drinkless.tdlib.TdApi
                import timber.log.Timber
                import java.io.File
                </pre></div>
                  </div>
                </div>
                <div class="excerpt">
                  <h3>WearVolumeRepository.kt — 99.5% similar</h3><p class="sub">Identical import order and body throughout; only the namespace differs.</p>
                  <div class="pair">
                    <div><div class="pane-label fork-l">FORK · wear/…/unshoo/pixelmusic/data/WearVolumeRepository.kt (lines 1–14)</div><pre>package com.unshoo.pixelmusic.data

                import android.app.Application
                import android.content.Context
                import android.media.AudioAttributes
                import android.media.AudioDeviceInfo
                import android.media.AudioManager
                import android.os.Build
                import androidx.mediarouter.media.MediaControlIntent
                import androidx.mediarouter.media.MediaRouteSelector
                import androidx.mediarouter.media.MediaRouter
                import com.google.android.horologist.audio.BluetoothSettings.launchBluetoothSettings
                import com.google.android.horologist.audio.OutputSwitcher.launchSystemMediaOutputSwitcherUi
                import com.unshoo.pixelmusic.shared.WearVolumeState
                </pre></div>
                    <div><div class="pane-label prop-l">PROPRIETARY · wear/…/theveloper/pixelplay/data/WearVolumeRepository.kt (lines 1–14)</div><pre>package com.theveloper.pixelplay.data

                import android.app.Application
                import android.content.Context
                import android.media.AudioAttributes
                import android.media.AudioDeviceInfo
                import android.media.AudioManager
                import android.os.Build
                import androidx.mediarouter.media.MediaControlIntent
                import androidx.mediarouter.media.MediaRouteSelector
                import androidx.mediarouter.media.MediaRouter
                import com.google.android.horologist.audio.BluetoothSettings.launchBluetoothSettings
                import com.google.android.horologist.audio.OutputSwitcher.launchSystemMediaOutputSwitcherUi
                import com.theveloper.pixelplay.shared.WearVolumeState
                </pre></div>
                  </div>
                </div>
                <div class="excerpt">
                  <h3>GDriveApiService.kt — 99.4% similar</h3><p class="sub">Same OkHttp-based Google Drive REST v3 client, same doc comment; diff is the package line.</p>
                  <div class="pair">
                    <div><div class="pane-label fork-l">FORK · app/…/data/gdrive/GDriveApiService.kt (lines 1–14)</div><pre>package com.unshoo.pixelmusic.data.gdrive

                import kotlinx.coroutines.Dispatchers
                import kotlinx.coroutines.withContext
                import okhttp3.MediaType.Companion.toMediaType
                import okhttp3.OkHttpClient
                import okhttp3.Request
                import okhttp3.RequestBody.Companion.toRequestBody
                import timber.log.Timber
                import javax.inject.Inject
                import javax.inject.Singleton

                /**
                 * Direct OkHttp-based client for Google Drive REST API v3.
                </pre></div>
                    <div><div class="pane-label prop-l">PROPRIETARY · app/…/data/gdrive/GDriveApiService.kt (lines 1–14)</div><pre>package com.theveloper.pixelplay.data.gdrive

                import kotlinx.coroutines.Dispatchers
                import kotlinx.coroutines.withContext
                import okhttp3.MediaType.Companion.toMediaType
                import okhttp3.OkHttpClient
                import okhttp3.Request
                import okhttp3.RequestBody.Companion.toRequestBody
                import timber.log.Timber
                import javax.inject.Inject
                import javax.inject.Singleton

                /**
                 * Direct OkHttp-based client for Google Drive REST API v3.
                </pre></div>
                  </div>
                </div>
                <div class="excerpt">
                  <h3>AiPlaylistGenerator.kt — 72% similar (example of a modified copy)</h3><p class="sub">Same structure, same variable names, same surrounding code — an edited copy of the proprietary original, not an independent implementation.</p>
                  <div class="pair">
                    <div><div class="pane-label fork-l">FORK · app/…/data/ai/AiPlaylistGenerator.kt (lines 40–52)</div><pre>                }
                            }

                            // Token Optimization: Reduce sample size based on safe mode
                            val isSafe = preferencesRepo.isSafeTokenLimitEnabled.first()
                            val sampleCap = if (isSafe) 40 else 80
                            val sampleSize = max(minLength, sampleCap).coerceAtMost(sampleCap)
                            val songSample = samplingPool.take(sampleSize)

                            // Token Optimization: Compact JSON format — only essential fields
                            val availableSongsJson = buildString {
                                songSample.forEachIndexed { index, song -&gt;
                                    val score = dailyMixManager.getScore(song.id)
                </pre></div>
                    <div><div class="pane-label prop-l">PROPRIETARY · app/…/data/ai/AiPlaylistGenerator.kt (lines 40–52)</div><pre>                }
                            }

                            val isSafe = preferencesRepo.isSafeTokenLimitEnabled.first()
                            val prefSampleSize = preferencesRepo.aiSampleSize.first()
                            val useExtendedFields = preferencesRepo.aiIncludeExtendedFields.first()
                            val sampleCap = if (isSafe) prefSampleSize else prefSampleSize * 2
                            val songSample = samplingPool.take(sampleCap)

                            val availableSongsJson = buildString {
                                songSample.forEachIndexed { index, song -&gt;
                                    val score = dailyMixManager.getScore(song.id)
                                    val title = song.title.replace(&quot;\&quot;&quot;, &quot;&#x27;&quot;).take(40)
                </pre></div>
                  </div>
                </div>

                <div class="excerpt">
                <h3>qq_sign.js — byte-identical asset</h3>
                <p class="sub">The QQ Music request-signing JavaScript is md5-identical in both repos:</p>
                <pre>f114d14ed8a1fb4672f2b9687d365f4d  fork/app/src/main/assets/qq_sign.js
                f114d14ed8a1fb4672f2b9687d365f4d  prop/app/src/main/assets/qq_sign.js</pre>
                </div>

                <div class="excerpt">
                <h3>CastSessionSecurity.kt — 99.4% + its unit test at 98.5%</h3>
                <p class="sub">The entire diff is the package line — and the fork also carries the proprietary <b>unit test</b> (<code>CastSessionSecurityTest.kt</code>). Copied tests are a classic indicator of wholesale duplication rather than reimplementation.</p>
                <pre>1c1
                &lt; package com.unshoo.pixelmusic.data.service.http
                ---
                &gt; package com.theveloper.pixelplay.data.service.http</pre>
                </div>

                <h2>3 · Git history findings</h2>
                <ul>
                <li><b>No shared commit SHAs</b> between any pair of repos (fork↔prop: 0, fork↔OSS: 0, oss↔prop: 0). The fork's history was <b>re-created</b>, not forked: its root commit <span class="mono">56c940e</span> (2026-06-28) is a single <b>1,728-file import</b> titled <i>“Base integrations and features up to May 26, 2026”</i> that already contains the complete Telegram, Google Drive, QQ Music, Cast, and Wear OS trees.</li>
                <li><b>12 commit subjects replayed verbatim from proprietary history with identical author and timestamp to the second</b> — practical proof of replayed history (SHAs differ only because trees/parents were rewritten):
                <ul>
                <li class="mono">fork 880434c0 / prop b1b3be90 — “Optimize UnifiedPlayerSheet animations for performance” — both google-labs-jules[bot], both Tue Dec 23 13:47:53 2025 +0000</li>
                <li class="mono">fork cf545a7 / prop c34409b9 — “refactor: Revert OptimizedAlbumArt to self-managed loading with Crossfade” — both Mon Jun 30 01:28:03 2025 +0000</li>
                <li class="mono">fork f22bcf8c / prop f45da708 — “Fix BaselineProfileGenerator robustness and stability” — both Wed Dec 24 19:06:06 2025 +0000</li>
                </ul></li>
                <li><b>Timeline proves copy direction:</b> proprietary implemented Telegram on <b>2026-01-17</b> (<span class="mono">6264e674</span>) and Wear OS on <b>2026-02-23</b> (<span class="mono">461bdd3e</span>); the fork first contains both, fully formed with zero incremental history, in its 2026-06-28 root import.</li>
                <li><b>43 byte-identical blobs</b> (same git object hash) in fork ∩ proprietary but ∉ OSS — including artifacts the fork <b>forgot to rebrand</b>: Room schema history under the original proprietary package (<span class="mono">app/schemas/com.theveloper.pixelplay.data.database.PixelPlayDatabase/25–41.json</span>), the proprietary author's avatar (<span class="mono">res/drawable/theveloper_icon.png</span>), and proprietary screenshots (<span class="mono">assets/screenshot1–4.jpg</span>). Schema <span class="mono">41.json</span> exists under <b>both</b> the old and renamed package paths with the same blob hash — a rename caught mid-flight.</li>
                <li><b>Authors:</b> fork ≈ 324 commits by <span class="mono">ianshulyadav</span> plus bots; no proprietary maintainer (<span class="mono">theovilardo</span>) appears, yet the replayed bot commits carry proprietary history metadata.</li>
                </ul>

                <h2>4 · Fork README feature check</h2>
                <table>
                <thead><tr><th>Fork README feature</th><th>In OSS?</th><th>In proprietary?</th><th>Finding</th></tr></thead><tbody>
                <tr><td>Telegram audio pipeline</td><td>No — OSS README: “Removed integrations include Telegram…”</td><td>Yes (since 2026-01-17)</td><td><span class="badge v-crit">COPIED from proprietary</span> 16 files ≥80%, several rename-only</td></tr>
                <tr><td>Wear OS companion app</td><td>No (removed)</td><td>Yes (since 2026-02-23)</td><td><span class="badge v-crit">COPIED from proprietary</span> 67 files ≥80% — entire wear/ + shared/ modules</td></tr>
                <tr><td>Google Drive integration</td><td>No</td><td>Yes</td><td><span class="badge v-crit">COPIED from proprietary</span> 11 files ≥80%</td></tr>
                <tr><td>AI playlist (Gemini/OpenAI/DeepSeek)</td><td>No</td><td>Yes</td><td><span class="badge v-crit">COPIED from proprietary</span> 14 files ≥80%, more at 60–80% (modified copies)</td></tr>
                <tr><td>Chromecast</td><td>No (removed)</td><td>Yes</td><td><span class="badge v-crit">COPIED from proprietary</span> incl. CastSessionSecurity.kt + its test</td></tr>
                <tr><td>QQ Music / NetEase</td><td>No</td><td>Yes</td><td><span class="badge v-crit">COPIED from proprietary</span> incl. byte-identical qq_sign.js</td></tr>
                <tr><td>YouTube Music / InnerTube</td><td>No</td><td><b>No</b></td><td><span class="badge v-ok">Not from proprietary</span> no counterpart in either repo; <span class="mono">UmihiSettings.kt</span> suggests a third-party codebase — worth its own license check</td></tr>
                <tr><td>Last.fm Smart Mix / ListenBrainz</td><td>No</td><td>No</td><td><span class="badge v-ok">Not from proprietary</span></td></tr>
                <tr><td>Snapchat Creative Kit sharing</td><td>No</td><td>No (fork has only an icon)</td><td><span class="badge v-ok">Not from proprietary</span></td></tr>
                <tr><td>Deezer artwork</td><td>Partially (OSS has Deezer code)</td><td>Yes</td><td><span class="badge v-ok">Likely derivable from OSS</span> not counted as a violation</td></tr>
                </tbody></table>

                <h2>5 · Summary</h2>
                <p><b>Yes — proprietary-only code is present in the fork, at large scale and with minimal disguise.</b> The strongest evidence: <b>(1)</b> 43 byte-identical git blobs shared between fork and proprietary but absent from the GPL base, including Room schema files and the author icon still carrying the proprietary <code>com.theveloper.pixelplay</code> name inside the fork's tree; <b>(2)</b> ~92 Kotlin sources — <code>TelegramCacheManager.kt</code>, <code>QQSignGenerator.kt</code>, <code>CastSessionSecurity.kt</code> and others — whose <b>entire diff against the proprietary original is the package-rename line</b>; <b>(3)</b> the md5-identical <code>qq_sign.js</code> signing asset; <b>(4)</b> replayed proprietary commits with identical author + timestamp-to-the-second metadata, proving the fork's history was rewritten from proprietary history rather than developed independently; and <b>(5)</b> the OSS repo's own README confirming every implicated integration was deliberately removed from the GPL release, eliminating any legitimate provenance path. Copy direction is settled by the timeline: each feature exists in proprietary history months before the fork's single 1,728-file “base” import of 2026-06-28. The fork's genuinely new work (YouTube Music/InnerTube, Last.fm Smart Mix) comes from neither repo and is not part of this violation.</p>

                <footer>Method: git ls-files set comparison (path + basename) → normalized-line difflib similarity → git blob-hash identity → full-history analysis (SHAs, authors, subjects, timestamps). No repository was modified. Working artifacts in session scratchpad.</footer>
            </main>

            <SiteFooter />
        </div>
    </div>
</template>

<style>
.report-shell {
    width: min(100%, 1228px);
}

.report-content {
    --report-critical: var(--color-red);
    --report-high: 224 116 62;
    --report-medium: var(--color-yellow);
    --report-ok: var(--color-mint);
    color: rgb(var(--color-text));
    font-size: 0.9375rem;
    line-height: 1.65;
}

.report-content h1 {
    margin: 0 0 0.25rem;
    font-size: clamp(1.875rem, 5vw, 2.5rem);
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -0.035em;
}

.report-content h2 {
    margin: 3.5rem 0 1rem;
    padding-bottom: 0.65rem;
    border-bottom: 1px solid rgb(var(--color-surface));
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.3;
    letter-spacing: -0.02em;
}

.report-content h3 {
    margin: 1.75rem 0 0.2rem;
    font-size: 1rem;
    font-weight: 500;
}

.report-content p {
    margin: 0.65rem 0;
}

.report-content .meta,
.report-content .sub {
    color: rgb(var(--color-subtle));
    font-size: 0.8125rem;
}

.report-content .meta {
    margin: 0.2rem 0;
}

.report-content code,
.report-content .mono {
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 0.78rem;
    overflow-wrap: anywhere;
}

.report-content :not(pre) > code,
.report-content .mono {
    color: rgb(var(--color-text) / 0.88);
}

.report-content .verdict-box {
    margin: 1.75rem 0;
    padding: 1rem 1.15rem;
    border: 1px solid rgb(var(--report-critical) / 0.35);
    border-left: 3px solid rgb(var(--report-critical));
    background: rgb(var(--report-critical) / 0.07);
}

.report-content .verdict-box > b:first-child {
    color: rgb(var(--report-critical));
    font-size: 1.05rem;
}

.report-content .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.65rem;
    margin: 1.25rem 0;
}

.report-content .card {
    padding: 0.85rem 0.75rem;
    border: 1px solid rgb(var(--color-surface));
    background: rgb(var(--color-crust) / 0.42);
    text-align: center;
}

.report-content .card .n {
    font-size: 1.65rem;
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: -0.03em;
}

.report-content .card .l {
    margin-top: 0.15rem;
    color: rgb(var(--color-subtle));
    font-size: 0.74rem;
    line-height: 1.35;
}

.report-content .card.crit .n {
    color: rgb(var(--report-critical));
}

.report-content .tablewrap,
.report-content > table {
    border: 1px solid rgb(var(--color-surface));
    overflow: auto;
}

.report-content .tablewrap {
    max-height: min(70vh, 560px);
}

.report-content table {
    width: 100%;
    min-width: 760px;
    border-collapse: collapse;
    background: rgb(var(--color-base) / 0.72);
    font-size: 0.76rem;
    line-height: 1.5;
}

.report-content > table {
    display: block;
}

.report-content th,
.report-content td {
    padding: 0.48rem 0.65rem;
    border-bottom: 1px solid rgb(var(--color-surface) / 0.72);
    text-align: left;
    vertical-align: top;
}

.report-content thead th {
    position: sticky;
    top: 0;
    z-index: 2;
    background: rgb(var(--color-crust));
    color: rgb(var(--color-text));
    font-weight: 500;
}

.report-content tbody tr:last-child td {
    border-bottom: 0;
}

@media (hover: hover) {
    .report-content tbody tr:hover td {
        background: rgb(var(--color-surface) / 0.35);
    }
}

.report-content .num {
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
}

.report-content .bar {
    width: 4.5rem;
    height: 3px;
    margin-top: 0.25rem;
    overflow: hidden;
    background: rgb(var(--color-overlay) / 0.35);
}

.report-content .fill {
    height: 100%;
}

.report-content .fill.v-crit { background: rgb(var(--report-critical)); }
.report-content .fill.v-high { background: rgb(var(--report-high)); }
.report-content .fill.v-med { background: rgb(var(--report-medium)); }
.report-content .fill.v-low,
.report-content .fill.v-weak { background: rgb(var(--color-subtle)); }
.report-content .fill.v-name { background: rgb(var(--color-blue)); }

.report-content .badge {
    display: inline-block;
    padding: 0.1rem 0.45rem;
    border: 1px solid currentColor;
    border-radius: 999px;
    font-size: 0.65rem;
    font-weight: 500;
    line-height: 1.35;
    white-space: nowrap;
}

.report-content .badge.v-crit { color: rgb(var(--report-critical)); background: rgb(var(--report-critical) / 0.07); }
.report-content .badge.v-high { color: rgb(var(--report-high)); background: rgb(var(--report-high) / 0.07); }
.report-content .badge.v-med { color: rgb(var(--report-medium)); background: rgb(var(--report-medium) / 0.07); }
.report-content .badge.v-low,
.report-content .badge.v-weak { color: rgb(var(--color-subtle)); background: rgb(var(--color-surface) / 0.35); }
.report-content .badge.v-name { color: rgb(var(--color-blue)); background: rgb(var(--color-blue) / 0.07); }
.report-content .badge.v-ok { color: rgb(var(--report-ok)); background: rgb(var(--report-ok) / 0.07); }

.report-content .excerpt {
    margin: 2rem 0;
}

.report-content .pair {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 0.65rem;
}

.report-content .pair > div,
.report-content .excerpt > pre {
    min-width: 0;
    border: 1px solid rgb(var(--color-surface));
}

.report-content .pane-label {
    padding: 0.48rem 0.7rem;
    color: rgb(var(--color-text));
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 0.66rem;
    font-weight: 500;
    line-height: 1.35;
}

.report-content .fork-l { background: rgb(var(--color-blue) / 0.16); }
.report-content .prop-l { background: rgb(var(--color-mint) / 0.16); }

.report-content pre {
    margin: 0;
    padding: 0.85rem;
    overflow-x: auto;
    background: rgb(var(--color-crust) / 0.75);
    color: rgb(var(--color-text) / 0.9);
    font: 0.72rem/1.55 "JetBrains Mono", ui-monospace, monospace;
    tab-size: 4;
}

.report-content .hl {
    background: rgb(var(--report-high) / 0.18);
}

.report-content ul {
    margin: 0.7rem 0;
    padding-left: 1.25rem;
}

.report-content li {
    margin: 0.45rem 0;
}

.report-content li::marker {
    color: rgb(var(--color-subtle));
}

.report-content > footer {
    margin-top: 3.5rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgb(var(--color-surface));
    color: rgb(var(--color-subtle));
    font-size: 0.75rem;
}

@media (max-width: 900px) {
    .report-content .pair {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 640px) {
    .report-content {
        font-size: 0.875rem;
    }

    .report-content h2 {
        margin-top: 2.75rem;
    }

    .report-content .cards {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .report-content .verdict-box {
        padding: 0.85rem;
    }
}
</style>
