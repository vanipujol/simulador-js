// Function async for validate login
async function validateLogin() {

    let username = document.getElementById("name").value;
    let password = document.getElementById("password").value;

    let response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            password: password,
        })
    })

    response = await response.json()

    if (response.message === "Invalid credentials"){
        return false
    }

    return response
}

// Function to handle the login process
export async function login() {
    return new Promise((resolve) => {

        document.getElementById("loginButton").addEventListener("click", async function () {
            let response = await validateLogin();

            if (response.id) {
                resolve(response);
            } else {
                resolve(false);
            }
        });
    });
}

export function sweetAlertSuccess(){

    // Sweet alert "Inicio de sesión exitoso"
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso'
    })

}

export function sweetAlertDenied(){
    // Sweet alert "Credencial inválida"
    Swal.fire({
        icon: 'error',
        title: 'Credencial inválida',
        confirmButtonColor: '#282C34',
    })
}

// Function log out
export function logOut(){
    document.getElementById("log-out").addEventListener("click", function() {
        sessionStorage.removeItem("token");
        window.location.href = "index.html";
    });
}

