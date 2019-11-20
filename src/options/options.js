function saveOptions() {
    const qualities = [...document.querySelectorAll('[name=quality]')]
        .filter(e => e.checked)
        .map(e => e.id);
    const fallbacks = [...document.querySelectorAll('[name=fallback-quality]')]
        .filter(e => e.checked)
        .map(e => e.id.replace('fallback-', ''));
    chrome.storage.sync.set({
        qualities,
        fallbacks
    }, () => {
        document.getElementById('status').textContent = 'Please restart browser for these changes to take effect'
    });
}

function restoreOptions() {
    chrome.storage.sync.get(['qualities', 'fallbacks'], (items) => {
        items.qualities.forEach(id => document.getElementById(id).checked = true);
        items.fallbacks.forEach(id => document.getElementById(`fallback-${id}`).checked = true);
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelectorAll('[name$=quality]')
    .forEach(e => e.addEventListener('change', saveOptions));