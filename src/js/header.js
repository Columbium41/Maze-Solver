const template = document.createElement('template');

template.innerHTML = `
<nav id="navbar">
    <h1 id="title">Maze Solver</h1>
    <ul class="links">
        <li><a href="">Home</a></li>
        <li><a href="">About</a></li>
        <li><a href="" target="_blank">Github</a></li>
    </ul>
</nav>
`

document.body.insertBefore(template.content, document.body.firstChild);
