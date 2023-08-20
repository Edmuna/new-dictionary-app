import { useState } from "react"

let timeoutId;

const Dictionary = () => {

    const [typedWord, setTypedWord] = useState("")
    const [returnedWord, setReturnedWord] = useState([])
    const [returnedData, setReturnedData] = useState([])
    const [theme, setTheme] = useState("light")

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
    }

    const handleTypedWord = async e => {
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
                setReturnedWord(data[0].meanings);
                setReturnedData(data[0])
                console.log(returnedWord);
            } catch (err) {
                console.error(err);
            }
        }, 500);
    }

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
                    <div className="main__word"><h1>{returnedData.word}</h1></div>
                    <div className="prononciation">{returnedData.phonetic}</div>
                </div>
                <button className="play__button"><i className="fa-solid fa-play fa-2xl"></i></button>
            </div>
            <div className="item4"> <div className="noun">noun</div> <span className="line"></span></div>
            <div className="item5">
                <h4>Meaning</h4>
                <ul className="meanings__list">
                    {returnedWord.map((word, index) => (
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
            </div>
            <div className="item9">
                Source: <a href={returnedData.sourceUrls} target="_blank" rel="noopener noreferrer">{returnedData.sourceUrls}</a>
            </div>
        </div >
    )
}

export default Dictionary
