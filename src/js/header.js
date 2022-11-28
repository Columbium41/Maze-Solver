const template = document.createElement('template');

template.innerHTML = `
<nav id="navbar">
    <h1 id="title">Maze Solver</h1>
    <ul class="links">
        <li><a href="/src/html/index.html">Home</a></li>
        <li><a href="/src/html/about.html">About</a></li>
        <li><a href="https://github.com/Columbium41" target="_blank">Github</a></li>
    </ul>
</nav>
`

document.body.insertBefore(template.content, document.body.firstChild);
