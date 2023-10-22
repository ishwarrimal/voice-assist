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

function getInputType(type){
    return type === "textarea" ? window.HTMLTextAreaElement : window.HTMLInputElement
}

function updateInputValue(element, content){
    const fieldType = element.dataset.sonicType || element.type;

    function handleInputUpdate(value){
        const inputType = getInputType(fieldType)
        var nativeInputValueSetter = Object.getOwnPropertyDescriptor(inputType.prototype, "value").set;
        nativeInputValueSetter.call(element, value);
        var ev2 = new Event('input', { bubbles: true});
        element.dispatchEvent(ev2);
    }
    
    switch(element.type){
        case 'text':
        case 'textarea':
            handleInputUpdate(content)
            break;
        case 'number':
            let inputContent = !isNaN(content) && Number(content)
            inputContent && handleInputUpdate(inputContent)
            break;
        case 'select-one':
            //no need to handle select
            // const options = [...element.options].map(option => option.value)
            // const selectedOption = options.find(option => option.toLowerCase() === content.toLowerCase())
            // if(selectedOption){
            //     element.value = selectedOption;
            // }
            break;
        case 'date':
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            if(content !== "today" && content !== "tomorrow") return;
            const dueDate = content === "today" ? today.toISOString().slice(0, 10) : tomorrow.toISOString().slice(0, 10)
            handleInputUpdate(dueDate)
            break
        default:
            break;
    }
}

export { initializeWebSpeech, registerGlobalCommands, makeRecognitionSound, updateInputValue }