{
    wordInfo.meanings.map((meaning, index) => {
      return (
        <div key={index} className='mt-5'>
          <h2 className='text-xl'>Part of Speech: {meaning.partOfSpeech}</h2>
          {
            meaning.definitions.map((def, index) => {
              return (
                <div key={index} className='mt-2'>
                  <h3 className='text-lg'>Definition: {def.definition}</h3>
                  <p className='text-sm'>Example: {def.example}</p>
                  {
                    def.synonyms &&
                    <p className='text-sm'>Synonyms: {def.synonyms.join(', ')}</p>
                  }
                  {
                    def.antonyms &&
                    <p className='text-sm'>Antonyms: {def.antonyms.join(', ')}</p>
                  }
                </div>
              )
            })
          }
        </div>
      )
    })
  }