/**
    Este archivo JavaScript contiene funciones para gestionar el inicio de sesión de usuarios,
    mostrar alertas de éxito y error utilizando SweetAlert y permitir que los usuarios cierren sesión.
    (ej de inicio de sesión --> usuario: acharlota contraseña: M9lbMdydMN)
*/

/**
 * Asynchronously validates a user login by sending a POST request with the provided username and password to an authentication endpoint.
 *
 * @returns {Promise<object|boolean>}
 */
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

/**
 * Function to handle the login process
 *
 * @returns {Promise<object|boolean>}
 */
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

/**
 * Sweet alert "Inicio de sesión exitoso"
 */
export function sweetAlertSuccess(){
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

/**
 * Sweet alert "Credencial inválida"
 */
export function sweetAlertDenied(){
    Swal.fire({
        icon: 'error',
        title: 'Credencial inválida',
        confirmButtonColor: '#282C34',
    })
}

/**
 * Function log out
 */
export function logOut(){
    document.getElementById("log-out").addEventListener("click", function() {
        sessionStorage.removeItem("token");
        window.location.href = "index.html";
    });
}

/**
 * Parses a JSON Web Token (JWT) and extracts the payload.
 *
 * @param {string} token - The JWT to be parsed.
 * @returns {object} - The parsed payload of the JWT.
 */
export function parseJwt (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}