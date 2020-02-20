function saveOptions() {
    const qualities = [...document.querySelectorAll('[name=quality]')]
        .filter(e => e.checked)
        .map(e => e.id);
    const fallbacks = [...document.querySelectorAll('[name=fallback-quality]')]
        .filter(e => e.checked)
        .map(e => e.id.replace('fallback-', ''));
    chrome.storage.sync.set({
        qualities,
        fallbacks,
    });
}

function restoreOptions() {
    chrome.storage.sync.get(['qualities', 'fallbacks'], (config) => {
        config.qualities.forEach(id => document.getElementById(id).checked = true);
        config.fallbacks.forEach(id => document.getElementById(`fallback-${id}`).checked = true);
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelectorAll('[name$=quality]').forEach(e => e.addEventListener('change', saveOptions));
