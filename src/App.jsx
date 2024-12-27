import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import vol from './assets/volume.png';
import speaker from './assets/speaker.svg';
import LoadingBar from './Animations/LoadingBar';
import darkSpeaker from './assets/speaker-dark.svg';
import lightSpeaker from './assets/speaker-light.svg';
import './App.css';
import './index.css';

function App() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  let [wordInfo, setWordInfo] = useState('');
  let [synonyms, setSynonyms] = useState([]);
  let [antonyms, setAntonyms] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Get the system theme and set the theme accordingly
  useEffect(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log('systemTheme: ', systemTheme);
    setIsDarkMode(systemTheme);
  }, []);
  
  useEffect(()=>{
    console.log(isDarkMode);
  })

  async function wordSubmit(wordData) {
    setLoading(true);
    setWordInfo('');

    try {
      const encodedWord = encodeURIComponent(wordData.word);
      let res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodedWord}`);
      if (!res.ok) {
        if (res.status === 404) {
          setErrorMessage('Word not found');
        }
        else {
          setErrorMessage('An error occurred');
        }
        setWordInfo('');
        return;
      }
      else {
        setErrorMessage('');
        let data = await res.json();
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
    } catch (error) {
      setErrorMessage('An error occurred');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (wordInfo) {
      const boxes = document.querySelectorAll('.staggered-box');
      boxes.forEach((box, index) => {
        box.style.animationDelay = `${index * 0.1}s`;
      });
    }
  }, [wordInfo, synonyms, antonyms]);

  return (
    <div className='max-w-md mx-auto bg-[#fefefe] dark:bg-[#0e0e0e]'>
      <h1 className='text-center  text-[--text-light] text-5xl mt-6 dark:text-[--text-dark]'>Dictionary</h1>

      {/* Form for getting the word to search */}
      <form className='mt-10 text-center m-5 ms-0 w-full' onSubmit={handleSubmit(wordSubmit)}>
        <input className='text-xl w-72 border-b-2 focus:border-b-2 outline-none bg-transparent rounded-none' autoComplete='off' autoFocus type="text" {...register('word', { required: true })} placeholder="Enter the word" />
        <button type="submit" className='searchBtn ms-2 hover:border-b-2 mt-4'>Search</button>
        {errors.word && <span className='text-[#ff0000] text-center font-semibold mt-2 block'>Enter a Word to Search</span>}
      </form>

      {/* Display error message */}
      {errorMessage && <div className='text-center text-[#ff0000] font-semibold mt-4'>{errorMessage}</div>}

      {/* Displaying the word information */}
      {wordInfo &&
        <div>
          <div className='bg-[--bg-light] text-[--text-light] rounded-md m-5 p-5 text-start dark:bg-[--bg-dark] dark:text-[--text-dark] staggered-box'>
            <div className='inline'>
              <h1 className='text-xl font-semibold'>{wordInfo.word}
                {wordInfo.phonetics && wordInfo.phonetics[0] && wordInfo.phonetics[0].audio && !isDarkMode &&
                  <img src={lightSpeaker} width={25} alt='speaker' className='ms-2 mb-1 inline cursor-pointer dark:text-[#fff]' onClick={() => {
                    let audio = new Audio(wordInfo.phonetics[0].audio);
                    audio.play();
                  }} />
                }
                {wordInfo.phonetics && wordInfo.phonetics[0] && wordInfo.phonetics[0].audio && isDarkMode &&
                  <img src={darkSpeaker} width={25} alt='speaker' className='ms-2 mb-1 inline cursor-pointer dark:text-[#fff]' onClick={() => {
                    let audio = new Audio(wordInfo.phonetics[0].audio);
                    audio.play();
                  }} />
                }
              </h1>
            </div>
            {wordInfo.phonetics && wordInfo.phonetics[0] && wordInfo.phonetics[0].text &&
              <p className='text-lg text-[--secondary-text-light] dark:text-[--secondary-text-dark]'>pronunciation: {wordInfo.phonetics[0].text}</p>
            }
          </div>
          {wordInfo.meanings.map((meaning, index) => (
            <div key={index} className='bg-[--bg-light] text-[--text-light] rounded-md m-5 p-5 text-start dark:bg-[--bg-dark] dark:text-[--text-dark] staggered-box'>
              <h1 className='text-xl font-semibold capitalize'>{meaning.partOfSpeech}</h1>
              {meaning.definitions.map((def, defIndex) => (
                <div key={defIndex}>
                  <li className='text-lg text-[--secondary-text-light] leading-9 dark:text-[--secondary-text-dark]'>{def.definition}</li>
                </div>
              ))}
            </div>
          ))}
          {synonyms.length > 0 &&
            <div className='bg-[--bg-light] text-[--text-light] rounded-md m-5 p-5 text-start dark:bg-[--bg-dark] dark:text-[--text-dark] staggered-box'>
              <h1 className='text-xl font-semibold'>Synonyms</h1>
              <div className='flex flex-wrap'>
                {synonyms.map((synonym, index) => (
                  <p key={index} className='text-lg text-[--secondary-text-light] dark:text-[--secondary-text-dark] rounded-md m-1'>{synonym}{index < synonyms.length - 1 && ','}</p>
                ))}
              </div>
            </div>
          }
          {antonyms.length > 0 &&
            <div className='bg-[--bg-light] text-[--text-light] rounded-md m-5 p-5 text-start dark:bg-[--bg-dark] dark:text-[--text-dark] staggered-box'>
              <h1 className='text-xl font-semibold'>Antonyms</h1>
              <div className='flex flex-wrap'>
                {antonyms.map((antonym, index) => (
                  <p key={index} className='text-lg text-[--secondary-text-light] dark:text-[--secondary-text-dark] rounded-md m-1'>{antonym}{index < antonyms.length - 1 && ','}</p>
                ))}
              </div>
            </div>
          }
        </div>
      }

      {/* Display loading bar */}
      {loading && <LoadingBar />}
    </div>
  );
}

export default App;
