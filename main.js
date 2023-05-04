console.log("Toy enlazadooo, rey!")

const formulario = document.getElementById("formulario")
const inputNombre = document.getElementById("input-nombre")
const inputApellido = document.getElementById("input-apellido")
const inputDNI = document.getElementById("input-dni")
const listaDeClientes = document.getElementById("lista-de-clientes")

let arregloDeClientes = []

const hoy = new Date().toLocaleDateString()

let clienteAInscribir = {
  nombre: "",
  apellido: "",
  dni: "",
  fechaDeInscripcion: hoy
}

function eliminarCliente(dni) {
  arregloDeClientes = arregloDeClientes.filter((cliente) => cliente.dni !== dni)
  guardarEnAlmacenamientoLocal()

  renderizarClientes()
}

function verificarMembresia(fechaDeInscripcion) {
  const fechaPorPartes = fechaDeInscripcion.split("/")
  const [dia, mes, anio] = fechaPorPartes

  const fechaDeInicio = new Date(`${mes}/${dia}/${anio}`).getTime()
  const fechaActual = new Date().getTime()

  const duracionDeLaMembresia = 30 // En dias

  const diferenciaEnMilisegundos = fechaActual - fechaDeInicio

  const membresiaEstaVencida = Boolean(Math.floor(diferenciaEnMilisegundos / 1000 / 60 / 60 / 24 / duracionDeLaMembresia))

  if(membresiaEstaVencida) {
    alert("Membresia vencida. El cliente debe pagar!")
    return
  }

  alert("Permiso concedido!")
}

function renovarMembresia(dni) {
  const indiceDelCliente = arregloDeClientes.findIndex((cliente) => cliente.dni === dni)

  const nuevaFecha = new Date().toLocaleDateString()

  arregloDeClientes[indiceDelCliente] = { 
    ...arregloDeClientes[indiceDelCliente],
    fechaDeInscripcion: nuevaFecha
  }

  guardarEnAlmacenamientoLocal()
  renderizarClientes()

  alert("Membresia actualizada!")
}

function renderizarClientes() {
  listaDeClientes.innerHTML = ``

  arregloDeClientes.forEach((cliente) => {
    const li = document.createElement("li")

    li.innerHTML = `
      <p><b>Nombre completo:</b> ${cliente.nombre} ${cliente.apellido}</p>
      <p><b>DNI:</b> ${cliente.dni}</p>
      <p><b>Fecha de inscripcion:</b> ${cliente.fechaDeInscripcion}</p>
      <button onclick="eliminarCliente('${cliente.dni}')">Eliminar</button>
      <button onclick="verificarMembresia('${cliente.fechaDeInscripcion}')">Acceder</button>
      <button onclick="renovarMembresia('${cliente.dni}')">Renovar membresia</button>
    `

    listaDeClientes.appendChild(li)
  })
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault()

  clienteAInscribir = {
    ...clienteAInscribir,
    nombre: inputNombre.value,
    apellido: inputApellido.value,
    dni: inputDNI.value
  }

  arregloDeClientes.push(clienteAInscribir)
  guardarEnAlmacenamientoLocal()

  renderizarClientes()

  formulario.reset()
})

function guardarEnAlmacenamientoLocal() {
  localStorage.setItem("clientes", JSON.stringify(arregloDeClientes))
}

function verificarAlmacenamientoLocal() {
  const clientesDesdeElAlmacenamiento = localStorage.getItem("clientes")
  arregloDeClientes = JSON.parse(clientesDesdeElAlmacenamiento)

  renderizarClientes()
}

verificarAlmacenamientoLocal()