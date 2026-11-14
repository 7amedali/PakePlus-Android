window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    location.href = url
}

document.addEventListener('click', hookClick, { capture: true })

// دالة إظهار زر التحميل الأنيق أسفل الشاشة
const showDownloadBanner = (url) => {
    if (!url || !((url.includes('://x.com') || url.includes('://twitter.com')) && url.includes('/status/'))) return;

    const oldBanner = document.getElementById('x-dl-banner');
    if (oldBanner) oldBanner.remove();

    const banner = document.createElement('div');
    banner.id = 'x-dl-banner';
    banner.style.cssText = 'position:fixed; bottom:25px; left:50%; transform:translateX(-50%); background:#1d9bf0; color:#fff; padding:12px 20px; border-radius:30px; z-index:999999; display:flex; align-items:center; gap:12px; box-shadow:0 4px 15px rgba(0,0,0,0.4); font-family:sans-serif; font-size:15px; font-weight:bold; direction:rtl;';

    const text = document.createElement('span');
    text.innerText = 'تم نسخ الرابط';

    const dlBtn = document.createElement('button');
    dlBtn.innerText = 'تحميل الفيديو الآن';
    dlBtn.style.cssText = 'background:#fff; color:#1d9bf0; border:none; padding:6px 14px; border-radius:20px; font-weight:bold; cursor:pointer; font-size:14px;';
    dlBtn.onclick = () => {
        window.location.href = 'https://twitsave.com' + encodeURIComponent(url);
    };

    const closeBtn = document.createElement('span');
    closeBtn.innerText = '✕';
    closeBtn.style.cssText = 'cursor:pointer; margin-right:5px; opacity:0.8; font-size:16px;';
    closeBtn.onclick = () => banner.remove();

    banner.appendChild(text);
    banner.appendChild(dlBtn);
    banner.appendChild(closeBtn);
    document.body.appendChild(banner);

    setTimeout(() => { if (banner) banner.remove(); }, 8000);
};

// 1. اعتراض النسخ الحديث (Clipboard API) فوراً قبل تحميل تويتر
if (navigator.clipboard && navigator.clipboard.writeText) {
    const origWrite = navigator.clipboard.writeText.bind(navigator.clipboard);
    navigator.clipboard.writeText = async (text) => {
        showDownloadBanner(text);
        return origWrite(text);
    };
}

// 2. اعتراض النسخ الكلاسيكي (execCommand) الذي تستخدمه المتصفحات القديمة و WebView
const origExec = document.execCommand.bind(document);
document.execCommand = function (cmd, showUI, value) {
    const res = origExec(cmd, showUI, value);
    if (cmd && cmd.toLowerCase() === 'copy') {
        const activeEl = document.activeElement;
        const copiedText = (activeEl && activeEl.value) ? activeEl.value : window.getSelection().toString();
        showDownloadBanner(copiedText);
    }
    return res;
};

// 3. ضبط الزوم 75% وإخفاء شريط التمرير
window.addEventListener('DOMContentLoaded', () => {
    document.body.style.zoom = '75%';
    document.documentElement.style.overflowX = 'hidden';

    const style = document.createElement('style');
    style.innerHTML = `
        ::-webkit-scrollbar { display: none; }
        html { scroll-behavior: smooth; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
});
