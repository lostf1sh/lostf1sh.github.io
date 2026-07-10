<script setup>
import SiteNav from "@/components/SiteNav.vue";
import SiteFooter from "@/components/SiteFooter.vue";
import reportSource from "@/content/leakage-report.html?raw";

const reportHtml = reportSource.match(/<main>([\s\S]*?)<\/main>/i)?.[1] ?? reportSource;
</script>

<template>
    <div class="w-full min-h-[100dvh]">
        <div class="report-shell mx-auto px-4 sm:px-6 pt-12 pb-16">
            <SiteNav />

            <main class="report-content mt-12" v-html="reportHtml" />

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
