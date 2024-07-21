import React, { useState } from 'react'
import { set, useForm } from 'react-hook-form';
import speakerdark from './assets/speaker-dark.png'
import speakerLight from './assets/speaker-light.png'
import vol from './assets/volume.png'
import LoadingBar from './Animations/LoadingBar';
import './App.css'



function App() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  let [wordInfo, setWordInfo] = useState('')
  let [synonyms, setSynonyms] = useState([])
  let [antonyms, setAntonyms] = useState([])
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function wordSubmit(wordData) {
    setLoading(true);
    console.log(wordData)
    setWordInfo('');

    try {

      let res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordData.word}`)
      if (!res.ok) { // Check if response is not OK
        if (res.status === 404) {
          setErrorMessage('Word not found');
        } else {
          setErrorMessage('An error occurred');
        }
        setWordInfo('');
        return;
      }
      else {
        setErrorMessage('');
        let data = await res.json()
        console.log(data[0])
        setWordInfo(data[0]);

        // Getting the synonyms from the data
        const synonymsArray = data[0].meanings.flatMap(meaning => meaning.synonyms || []);
        const uniqueSynonyms = [...new Set(synonymsArray)];
        setSynonyms(uniqueSynonyms);

        // Getting the antonyms from the data
        const antonymsArray = data[0].meanings.flatMap(meaning => meaning.antonyms || []);
        const uniqueAntonyms = [...new Set(antonymsArray)];
        setAntonyms(uniqueAntonyms);
      }
    }
    catch (error) {
      setErrorMessage('An error occurred');
    }
    finally {
      setLoading(false);
    }
  }
  return (
    <div className='max-w-md mx-auto bg-[#fefefe] dark:bg-[#0e0e0e]'>
      <h1 className='text-center  text-[#000] text-5xl mt-6 dark:text-[#f1f1f1]'>Dictionary</h1>

      {/* Form for getting the word to search */}
      <form className='mt-10 text-center m-5 ms-0 w-full' onSubmit={handleSubmit(wordSubmit)}>
        <input className='text-xl w-72 border-b-2 focus:border-b-2 outline-none bg-transparent rounded-none' autoComplete='off' type="text" {...register('word', { required: true })} placeholder="Enter the word" />
        <button type="submit" className='searchBtn ms-2 hover:border-b-2 mt-4'>Search</button>
        {errors.word && <span className='text-[#ff0000] text-center font-semibold mt-2 block'>Enter a Word to Search</span>}
      </form>

      {/* Display error message */}
      {errorMessage && <div className='text-center text-[#ff0000] font-semibold mt-4'>{errorMessage}</div>}

      {/* Displaying the word information */}
      {
        wordInfo &&
        <div>
          <div className='bg-[#f1f1f1] text-[#000] rounded-md m-5 p-5 text-start dark:bg-[#343434] dark:text-[#f1f1f1]'>
            <div className='inline'>
              <h1 className='text-xl font-semibold'>{wordInfo.word}
                {
                  wordInfo.phonetics[0].audio &&
                  // On clicking the audio icon, the audio will be played
                  <img src={vol} width={22} alt='speaker' className='ms-2 mb-1 inline cursor-pointer' onClick={() => {
                    let audio = new Audio(wordInfo.phonetics[0].audio)
                    audio.play()
                  }} />
                }
              </h1>
            </div>
            {
              wordInfo.phonetics[0].text &&
              <p className='text-lg text-[#767a8b] font-semibold'>pronunications: {wordInfo.phonetics[0].text}</p>
            }
          </div>
          {
            wordInfo.meanings.map((meaning, index) => (
              <div key={index} className='bg-[#f1f1f1] text-[#000] rounded-md m-5 p-5 text-start dark:bg-[#343434] dark:text-[#f1f1f1]'>
                <h1 className='text-xl font-semibold capitalize'>{meaning.partOfSpeech}</h1>
                {
                  meaning.definitions.map((def, index) => (
                    <div key={index}>
                      <li className='text-lg text-[#767a8b] font-semibold dark:text-[#767a8b] '>{def.definition}</li>
                    </div>
                  ))
                }
              </div>
            ))
          }

          {/* Synonyms */}
          {
            synonyms.length > 0 &&
            <div className='bg-[#f1f1f1] text-[#000] rounded-md m-5 p-5 text-start dark:bg-[#343434] dark:text-[#f1f1f1]'>
              <h1 className='text-xl font-semibold'>Synonyms</h1>
              <div className='flex flex-wrap'>
                {
                  synonyms.map((synonym, index) => (
                    <p key={index} className='text-lg text-[#767a8b] font-semibold dark:text-[#767a8b] rounded-md m-1'>{synonym}</p>
                  ))
                }
              </div>
            </div>
          }

          {/* Antonyms */}
          {
            antonyms.length > 0 &&
            <div className='bg-[#f1f1f1] text-[#000] rounded-md m-5 p-5 text-start dark:bg-[#343434] dark:text-[#f1f1f1]'>
              <h1 className='text-xl font-semibold'>Antonyms</h1>
              <div className='flex flex-wrap'>
                {
                  antonyms.map((antonym, index) => (
                    <p key={index} className='text-lg text-[#767a8b] font-semibold dark:text-[#767a8b] rounded-md m-1'>{antonym}</p>
                  ))
                }
              </div>
            </div>
          }
        </div>
      }

      {/* Display loading bar */}
      {loading && <LoadingBar/>}
    </div>
  )
}

export default App