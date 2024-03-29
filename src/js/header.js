const template = document.createElement('template');

template.innerHTML = `
<nav id="navbar">
    <img src="/src/menu-icon.svg" alt="Menu Button" id="menu-button" />
    <h1 id="title">Maze Solver</h1>
    <ul class="links">
        <li><a href="./index.html">Home</a></li>
        <li><a href="./about.html">About</a></li>
        <li><a href="https://github.com/Columbium41" target="_blank">Github</a></li>
    </ul>
</nav>
`

document.body.insertBefore(template.content, document.body.firstChild);
