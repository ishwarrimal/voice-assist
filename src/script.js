import { initializeWebSpeech, registerGlobalCommands, makeRecognitionSound, updateInputValue } from "./utils/helper";

const globalCommandContext = {
    'create a task': 'create-task',
}

function initializeVoiceAssist(setGlobalSpeech){
    const {recognition, synthesis } = initializeWebSpeech()
    const globalCommands = registerGlobalCommands();
    let globalCommandInput = '';
    let localCommandInput = ''
    let skipInput = false;
    let activeElement;
    recognition.onresult = (event) => {
        localCommandInput = event.results[0][0].transcript;
        let lowerInputSpeech = localCommandInput.toLowerCase()
        if(activeElement.tagName === 'BODY'){
            console.log(localCommandInput)
            globalCommandInput = localCommandInput
            setGlobalSpeech(globalCommandInput)
        }
        else if(lowerInputSpeech === 'help' || lowerInputSpeech === 'clear'){
            return;
        }
        else if(lowerInputSpeech === 'next' || lowerInputSpeech === 'previous'){
            skipInput = true;
            const sibling = localCommandInput === 'next' ? goNext() : goPrevious();
            activeElement = sibling
        }else{
            updateInputValue(activeElement, localCommandInput)
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
            let utterThis = new SpeechSynthesisUtterance(localCommandInput);
            const textInLower = utterThis.text?.toLocaleLowerCase()
            if(textInLower === 'help' || textInLower === 'clear'){
                updateInputValue(activeElement, '')
                const ariaValue = activeElement.getAttribute('aria-label') || document.querySelector(`label[for="${activeElement.id}"]`);
                utterThis = new SpeechSynthesisUtterance(textInLower === 'help' ? `Enter ${ariaValue.textContent}` : `Clearing the content of ${ariaValue.textContent}`)
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
        if(command && globalCommandContext[command]){
            globalCommands[globalCommandContext[command]].click()
        }
        globalCommandInput = ''
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

