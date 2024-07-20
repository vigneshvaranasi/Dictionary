import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import vol from './assets/volume.png'


function App() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  let [wordInfo, setWordInfo] = useState('')

  async function wordSubmit(wordData) {
    console.log(wordData)
    let res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordData.word}`)
    let data = await res.json()
    console.log(data[0])
    setWordInfo(data[0])
  }
  return (
    <div className='max-w-md mx-auto'>
      <h1 className='text-center text-[#f1f1f1] text-5xl mt-6'>Dictionary</h1>

      {/* Form for getting the word to search */}
      <form className='mt-10 text-center m-5 ms-0 w-full' onSubmit={handleSubmit(wordSubmit)}>
        <input className='text-xl w-72 border-b-2 focus:border-b-2 outline-none bg-transparent' autoComplete='off' type="text" {...register('word', { required: true })} placeholder="Enter the word" />
        <button type="submit" className='ms-2 hover:border-b-2 mt-4'>Search</button>
        {errors.word && <span className='text-[#ff0000] text-center font-semibold mt-2 block'>Enter a Word to Search</span>}
      </form>

      {/* Displaying the word information */}
      {
        wordInfo &&
        <div>
          <div className='bg-[#f1f1f1] text-[#000] rounded-md m-5 p-5 text-start'>
            <div className='inline'>
              <h1 className='text-xl font-semibold'>{wordInfo.word}

                {
                  wordInfo.phonetics[0].audio &&
                  // On clicking the audio icon, the audio will be played
                  <img src={vol} width={22} alt='volume' className='ms-2 mb-1 inline cursor-pointer' onClick={() => {
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
              <div key={index} className='bg-[#f1f1f1] text-[#000] rounded-md m-5 p-5 text-start'>
                <h1 className='text-xl font-semibold capitalize'>{meaning.partOfSpeech}</h1>
                {
                  meaning.definitions.map((def, index) => (
                    <div key={index}>
                      <li className='text-lg text-[#767a8b] font-semibold'>{def.definition}</li>
                      {/* {
                        def.example &&
                        <p className='text-lg text-[#767a8b] font-semibold'>Example: {def.example}</p>
                      } */}
                    </div>
                  ))
                }
              </div>
            ))
          }
        </div>
      }
    </div>
  )
}

export default App