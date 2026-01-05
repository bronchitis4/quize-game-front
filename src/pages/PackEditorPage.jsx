import { useState } from 'react';
import { Link } from 'react-router-dom';
import { convertYouTubeUrl, isYouTubeUrl, convertGitHubUrl } from '../utils/convertLinks';

const PackEditorPage = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Add new category
  const addCategory = () => {
    const newCategory = {
      id: Date.now(),
      title: '',
      questions: []
    };
    setCategories([...categories, newCategory]);
    setEditingCategory(newCategory.id);
  };

  // Update category title
  const updateCategoryTitle = (categoryId, title) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, title } : cat
    ));
  };

  // Delete category
  const deleteCategory = (categoryId) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    if (editingCategory === categoryId) {
      setEditingCategory(null);
    }
  };

  // Add question to category
  const addQuestion = (categoryId) => {
    const newQuestion = {
      id: Date.now(),
      type: 'text',
      content: '',
      text: '',
      points: 100,
      answer: {
        type: 'text',
        text: '',
        content: '',
        backgroundMusic: ''
      }
    };
    
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, questions: [...cat.questions, newQuestion] }
        : cat
    ));
    setEditingQuestion(newQuestion.id);
  };

  // Update question
  const updateQuestion = (categoryId, questionId, updates) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? {
            ...cat,
            questions: cat.questions.map(q => 
              q.id === questionId ? { ...q, ...updates } : q
            )
          }
        : cat
    ));
  };

  // Delete question
  const deleteQuestion = (categoryId, questionId) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, questions: cat.questions.filter(q => q.id !== questionId) }
        : cat
    ));
    if (editingQuestion === questionId) {
      setEditingQuestion(null);
    }
  };

  // Export pack as JSON
  const exportPack = () => {
    const pack = {
      categories: categories.map(cat => ({
        title: cat.title,
        questions: cat.questions.map(q => {
          const question = {
            points: q.points,
            type: q.type,
            content: q.content
          };
          
          // Add optional text field
          if (q.text) {
            question.text = q.text;
          }
          
          // Build answer object
          const answer = {
            type: q.answer.type,
            text: q.answer.text
          };
          
          // Add content if answer has image/video/audio
          if (q.answer.type !== 'text' && q.answer.content) {
            answer.content = q.answer.content;
          }
          
          // Add background music if present
          if (q.answer.backgroundMusic) {
            answer.backgroundMusic = q.answer.backgroundMusic;
          }
          
          question.answer = answer;
          
          return question;
        })
      }))
    };

    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pack.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import pack from JSON
  const importPack = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result);
          setCategories(jsonData.categories.map((cat, idx) => ({
            id: Date.now() + idx,
            title: cat.title,
            questions: cat.questions.map((q, qIdx) => ({
              id: Date.now() + idx * 1000 + qIdx,
              ...q
            }))
          })));
        } catch (error) {
          alert('Помилка завантаження файлу');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#2a2a2a] mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-white">Створення паків</h1>
            <Link to="/" className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white px-4 py-2 rounded text-sm border border-[#3a3a3a]">
              Назад
            </Link>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={addCategory}
              className="bg-[#0d7bda] hover:bg-[#0a66b8] text-white px-4 py-2 rounded font-bold transition-colors"
            >
              Додати категорію
            </button>
            
            <button
              onClick={exportPack}
              className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded font-bold transition-colors"
            >
              Експортувати JSON
            </button>

            <label className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white px-4 py-2 rounded font-bold transition-colors cursor-pointer border border-[#3a3a3a]">
              Імпортувати JSON
              <input
                type="file"
                accept=".json"
                onChange={importPack}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-[#1a1a1a] p-6 rounded-lg border border-[#2a2a2a]">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Назва категорії"
                  value={category.title}
                  onChange={(e) => updateCategoryTitle(category.id, e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-lg font-bold focus:outline-none focus:border-[#0d7bda]"
                />
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="bg-red-700 hover:bg-red-600 text-white px-3 py-2 rounded font-bold transition-colors"
                >
                  Видалити
                </button>
              </div>

              <button
                onClick={() => addQuestion(category.id)}
                className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white px-3 py-2 rounded font-bold transition-colors border border-[#3a3a3a] mb-4"
              >
                Додати питання
              </button>

              {/* Questions */}
              <div className="space-y-3">
                {category.questions.map((question) => (
                  <div key={question.id} className="bg-[#2a2a2a] p-4 rounded border border-[#3a3a3a]">
                    <div className="flex justify-between items-start mb-3">
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(category.id, question.id, { type: e.target.value })}
                        className="px-2 py-1 bg-[#3a3a3a] border border-[#4a4a4a] rounded text-white text-sm focus:outline-none focus:border-[#0d7bda]"
                      >
                        <option value="text">Текст</option>
                        <option value="image">Зображення</option>
                        <option value="video">Відео</option>
                        <option value="audio">Аудіо</option>
                      </select>

                      <input
                        type="number"
                        value={question.points}
                        onChange={(e) => updateQuestion(category.id, question.id, { points: parseInt(e.target.value) })}
                        className="w-20 px-2 py-1 bg-[#3a3a3a] border border-[#4a4a4a] rounded text-white text-sm text-center focus:outline-none focus:border-[#0d7bda]"
                        placeholder="Очки"
                      />

                      <button
                        onClick={() => deleteQuestion(category.id, question.id)}
                        className="bg-red-700 hover:bg-red-600 text-white px-2 py-1 rounded text-sm font-bold transition-colors"
                      >
                        Видалити
                      </button>
                    </div>

                    {question.type !== 'text' && (
                      <>
                        <input
                          type="text"
                          placeholder="URL контенту (зображення/відео/аудіо)"
                          value={question.content}
                          onChange={(e) => updateQuestion(category.id, question.id, { content: e.target.value })}
                          className="w-full px-3 py-2 bg-[#3a3a3a] border border-[#4a4a4a] rounded text-white text-sm mb-2 focus:outline-none focus:border-[#0d7bda]"
                        />
                        
                        {/* Preview for question content */}
                        {question.content && (
                          <div className="mb-2 bg-[#1a1a1a] p-2 rounded border border-[#3a3a3a]">
                            {question.type === 'image' && (
                              <img 
                                src={convertGitHubUrl(question.content)} 
                                alt="Preview" 
                                className="max-w-full max-h-40 rounded"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'block';
                                }}
                              />
                            )}
                            {question.type === 'video' && (
                              <>
                                {isYouTubeUrl(question.content) ? (
                                  <iframe
                                    src={convertYouTubeUrl(question.content)}
                                    className="w-full h-40 rounded"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                ) : (
                                  <video 
                                    src={convertGitHubUrl(question.content)} 
                                    controls 
                                    className="max-w-full max-h-40 rounded"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'block';
                                    }}
                                  />
                                )}
                              </>
                            )}
                            {question.type === 'audio' && (
                              <audio 
                                src={convertGitHubUrl(question.content)} 
                                controls 
                                className="w-full"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'block';
                                }}
                              />
                            )}
                            <div className="text-red-400 text-xs mt-1" style={{display: 'none'}}>
                              ❌ Не вдалося завантажити медіа
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    <textarea
                      placeholder={question.type === 'text' ? "Текст питання" : "Додатковий текст (опціонально)"}
                      value={question.type === 'text' ? question.content : question.text || ''}
                      onChange={(e) => updateQuestion(category.id, question.id, 
                        question.type === 'text' 
                          ? { content: e.target.value }
                          : { text: e.target.value }
                      )}
                      className="w-full px-3 py-2 bg-[#3a3a3a] border border-[#4a4a4a] rounded text-white text-sm mb-2 focus:outline-none focus:border-[#0d7bda] min-h-[60px]"
                    />

                    <div className="bg-[#1a1a1a] p-3 rounded border border-[#3a3a3a] mt-3">
                      <div className="text-gray-400 text-xs mb-2 font-bold">ВІДПОВІДЬ</div>
                      
                      <select
                        value={question.answer?.type || 'text'}
                        onChange={(e) => updateQuestion(category.id, question.id, { 
                          answer: { ...question.answer, type: e.target.value }
                        })}
                        className="w-full px-2 py-1 bg-[#3a3a3a] border border-[#4a4a4a] rounded text-white text-sm mb-2 focus:outline-none focus:border-[#0d7bda]"
                      >
                        <option value="text">Текст</option>
                        <option value="image">Зображення</option>
                        <option value="video">Відео</option>
                        <option value="audio">Аудіо</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Текст відповіді"
                        value={question.answer?.text || ''}
                        onChange={(e) => updateQuestion(category.id, question.id, { 
                          answer: { ...question.answer, text: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-[#3a3a3a] border border-[#4a4a4a] rounded text-white text-sm mb-2 focus:outline-none focus:border-[#0d7bda]"
                      />

                      {question.answer?.type !== 'text' && (
                        <>
                          <input
                            type="text"
                            placeholder="URL контенту відповіді (зображення/відео/аудіо)"
                            value={question.answer?.content || ''}
                            onChange={(e) => updateQuestion(category.id, question.id, { 
                              answer: { ...question.answer, content: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-[#3a3a3a] border border-[#4a4a4a] rounded text-white text-sm mb-2 focus:outline-none focus:border-[#0d7bda]"
                          />
                          
                          {/* Preview for answer content */}
                          {question.answer?.content && (
                            <div className="mb-2 bg-[#0f0f0f] p-2 rounded border border-[#2a2a2a]">
                              {question.answer.type === 'image' && (
                                <img 
                                  src={convertGitHubUrl(question.answer.content)} 
                                  alt="Answer Preview" 
                                  className="max-w-full max-h-40 rounded"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                  }}
                                />
                              )}
                              {question.answer.type === 'video' && (
                                <>
                                  {isYouTubeUrl(question.answer.content) ? (
                                    <iframe
                                      src={convertYouTubeUrl(question.answer.content)}
                                      className="w-full h-40 rounded"
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    />
                                  ) : (
                                    <video 
                                      src={convertGitHubUrl(question.answer.content)} 
                                      controls 
                                      className="max-w-full max-h-40 rounded"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                      }}
                                    />
                                  )}
                                </>
                              )}
                              {question.answer.type === 'audio' && (
                                <audio 
                                  src={convertGitHubUrl(question.answer.content)} 
                                  controls 
                                  className="w-full"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                  }}
                                />
                              )}
                              <div className="text-red-400 text-xs mt-1" style={{display: 'none'}}>
                                ❌ Не вдалося завантажити медіа
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {question.answer?.backgroundMusic && (
                        <div className="mb-2 bg-[#0f0f0f] p-2 rounded border border-[#2a2a2a]">
                          <div className="text-gray-400 text-xs mb-1">Фонова музика:</div>
                          <audio 
                            src={convertGitHubUrl(question.answer.backgroundMusic)} 
                            controls 
                            className="w-full"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                          <div className="text-red-400 text-xs mt-1" style={{display: 'none'}}>
                            ❌ Не вдалося завантажити аудіо
                          </div>
                        </div>
                      )}

                      <input
                        type="text"
                        placeholder="URL фонової музики (опціонально)"
                        value={question.answer?.backgroundMusic || ''}
                        onChange={(e) => updateQuestion(category.id, question.id, { 
                          answer: { ...question.answer, backgroundMusic: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-[#3a3a3a] border border-[#4a4a4a] rounded text-white text-sm focus:outline-none focus:border-[#0d7bda]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl mb-4">Немає категорій</p>
            <p className="text-sm">Натисніть "Додати категорію" щоб почати</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackEditorPage;
