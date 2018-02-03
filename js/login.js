function register() {
  var id = Math.random()
    .toString(36)
    .substring(7);
  var username = document.getElementById("registro_inputuser").value;
  var password = document.getElementById("registro_inputpassword").value;

  var users = JSON.parse(localStorage.getItem("users"));

  if (users == null) {
    users = [];
  }

  var user = { id: id, username: username, password: password, score: 0 };

  users.push(user);

  localStorage.setItem("users", JSON.stringify(users));
}

function login() {
  var users = JSON.parse(localStorage.getItem("users"));

  if (users == null) {
    alert("No hay usuarios registrados");
  }

  var username = document.getElementById("login_inputuser").value;
  var password = document.getElementById("login_inputpassword").value;
  var dificultad = document.getElementById("dificultad").value;

  var isUser = false;
  var idUser;

  users.forEach(element => {
    if (element.username == username && element.password == password) {
      isUser = true;
      idUser = element.id;
    }
  });

  if (isUser) {
   // alert(isUser + " " + idUser + " " + dificultad);

    var obj = { id: idUser, dificultad: dificultad };

    localStorage.setItem("player", JSON.stringify(obj));

    window.location.href = "game.html";
  } else {
    alert("No es usuario");
  }
}

var cont = document.getElementById("contenedorPuntuaciones");

var users = JSON.parse(localStorage.getItem("users"));

users.forEach(element => {
  var p = document.createElement("p");
  p.innerHTML = element.username + " - " + element.score;
  cont.appendChild(p);
});
