function initializeWebSpeech(){
    let recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    let synthesis = window.speechSynthesis;
    return { recognition, synthesis }
}

function makeRecognitionSound(){
    var context = new AudioContext();
    var oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = 400;
    oscillator.connect(context.destination);
    oscillator.start(); 
    setTimeout(function () {
        oscillator.stop();
    }, 50);  
}

function updateInputValue(element, content){
    switch(element.type){
        case 'text':
        case 'textarea':
            element.value = content;
            break;
        case 'select-one':
            const options = [...element.options].map(option => option.value)
            const selectedOption = options.find(option => option.toLowerCase() === content.toLowerCase())
            if(selectedOption){
                element.value = selectedOption;
            }
            break;
        default:
            break;
    }
}

(() => {
    const {recognition, synthesis } = initializeWebSpeech()
    let skipInput = false;
    let activeElement;
    recognition.onresult = (event) => {
        const inputSpeech = event.results[0][0].transcript;
        console.log(inputSpeech, activeElement)
        if(!inputSpeech) return
        if(inputSpeech.toLowerCase() === 'next' || inputSpeech.toLowerCase() === 'previous'){
            skipInput = true;
            const sibling = inputSpeech === 'next' ? goNext() : goPrevious();
            activeElement = sibling
            return;
        }
        updateInputValue(activeElement, inputSpeech)
    };
    recognition.onspeechend = () => {
        recognitionEnd();
    };

    function recognitionStart(){
        skipInput = false
        activeElement = document.activeElement
        makeRecognitionSound(true)
        recognition.start()
    }

    function recognitionEnd(){
        recognition.stop();
        if(skipInput) return;
        setTimeout(() => {
            let utterThis = new SpeechSynthesisUtterance(activeElement.value);
            const textInLower = utterThis.text?.toLocaleLowerCase()
            if(textInLower === 'help' || textInLower === 'clear'){
                updateInputValue(activeElement, '')
                const ariaValue = document.querySelector(`label[for="${activeElement.id}"]`);
                utterThis = new SpeechSynthesisUtterance(textInLower === 'help' ? `The label for this field is ${ariaValue.textContent}` : `Clearing the content of ${ariaValue.textContent}`)
            }
            synthesis.speak(utterThis)
        },1000)
    }

    function goNext(){
        const nextSib = activeElement.nextSibling;
        nextSib && nextSib.focus()
        return nextSib
    }

    function goPrevious(){
        const previousSib = activeElement.previousSibling;
        previousSib && previousSib.focus()
        return previousSib
    }

    document.addEventListener('keydown', (e) => {
        if(e.ctrlKey){
            recognitionStart()
        }
    })
    document.addEventListener('keyup', (e) => {
        recognition.stop()
    })

})()


