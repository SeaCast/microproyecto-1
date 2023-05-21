// Elementos de html
const startButton = document.getElementById("nameButton"); //Boton
const gameElement = document.getElementById("gameArea"); //Area de cartas
const inputArea = document.getElementById("pName"); //Input de nombre de usuario
const timerArea = document.getElementById("gameTime"); //Temporizador


// Cantidad de cartas y tipos de cartas
const cardArea = document.getElementsByClassName("gameArea")
const cards = ["Conspiracion", "Espinal", "Gato", "Gente", "Grases", "Guri", "Premio", "Singre"];


//Variables de juego
let gameState = false;
let revealedCards = 0;
let activeCard = null;
let awaitingEndOfMove = false;
let playerName = "";  //Se inicializa el nombre de usuario 
const timerMinutes = 3;
let currentTime = 0;
let minutes = 0;
let seconds = 0;

//Funciones

const updateTimer = () => {
    minutes = Math.floor(currentTime / 60);
    seconds = currentTime % 60;

    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerArea.innerHTML = `${minutes}m : ${seconds}s`;
    currentTime--;
}

startButton.addEventListener("click", async () => {

    playerName = inputArea.value;
    console.log(playerName);
    if (playerName === ""){
        alert("No puede ingresar un nombre de usuario vacio");
        return;
    } else if(playerName === "Nombre"){
        alert("Muy gracioso");
        return;
    }

    startButton.style.display = "none";
    inputArea.style.display = "none";
    timerArea.style.display = "block";
    currentTime = timerMinutes * 60;

    let gameTimer = setInterval(updateTimer, 1000);

    let timeLimit = setTimeout(() => {

        alert("Se acabo el tiempo");
        gameElement.innerHTML = "";
        revealedCards = 0;
        startButton.style.display = "block";
        inputArea.style.display = "inline";
        timerArea.style.display = "none";
        activeCard = null;
        awaitingEndOfMove = false;
        playerName = "";
        clearInterval(gameTimer);

    }, 180000);


    //Se crea un array de cartas posibles compuesto por el array de cartas 2 veces
    const cardsList = [...cards, ...cards];
    //Se evalua la cantidad total de cartas para determinas cuantas crear
    const cardAmount = cardsList.length;
    //Se inicializa el string que correspondera al codigo html a insertar
    let finalString = '';

    for (let i = 0; i < cardAmount; i++){
        //Se seleccciona un elemento aleatorio de la lista de cartas posibles
        const randomIndex = Math.floor(Math.random() * cardsList.length);
        const card = cardsList[randomIndex];
        //Se elimina la carta seleccionada de la lista
        cardsList.splice(randomIndex, 1);

        /*
        Se crea el elemento de carta, asignando su clase respectiva, un id que determina que carta es y si ya se revelo.
        Tambien el evento de revelar la carta al hacer click
        */
        const element = document.createElement("div");
        element.setAttribute("class", "gameCard")
        element.setAttribute("id", card)
        element.setAttribute("data-revealed", "false");
        element.addEventListener("click", () => {
            const revealed = element.getAttribute("data-revealed");

            //Si esta en espera de que se oculten las cartas o ya se revelo la carta, no se realiza nada
            if (awaitingEndOfMove || revealed === "true") {
                return;
            }

            //Si no hay nada en espera y la carta no se ha revelado, se cambia su imagen de fondo para revelarla de acuerdo a su tipo
            element.style.backgroundImage = `url(${card}.png)`

            //Si no hay carta activa, se asigna la ultima revelada como activa
            if (!activeCard) {
                activeCard = element;

                return;
            }

            //Si hay carta activa, se asigna a una variable el id de la carta activa
            const cardToMatch = activeCard.getAttribute("id")

            /*Si la carta activa es igual a la revelada, se indica que el par se revelo, se elimina la espera, la carta activa,
            y se incrementa la cantidad de cartas reveladas, luego, si la cantidad de cartas reveladas es igual al total, se finaliza
            el juego y se considera que el usuario gano, procediendo a reiniciar el area de juego eliminando las cartas y reseteando
            la cantidad de cartas reveladas

            */
            if (cardToMatch === element.getAttribute("id")){
                activeCard.setAttribute("data-revealed", "true");
                element.setAttribute("data-revealed", "true");

                awaitingEndOfMove = false;
                activeCard = null;
                revealedCards += 2;

                console.log(revealedCards);

                if (revealedCards === cardAmount){
                    alert("Has ganado!");
                    gameElement.innerHTML = "";
                    revealedCards = 0;
                    startButton.style.display = "block";
                    inputArea.style.display = "inline";
                    timerArea.style.display = "none";
                    activeCard = null;
                    awaitingEndOfMove = false;
                    clearTimeout(timeLimit);
                    clearInterval(gameTimer);

                }

                return;

            }
            //Si las cartas no son iguales, se mantienen visibles brevemente y se impide al usuario revelar mas cartas
            awaitingEndOfMove = true;
            //Se espera un poco de tiempo y se ocultan de nuevo las cartas
            setTimeout(() => {
                element.style.backgroundImage = `url(Nada.png)`
                activeCard.style.backgroundImage = `url(Nada.png)`

                awaitingEndOfMove = false;
                activeCard = null;

            }, 1000)
        })

        //Se añade la carta creada al area de juego
        gameElement.appendChild(element);

    }

})