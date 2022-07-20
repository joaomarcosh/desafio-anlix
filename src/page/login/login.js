const usuario = document.getElementById('usuario');
const senha = document.getElementById('senha');
const button = document.getElementById('button');

button.addEventListener('click',() => {
    fetch(`http://localhost:3000/login`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "usuario": usuario.value,
            "senha": senha.value
        })
    }).then(res => {
        if (res.status === 204) {
            fetch(`http://localhost:3000/dashboard`,{
                method: 'GET',
                headers: {
                    'Authorization': res.headers.get('Authorization')
                },
            });
        }
    });
});
