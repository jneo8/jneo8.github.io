function dynamicallyLoadScript(url) {
    var script = document.createElement("script");
    script.src = url;
    document.head.appendChild(script)
}

function dynamicallyLoadLink(url) {
    var link = document.createElement("link");
    link.href = url
    document.head.appendChild(link)
}

const cssLinks= [
]

cssLinks.forEach(url => dynamicallyLoadLink(url))

const urls = [
    // Mathjax
    "https://polyfill.io/v3/polyfill.min.js?features=es6",
    "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
];

urls.forEach(url => dynamicallyLoadScript(url))
