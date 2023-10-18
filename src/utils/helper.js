function initializeWebSpeech(){
    let recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    let synthesis = window.speechSynthesis;
    return { recognition, synthesis }
}

function registerGlobalCommands(){
    const globalCommands = [...document.querySelectorAll('[data-global-command')]
    const returnCommandsObj = {}
    globalCommands.forEach(cmd => { 
        const key = cmd.dataset.globalCommand
        returnCommandsObj[key] = cmd
    })
    return returnCommandsObj;
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
        case 'date':
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const dueDate = content === "today" ? today.toISOString().slice(0, 10) : tomorrow.toISOString().slice(0, 10)
            element.value = dueDate
            break
        default:
            break;
    }
}

export { initializeWebSpeech, registerGlobalCommands, makeRecognitionSound, updateInputValue }