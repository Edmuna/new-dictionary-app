import { useState, useEffect } from "react"

let timeoutId;

const Dictionary = () => {

    const [typedWord, setTypedWord] = useState("")
    const [returnedWord, setReturnedWord] = useState([])
    const [returnedData, setReturnedData] = useState([])
    const [theme, setTheme] = useState("light")
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [wordNotFound, setWordNotFound] = useState(false)

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
    }

    const handleTypedWord = async (e) => {
        e.preventDefault();
        const newTypedWord = e.target.value;
        setTypedWord(newTypedWord);

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(async () => {
            const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${newTypedWord}`;

            try {
                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.length > 0) {
                    setReturnedWord(data[0].meanings);
                    setReturnedData(data[0]);
                    setWordNotFound(false); // Reset word not found state
                } else {
                    setWordNotFound(true);
                }
            } catch (err) {
                console.error(err);
            }
        }, 500);
    };


    const speakWord = (word) => {
        const speech = new SpeechSynthesisUtterance();
        speech.text = word;

        // Add onend event handler
        speech.onend = () => {
            setIsSpeaking(false); // Reset the state when speech finishes
        };

        window.speechSynthesis.speak(speech);
    };


    useEffect(() => {
        if (isSpeaking) {
            speakWord(returnedData.word);
        }
    }, [isSpeaking, returnedData.word]);




    return (

        <div className={`grid__container ${theme}`}>
            <div className="item1">
                <div className="logo"><i className="fa-solid fa-book fa-2xl"></i></div>
                <div className="settings">
                    <div className="serif">Serif</div>
                    <div onClick={toggleTheme} className="theme"><i className="fa-solid fa-toggle-off fa-xl">
                    </i></div>
                </div>
            </div>
            <div className="item2">
                <input type="text" onChange={handleTypedWord} />
            </div>
            <div className="item3">
                <div className="word">
                    {wordNotFound ? (
                        <div className="main__word"><h1>Word not found</h1></div>
                    ) : (
                        <div>
                            <div className="main__word"><h1>{returnedData.word}</h1></div>
                            <div className="prononciation">{returnedData.phonetic}</div>
                        </div>
                    )}
                </div>
                <button
                    className="play__button"
                    onClick={() => setIsSpeaking(!isSpeaking)}
                    aria-label={isSpeaking ? "Pause Speech" : "Play Speech"}
                >
                    <i className={`fa-solid fa-${isSpeaking ? 'pause' : 'play'} fa-2xl`}></i>
                </button>
            </div>
            <div className="item4"> <div className="noun">noun</div> <span className="line"></span></div>
            <div className="item5">
                <h4>Meaning</h4>
                <ul className="meanings__list">
                    {!wordNotFound && returnedWord.map((word, index) => (
                        <div key={index}>
                            {word.definitions.slice(0, 10).map((definition, definitionIndex) => (
                                <li className="list__item" key={definitionIndex}>{definition.definition}</li>
                            ))}
                        </div>
                    ))}
                </ul>
            </div>
            <div className="item6">
                <div className="synonym">Synonym</div>
                {!wordNotFound && (
                    <div className="synonyms__fetched">
                        {returnedWord.map((word, index) => (
                            <div key={index}>
                                {word.synonyms.slice(0, 2).map((synonym, synonymIndex) => (
                                    <button
                                        key={synonymIndex}
                                        className="synonym__button"
                                        onClick={() => setTypedWord(synonym)}
                                    >
                                        {synonym}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="item9">
                {!wordNotFound && (
                    <span>
                        Source: <a href={returnedData.sourceUrls} target="_blank" rel="noopener noreferrer">{returnedData.sourceUrls}</a>
                    </span>
                )}
            </div>
        </div >
    )
}

export default Dictionary
