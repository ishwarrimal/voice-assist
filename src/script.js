import { initializeWebSpeech, registerGlobalCommands, makeRecognitionSound, updateInputValue } from "./utils/helper";

const globalCommandContext = {
    'create a task': 'create-task',
}

function initializeVoiceAssist(setGlobalSpeech){
    const {recognition, synthesis } = initializeWebSpeech()
    const globalCommands = registerGlobalCommands();
    let globalCommandInput = '';
    let skipInput = false;
    let activeElement;
    recognition.onresult = (event) => {
        const inputSpeech = event.results[0][0].transcript;
        if(activeElement.tagName === 'BODY'){
            console.log(inputSpeech)
            globalCommandInput = inputSpeech
            setGlobalSpeech(globalCommandInput)
        }
        else if(inputSpeech.toLowerCase() === 'next' || inputSpeech.toLowerCase() === 'previous'){
            skipInput = true;
            const sibling = inputSpeech === 'next' ? goNext() : goPrevious();
            activeElement = sibling
        }else{
            updateInputValue(activeElement, inputSpeech)
        }
    };
    recognition.onspeechend = () => {
        recognitionEnd();
    };

    function recognitionStart(){
        skipInput = false
        activeElement = document.activeElement
        try{
            makeRecognitionSound(true)
            recognition.start()
        }catch(e){
            console.log(e)
        }
    }

    function recognitionEnd(){
        recognition.stop();
        if(skipInput) return;
        setTimeout(() => {
            if(activeElement.tagName === 'BODY'){
                setTimeout(() => {
                    setGlobalSpeech('')
                }, 1000)
                triggerGlobalCommands()
                return;
            }
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

    function triggerGlobalCommands(){
        const command = Object.keys(globalCommandContext).find(cmd => cmd.toLowerCase() === globalCommandInput.toLowerCase())
        console.log(globalCommands, globalCommandContext[command])
        if(command && globalCommandContext[command]){
            globalCommands[globalCommandContext[command]].click()
        }
    }

    document.addEventListener('keydown', (e) => {
        if(e.ctrlKey){
            recognitionStart()
        }
    })
    document.addEventListener('keyup', (e) => {
        recognition.stop()
    })

}

export { initializeVoiceAssist }

