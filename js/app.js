import cursos from "../data.js";
// Variables para el renderizado y filtado de los produtos
const storageKey = '1649014443816'

const listaCursos = document.querySelector('#lista-cursos')
const formulario = document.querySelector('#busqueda')
const inputBuscador = document.querySelector('#buscador')
const submitBuscador = document.querySelector('.contenido-hero form #submit-buscador')
const botonBuscador = document.querySelector('.contenido-hero form #boton-buscador')
let textoBuscar = ''
let cursosTodos = [...cursos]
mostrarCursos( cursosTodos )


// Variables para la funcionalidad del Carrito
const vaciarCarrito = document.querySelector('#vaciar-carrito')
const contendorCarrito = document.querySelector('#lista-carrito tbody')
let articulosCarrito = []


cargarEventListeners()
function cargarEventListeners() {

    // Leer de LocalStorage
    document.addEventListener('DOMContentLoaded', ()=>{
        articulosCarrito = JSON.parse( localStorage.getItem( storageKey ) ) || []
        renderizarCarrito()
    })


    // Eventos para la listas de cursos 
    formulario.addEventListener('submit', filtrarCursos)
    inputBuscador.addEventListener('input', ( e )=>{
        if(e.target.value === ''){
            resetearListaCursos()
            return
        }
        textoBuscar = e.target.value
        
    })
    botonBuscador.addEventListener('click', ()=>{
        resetearListaCursos()
    })

    // Eventos para el carrito
    listaCursos.addEventListener('click', agregarCurso)
    vaciarCarrito.addEventListener('click', eliminarTodos)
}

// Renderizar todod los cursos a la pantalla
function mostrarCursos( cursosArr ) {
 

    let newArr = [];
    let arrTemp = []

    cursosArr.forEach(( curso, idx )=> {

        if( arrTemp.length < 3 ){
            arrTemp = [ ...arrTemp, curso ] 

            if( arrTemp.length === 3 || idx === (cursosArr.length - 1) ){
                newArr = [ ...newArr, arrTemp ]
                arrTemp = []
            }
        }
        
    })

    newArr.forEach( cursosRow => {
        const row = document.createElement('DIV')
        row.classList.add('row')

        cursosRow.forEach( curso =>{
            const column = document.createElement('DIV')
            column.classList.add('four', 'columns')

            const card = cardHtml( curso )
            column.appendChild(card)

            row.appendChild(column)
        } )
        listaCursos.appendChild(row)
        
    });


}
// Generar HTML de una card
function cardHtml(curso) {
    const card = document.createElement('DIV')
        card.innerHTML = `
            <div class="card">
                <img src="${curso.imagen}" class="imagen-curso u-full-width">
                <div class="info-card">
                    <h4>${curso.titulo}</h4>
                    <p>${curso.instructor}</p>
                    <img src="img/estrellas.png">
                    <p class="precio">$${curso.precioRegular}  <span class="u-pull-right ">$${curso.precio}</span></p>
                    <a href="#" class="u-full-width button-primary button input agregar-carrito" data-id="${curso.idCurso}">Agregar Al Carrito</a>
                </div>
            </div>
        `   
    return card
}   


// FiltarCursos
function filtrarCursos( e ) {
    e.preventDefault()

    if(textoBuscar.trim() === '' && submitBuscador.className.includes('activo') ){
        resetearListaCursos()
        return
    }

    if( textoBuscar.trim() === '' ){
        return
    }


    const terminoBuscar = textoBuscar.trim().toLocaleLowerCase();
    const cursosFiltrados = cursosTodos.filter( curso => (curso.titulo.toLocaleLowerCase()).includes(terminoBuscar) )
    console.log(cursosFiltrados);



    submitBuscador.classList.add('activo')
    submitBuscador.style.display = 'none'
    botonBuscador.style.display = 'inline-block'
    
    limpiarListaCursos()

    // Crear y Mostrar mensaje de "Sin resultados"
    if( cursosFiltrados.length <= 0 ){
        const mensajeSinResultados = document.createElement('h3')
        mensajeSinResultados.classList.add('sin-resultados')
        mensajeSinResultados.textContent = 'No se encontraron resultados'
        listaCursos.appendChild(mensajeSinResultados)
        return
    }
    
    mostrarCursos(cursosFiltrados)
}

function limpiarListaCursos() {
    
    while (listaCursos.children[1]) {
        listaCursos.removeChild( listaCursos.children[1])
    }
}

function resetearListaCursos() {
    submitBuscador.style.display = 'inline-block'
    botonBuscador.style.display = 'none'
    inputBuscador.value = ''
    limpiarListaCursos()
    mostrarCursos( cursosTodos )
}



// ================================= CARRITO =================================
// ===========================================================================
// funciones para la funcionalidad del Carrito
function agregarCurso( e ) {
    e.preventDefault()

    if ( e.target.classList.contains('agregar-carrito') ) {
        const cursoSeleccionado = e.target.parentElement.parentElement
        leerDatosCurso( cursoSeleccionado )
    }
}

function leerDatosCurso( curso ) {


        const infoCurso = {
            imagen  : curso.querySelector('img').src,
            titulo  : curso.querySelector('h4').textContent,
            precio  : curso.querySelector('.precio span').textContent,
            idCurso : curso.querySelector('.agregar-carrito').getAttribute('data-id'),
            cantidad: 1
        }

        const cursoExistente = articulosCarrito.find( articulo => articulo.idCurso === infoCurso.idCurso )

        if( cursoExistente ){
            cursoExistente.cantidad += 1        
            articulosCarrito = articulosCarrito.map( articuloMap =>{
                return  articuloMap.idCurso === cursoExistente.idCurso ? cursoExistente : articuloMap
            })
        }else{
            // Agregar al carrito de compras
            articulosCarrito = [ ...articulosCarrito, infoCurso ]
        }
        
        // Renderizamos el carrito en el HTML
        renderizarCarrito()
}


function renderizarCarrito() {

    // Limpiamos el HTML del carrito
    limpiarHTMLCarrito()

    // Recorremos el Array del carrito y creamos el HTML
    articulosCarrito.forEach( ( curso )=>{

        const { imagen, titulo, precio, cantidad, idCurso } = curso

        const row = document.createElement('tr')
        row.innerHTML = `
            <td>
                <img src="${ imagen }" alt="${ titulo }" width="100" />
            </td>
            <td>
                ${ titulo }
            </td>
            <td>
                ${ precio }
            </td>
            <td>
                ${ cantidad }
            </td>
            <td>
                <a href="#" class="borrar-curso" data-id="${ idCurso }"> X </a>
            </td>
        `

        // Agregar evento click al enlace para eliminar curso
        const btnEliminar = row.querySelector('.borrar-curso')
        btnEliminar.addEventListener('click', ()=> eliminarCurso( idCurso )) 
        
        
        
        // Por cada iteracion agregamos el elemento al HTML
        contendorCarrito.appendChild( row )
    })

    actualizarStorage()

}


function eliminarCurso(idCurso) {
        articulosCarrito = articulosCarrito.filter( curso => curso.idCurso !== idCurso )
        renderizarCarrito()

}

function eliminarTodos() {
    articulosCarrito = []
    limpiarHTMLCarrito()
    actualizarStorage()
}

function limpiarHTMLCarrito() {
    
    // contendorCarrito.innerHTML = '' // Forma lenta
    
    // Forma recomendada
    while (contendorCarrito.firstChild) {
        contendorCarrito.removeChild( contendorCarrito.firstChild )
    }
}

function actualizarStorage() {
    localStorage.setItem( storageKey, JSON.stringify(articulosCarrito) )
}